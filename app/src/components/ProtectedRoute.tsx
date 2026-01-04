import { Navigate } from 'react-router-dom';
import { authService, User } from '../services/authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('jefe' | 'trabajador' | 'cliente')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const currentUser = authService.getCurrentUser();

    // Si no hay usuario, redirigir al login
    if (!currentUser) {
        console.log('⚠️ ProtectedRoute: No hay usuario, redirigiendo al login');
        return <Navigate to="/" replace />;
    }

    console.log('✅ ProtectedRoute: Usuario encontrado:', currentUser);

    // Si hay roles permitidos y el usuario no tiene uno de esos roles, redirigir
    if (allowedRoles && !allowedRoles.includes(currentUser.rol)) {
        console.log(`⚠️ ProtectedRoute: Usuario con rol '${currentUser.rol}' no tiene acceso. Roles permitidos:`, allowedRoles);
        return <Navigate to="/dashboard" replace />;
    }

    console.log('✅ ProtectedRoute: Acceso permitido');
    return <>{children}</>;
}

