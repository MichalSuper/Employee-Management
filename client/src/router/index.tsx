import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CompleteProfilePage from '../pages/CompleteProfilePage';
import DashboardPage from '../pages/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },

  {
    path: '/register',
    element: <RegisterPage />,
  },

  {
    path: '/complete-profile',
    element: <CompleteProfilePage />,
  },

  {
    path: '/dashboard',
    element: <DashboardPage />,
  }
]);
