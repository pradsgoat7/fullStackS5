// End-to-end API tests: starts the real server against a throwaway database and checks
// auth, roles, food CRUD, Socket.IO and rate limiting. Run with: npm test
// Needs MongoDB; set TEST_MONGO_URI to use a different server (default: local MongoDB).
const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { spawn, execFileSync } = require("child_process");
const mongoose = require("mongoose");
const { io } = require("socket.io-client");

const PORT = 5097;
const BASE = `http://localhost:${PORT}`;
const MONGO_URI = process.env.TEST_MONGO_URI || "mongodb://127.0.0.1:27017/campuseats_test";
const ADMIN = { email: "admin@test.local", password: "AdminPass123" };
const STUDENT = { name: "Test Student", email: "student@test.local", password: "Student123" };

const env = {
  ...process.env,
  NODE_ENV: "test",
  PORT: String(PORT),
  MONGO_URI,
  JWT_SECRET: "test-secret-not-used-anywhere-else",
  CLIENT_URL: "http://localhost:5173",
  ADMIN_NAME: "Test Admin",
  ADMIN_EMAIL: ADMIN.email,
  ADMIN_PASSWORD: ADMIN.password
};
const backendDir = path.join(__dirname, "..");

const call = async (method, url, { body, token } = {}) => {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: res.status, body: await res.json().catch(() => null) };
};

const connectSocket = (token) =>
  new Promise((resolve, reject) => {
    const socket = io(BASE, { auth: { token }, transports: ["websocket"], reconnection: false });
    socket.on("connect", () => resolve(socket));
    socket.on("connect_error", (error) => {
      socket.close();
      reject(error);
    });
  });

let server;
let studentToken;
let adminToken;

before(async () => {
  // Fresh database for every run
  await mongoose.connect(MONGO_URI);
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  execFileSync("node", ["seed-admin.js"], { cwd: backendDir, env, stdio: "ignore" });

  server = spawn("node", ["server.js"], { cwd: backendDir, env });
  await new Promise((resolve, reject) => {
    let output = "";
    server.stdout.on("data", (d) => {
      output += d;
      if (output.includes("Server running")) resolve();
    });
    server.on("exit", (code) => reject(new Error(`server exited (${code}): ${output}`)));
  });
});

after(() => {
  server?.kill();
});

describe("health", () => {
  it("GET / reports the API and database as up", async () => {
    const res = await call("GET", "/");
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "online");
    assert.equal(res.body.database, "connected");
  });
});

describe("authentication", () => {
  it("registers a student and never returns the password", async () => {
    const res = await call("POST", "/api/auth/register", { body: STUDENT });
    assert.equal(res.status, 201);
    assert.ok(res.body.token);
    assert.equal(res.body.user.role, "student");
    assert.equal(res.body.user.password, undefined);
  });

  it("ignores a role sent in the request body", async () => {
    const res = await call("POST", "/api/auth/register", {
      body: { name: "Sneaky", email: "sneaky@test.local", password: "Sneaky1234", role: "admin" }
    });
    assert.equal(res.status, 201);
    assert.equal(res.body.user.role, "student");
  });

  it("rejects a duplicate email with 409 and invalid input with 400", async () => {
    assert.equal((await call("POST", "/api/auth/register", { body: STUDENT })).status, 409);
    const invalid = await call("POST", "/api/auth/register", { body: { name: "", email: "bad", password: "1" } });
    assert.equal(invalid.status, 400);
    assert.ok(invalid.body.errors.length >= 3);
  });

  it("logs in with the right password and rejects the wrong one", async () => {
    const ok = await call("POST", "/api/auth/login", { body: { email: STUDENT.email, password: STUDENT.password } });
    assert.equal(ok.status, 200);
    studentToken = ok.body.token;
    const wrong = await call("POST", "/api/auth/login", { body: { email: STUDENT.email, password: "WrongPass1" } });
    assert.equal(wrong.status, 401);
  });

  it("blocks NoSQL operator injection in the login email", async () => {
    const res = await call("POST", "/api/auth/login", { body: { email: { $ne: null }, password: STUDENT.password } });
    assert.equal(res.status, 400);
  });

  it("protects /api/auth/profile with a JWT", async () => {
    assert.equal((await call("GET", "/api/auth/profile")).status, 401);
    assert.equal((await call("GET", "/api/auth/profile", { token: "not.a.token" })).status, 401);
    const res = await call("GET", "/api/auth/profile", { token: studentToken });
    assert.equal(res.status, 200);
    assert.equal(res.body.user.email, STUDENT.email);
  });
});

