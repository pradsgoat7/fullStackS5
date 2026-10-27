import React from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './context/AuthProvider';
import { SocketProvider } from './context/SocketProvider';
import { CartProvider } from './context/CartProvider';
import { OrdersProvider } from './context/OrdersProvider';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <OrdersProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </OrdersProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
