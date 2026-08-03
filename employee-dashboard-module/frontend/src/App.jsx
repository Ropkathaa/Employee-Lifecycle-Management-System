import React from 'react';
import AppRoutes from './routes';
import { EmployeeProvider } from './context/EmployeeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <EmployeeProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </EmployeeProvider>
    </ThemeProvider>
  );
};

export default App;

