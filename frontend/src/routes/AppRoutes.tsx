import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { MenuPage } from '../pages/MenuPage';
import { MyOrdersPage } from '../pages/MyOrdersPage';
import { OrderHistoryPage } from '../pages/OrderHistoryPage';
import { ProfilePage } from '../pages/ProfilePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AdminPage } from '../pages/AdminPage';
import { ChatPage } from '../pages/ChatPage';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Only for logged-out visitors */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Everything else needs a logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/chat" element={<ChatPage />} />
            {/* Students only: staff manage orders from the Admin Panel */}
            <Route element={<ProtectedRoute roles={['student']} />}>
              <Route path="/my-orders" element={<MyOrdersPage />} />
              <Route path="/order-history" element={<OrderHistoryPage />} />
            </Route>
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin only */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
