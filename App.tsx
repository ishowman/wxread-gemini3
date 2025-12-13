import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/Toast'; // Import ToastProvider
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ListDetail } from './pages/ListDetail';
import { SharedList } from './pages/SharedList';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/list/:id" element={<ListDetail />} />
              <Route path="/shared/:id" element={<SharedList />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </HashRouter>
      </AppProvider>
    </ToastProvider>
  );
};

export default App;