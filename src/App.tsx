import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { QueryProvider } from '@/context/QueryProvider';
import DashboardLayout from '@/components/DashboardLayout';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Booking from '@/pages/Booking';
import Barbers from '@/pages/Barbers';
import BookingDetails from '@/pages/BookingDetails';
import ErrorBoundary from '@/utils/ErrorBoundary';
import Overview from '@/pages/dashboard/Overview';
import BookingList from '@/pages/dashboard/BookingList';
import BarberList from '@/pages/dashboard/BarberList';
import ServiceList from '@/pages/dashboard/ServiceList';
import PaymentList from '@/pages/dashboard/PaymentList';
import InventoryList from '@/pages/dashboard/InventoryList';
import ResourceList from '@/pages/dashboard/ResourceList';
import ReportDashboard from '@/pages/dashboard/ReportDashboard';
import PayrollList from '@/pages/dashboard/PayrollList';
import CustomerList from '@/pages/dashboard/CustomerList';
import PromoList from '@/pages/dashboard/PromoList';
import NotificationList from '@/pages/dashboard/NotificationList';
import SettingsPage from '@/pages/dashboard/SettingsPage';
import ReviewList from '@/pages/dashboard/ReviewList';
import BarberEarnings from '@/pages/dashboard/BarberEarnings';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

function AppContent() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-white dark:bg-neutral-950">
            <Navbar />
            <Home />
          </div>
        }
      />
      <Route
        path="/login"
        element={
          <div className="min-h-screen bg-white dark:bg-neutral-950">
            <Navbar />
            <PublicRoute>
              <Login />
            </PublicRoute>
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="min-h-screen bg-white dark:bg-neutral-950">
            <Navbar />
            <PublicRoute>
              <Register />
            </PublicRoute>
          </div>
        }
      />
      <Route path="/barbers" element={<div className="min-h-screen bg-white dark:bg-neutral-950"><Navbar /><Barbers /></div>} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/booking/:id" element={<BookingDetails />} />
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/bookings" element={<BookingList />} />
                <Route path="/barbers" element={<BarberList />} />
                <Route path="/services" element={<ServiceList />} />
                <Route path="/payments" element={<PaymentList />} />
                <Route path="/inventory" element={<InventoryList />} />
                <Route path="/resources" element={<ResourceList />} />
                <Route path="/reports" element={<ReportDashboard />} />
                <Route path="/payrolls" element={<PayrollList />} />
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/promos" element={<PromoList />} />
                <Route path="/notifications" element={<NotificationList />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/reviews" element={<ReviewList />} />
                <Route path="/earnings" element={<BarberEarnings />} />
              </Routes>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          <Router>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </Router>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
