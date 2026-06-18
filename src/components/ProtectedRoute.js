import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  return sessionStorage.getItem('metsu_token')
    ? children
    : <Navigate to="/login" replace />;
}
