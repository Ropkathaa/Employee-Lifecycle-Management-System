import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { EmployeeProvider } from './context/EmployeeContext';
import { DocumentProvider } from './context/DocumentContext';
import { OfferProvider } from './context/OfferContext';
import { SalaryProvider } from './context/SalaryContext';
import { TrainingProvider } from './context/TrainingContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import Toast from './components/Toast';

export default function App() {
  return (
    <BrowserRouter>
      <EmployeeProvider>
        <DocumentProvider>
          <OfferProvider>
            <SalaryProvider>
              <TrainingProvider>
                <AnalyticsProvider>
                  <AppRoutes />
                  <Toast />
                </AnalyticsProvider>
              </TrainingProvider>
            </SalaryProvider>
          </OfferProvider>
        </DocumentProvider>
      </EmployeeProvider>
    </BrowserRouter>
  );
}
