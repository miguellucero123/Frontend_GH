import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProjectList } from './pages/ProjectList';
import { Projects } from './pages/Projects';
import { Users } from './pages/Users';
import { Messages } from './pages/Messages';
import { Settings } from './pages/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                {/* Protected Routes - Todos los usuarios autenticados */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout><Dashboard /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/projects" element={
                    <ProtectedRoute>
                        <Layout><ProjectList /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/projects/:id" element={
                    <ProtectedRoute>
                        <Layout><Projects /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/messages" element={
                    <ProtectedRoute>
                        <Layout><Messages /></Layout>
                    </ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <ProtectedRoute allowedRoles={['jefe', 'trabajador']}>
                        <Layout><Settings /></Layout>
                    </ProtectedRoute>
                } />

                {/* Protected Routes - Solo Jefes */}
                <Route path="/users" element={
                    <ProtectedRoute allowedRoles={['jefe']}>
                        <Layout><Users /></Layout>
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
