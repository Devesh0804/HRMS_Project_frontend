import Login from '../components/Login';
import Register from '../components/Register';
import { AUTH_ROUTE_PATHS } from './routePaths';

export const authRoutes = [
  {
    path: AUTH_ROUTE_PATHS.login,
    element: <Login />,
  },
  {
    path: AUTH_ROUTE_PATHS.register,
    element: <Register />,
  },
];
