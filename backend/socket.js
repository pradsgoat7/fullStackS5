// Real-time layer (Socket.IO): authenticated Live Chat with presence and typing indicators.
// Announcements are pushed from routes/announcementRoutes.js through the same `io` instance.
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Message = require("./models/Message");

const CHAT_ROOM = "canteen-chat";
const HISTORY_LIMIT = 50;
const MAX_MESSAGE_LENGTH = 500;
const RATE_LIMIT = { messages: 5, windowMs: 10 * 1000 };

const log = (...args) => console.log("[Socket.IO]", ...args);

// Same rules as the REST API: a socket needs a valid, unexpired JWT for an existing user
const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    log(`Connection rejected (${socket.id}): no token`);
    return next(new Error("Access denied. No token provided"));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch (error) {
    const message = error.name === "TokenExpiredError"
      ? "Token has expired, please log in again"
      : "Invalid or malformed token";
    log(`Connection rejected (${socket.id}): ${message}`);
    return next(new Error(message));
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error("User for this token no longer exists"));
    }
    socket.data.user = { id: user.id, name: user.name, role: user.role };
    next();
  } catch (error) {
    console.error(error);
    next(new Error("Something went wrong"));
  }
};

// Everyone in the chat room, one entry per user even if they have several tabs open
const onlineUsers = async (io) => {
  const sockets = await io.in(CHAT_ROOM).fetchSockets();
  return [...new Map(sockets.map((s) => [s.data.user.id, s.data.user])).values()];
};

const broadcastPresence = async (io) => {
  io.to(CHAT_ROOM).emit("presence", await onlineUsers(io));
};

module.exports = (io) => {
  io.use(authenticateSocket);

  io.on("connection", async (socket) => {
    const { user } = socket.data;
    log(`Client connected: ${socket.id} (${user.name}, ${user.role})`);
    socket.join(CHAT_ROOM);
    // Personal room for this user's order updates; canteen staff also get every new order
    socket.join(`user:${user.id}`);
    if (user.role === "admin" || user.role === "staff") {
      socket.join("staff");
    }

    broadcastPresence(io).catch((error) => console.error(error));

    // The chat page asks for recent history and who's online when it opens
    socket.on("chat:sync", async (ack) => {
      if (typeof ack !== "function") return;
      try {
        const history = await Message.find().sort({ createdAt: -1 }).limit(HISTORY_LIMIT);
        ack({ ok: true, history: history.reverse(), online: await onlineUsers(io) });
      } catch (error) {
        console.error(error);
        ack({ ok: false, error: "Could not load chat history" });
      }
    });

    // Timestamps of this socket's recent messages, for a simple flood limit
    const recentSends = [];

    socket.on("chat:send", async (payload, ack) => {
      const reply = typeof ack === "function" ? ack : () => {};
      const text = typeof payload?.text === "string" ? payload.text.trim() : "";

      if (!text || text.length > MAX_MESSAGE_LENGTH) {
        log(`Validation failed: empty or too long message from "${user.name}" (${socket.id})`);
        return reply({ ok: false, error: `Messages must be 1 to ${MAX_MESSAGE_LENGTH} characters` });
      }

      const now = Date.now();
      while (recentSends.length && now - recentSends[0] > RATE_LIMIT.windowMs) recentSends.shift();
      if (recentSends.length >= RATE_LIMIT.messages) {
        log(`Rate limit hit by "${user.name}" (${socket.id})`);
        return reply({ ok: false, error: "You're sending messages too fast. Please wait a few seconds." });
      }
      recentSends.push(now);

      try {
        const message = await Message.create({ user: user.id, name: user.name, role: user.role, text });
        io.to(CHAT_ROOM).emit("chat:message", message);
        log(`Broadcast message from "${user.name}" (${socket.id}): "${text}"`);
        reply({ ok: true });
      } catch (error) {
        console.error(error);
        reply({ ok: false, error: "Message could not be sent" });
      }
    });

    socket.on("chat:typing", (isTyping) => {
      socket.to(CHAT_ROOM).emit("chat:typing", { id: user.id, name: user.name, isTyping: Boolean(isTyping) });
    });

    socket.on("disconnect", (reason) => {
      log(`Client disconnected: ${socket.id} (${user.name}, reason: ${reason})`);
      broadcastPresence(io).catch((error) => console.error(error));
    });
  });
};