describe("role-based access", () => {
  it("lets students reach the dashboard but not the admin panel", async () => {
    assert.equal((await call("GET", "/api/dashboard", { token: studentToken })).status, 200);
    assert.equal((await call("GET", "/api/admin", { token: studentToken })).status, 403);
  });

  it("lets the admin open the admin panel", async () => {
    const login = await call("POST", "/api/auth/login", { body: ADMIN });
    assert.equal(login.status, 200);
    adminToken = login.body.token;
    const res = await call("GET", "/api/admin", { token: adminToken });
    assert.equal(res.status, 200);
    assert.equal(res.body.stats.admins, 1);
  });
});

describe("food CRUD", () => {
  const dosa = { name: "Masala Dosa", price: 80, category: "South Indian", stock: 20 };
  let foodId;

  it("only admins can create menu items", async () => {
    assert.equal((await call("POST", "/api/foods", { body: dosa })).status, 401);
    assert.equal((await call("POST", "/api/foods", { body: dosa, token: studentToken })).status, 403);
    assert.equal((await call("POST", "/api/foods", { body: { ...dosa, price: -1 }, token: adminToken })).status, 400);
    const res = await call("POST", "/api/foods", { body: dosa, token: adminToken });
    assert.equal(res.status, 201);
    foodId = res.body._id;
  });

  it("reads, updates and deletes a menu item", async () => {
    assert.equal((await call("GET", "/api/foods")).body.length, 1);
    assert.equal((await call("GET", "/api/foods/not-an-id")).status, 400);
    const updated = await call("PUT", `/api/foods/${foodId}`, { body: { price: 85 }, token: adminToken });
    assert.equal(updated.body.price, 85);
    assert.equal((await call("DELETE", `/api/foods/${foodId}`, { token: adminToken })).status, 200);
    assert.equal((await call("GET", `/api/foods/${foodId}`)).status, 404);
  });
});

describe("real-time (Socket.IO)", () => {
  it("rejects a socket with a forged token", async () => {
    await assert.rejects(connectSocket("forged.jwt.token"), /Invalid or malformed token/);
  });

  it("delivers a chat message from one client to another", async () => {
    const sender = await connectSocket(studentToken);
    const receiver = await connectSocket(adminToken);
    try {
      const received = new Promise((resolve) => receiver.on("chat:message", resolve));
      const ack = await sender.timeout(3000).emitWithAck("chat:send", { text: "Is the dosa ready?" });
      assert.equal(ack.ok, true);
      const message = await received;
      assert.equal(message.text, "Is the dosa ready?");
      assert.equal(message.name, STUDENT.name);
    } finally {
      sender.close();
      receiver.close();
    }
  });

  it("rejects an empty chat message", async () => {
    const socket = await connectSocket(studentToken);
    try {
      const ack = await socket.timeout(3000).emitWithAck("chat:send", { text: "   " });
      assert.equal(ack.ok, false);
    } finally {
      socket.close();
    }
  });

  it("pushes an admin announcement to connected clients", async () => {
    const socket = await connectSocket(studentToken);
    try {
      const pushed = new Promise((resolve) => socket.on("announcement:new", resolve));
      const res = await call("POST", "/api/announcements", { body: { title: "Test", body: "Hello everyone" }, token: adminToken });
      assert.equal(res.status, 201);
      assert.equal((await pushed).title, "Test");
    } finally {
      socket.close();
    }
  });
});

describe("rate limiting", () => {
  it("returns 429 after repeated failed logins", async () => {
    let last;
    for (let i = 0; i < 12; i++) {
      last = await call("POST", "/api/auth/login", { body: { email: STUDENT.email, password: "WrongPass1" } });
    }
    assert.equal(last.status, 429);
  });
});
