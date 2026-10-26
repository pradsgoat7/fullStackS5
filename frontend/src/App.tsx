import React from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthProvider';
import { SocketProvider } from './context/SocketProvider';
import { CartProvider } from './context/CartProvider';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
