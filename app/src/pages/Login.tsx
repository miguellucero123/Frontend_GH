import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

    useEffect(() => {
        checkBackend();
    }, []);

    const checkBackend = async () => {
        try {
            console.log("CHECK: Verificando API en puerto 8002...");
            
            // Crear AbortController para timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            // Intentar primero /api/health, luego /health como fallback
            let res;
            try {
                res = await fetch('http://localhost:8002/api/health', {
                    method: 'GET',
                    signal: controller.signal
                });
            } catch (e) {
                // Si falla, intentar sin /api
                res = await fetch('http://localhost:8002/health', {
                    method: 'GET',
                    signal: controller.signal
                });
            } finally {
                clearTimeout(timeoutId);
            }
            
            if (res.ok) {
                console.log("SUCCESS: API Online");
                setBackendStatus('online');
            } else {
                console.warn("WARNING: API respondio con error:", res.status);
                setBackendStatus('offline');
            }
        } catch (e: any) {
            if (e.name === 'AbortError') {
                console.error("ERROR: Timeout al verificar API");
            } else {
                console.error("ERROR: API inalcanzable:", e);
            }
            setBackendStatus('offline');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("EVENT: Boton de login presionado");
        console.log("DATA: Datos del formulario:", { email });
        setLoading(true);

        try {
            console.log("ACTION: Iniciando proceso de login...");
            const response = await authService.login(email, password);
            console.log("SUCCESS: Login exitoso. Respuesta recibida:", response);
            
            // Verificar que el usuario se guardó correctamente
            const savedUser = authService.getCurrentUser();
            if (!savedUser) {
                console.error("ERROR: El usuario no se guardó correctamente después del login");
                alert("Error al guardar la sesión. Por favor, intenta nuevamente.");
                return;
            }
            
            console.log("SUCCESS: Usuario guardado correctamente:", savedUser);
            console.log("REDIRECT: Redirigiendo a /dashboard...");
            
            // Pequeño delay para asegurar que el estado se actualice
            setTimeout(() => {
                navigate('/dashboard');
            }, 100);
        } catch (error: any) {
            console.error("ERROR: Error de login:", error);
            const detail = error.response?.data?.detail;
            console.error("DETAIL: Detalle del error:", detail);
            
            // Extraer mensaje de error de forma segura
            let errorMsg = 'Verifica tus credenciales';
            
            if (typeof detail === 'string') {
                errorMsg = detail;
            } else if (Array.isArray(detail)) {
                // FastAPI devuelve arrays de errores de validación
                // Formato: [{ "loc": ["body", "email"], "msg": "field required", "type": "value_error.missing" }]
                const messages = detail.map((err: any) => {
                    if (typeof err === 'string') return err;
                    if (err.msg) return err.msg;
                    if (err.message) return err.message;
                    return JSON.stringify(err);
                }).filter((msg: string) => msg);
                
                if (messages.length > 0) {
                    errorMsg = messages.join('. ');
                } else {
                    errorMsg = 'Datos inválidos. Verifica el formato de los campos.';
                }
            } else if (detail && typeof detail === 'object') {
                if (detail.message) errorMsg = detail.message;
                else if (detail.detail) errorMsg = detail.detail;
                else if (detail.error) errorMsg = detail.error;
                else {
                    // Intentar extraer mensaje de objeto complejo
                    const errorStr = JSON.stringify(detail);
                    if (errorStr.length < 200) {
                        errorMsg = errorStr;
                    } else {
                        errorMsg = 'Error al iniciar sesión. Revisa la consola para más detalles.';
                    }
                }
            }
            
            alert(`Error de inicio de sesión: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 transition-all duration-500 hover:shadow-blue-500/20">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${backendStatus === 'online' ? 'bg-emerald-500/20 text-emerald-400' :
                            backendStatus === 'offline' ? 'bg-red-500/20 text-red-400' :
                                'bg-slate-500/20 text-slate-400'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-500' :
                                backendStatus === 'offline' ? 'bg-red-500' :
                                    'bg-slate-500 animate-pulse'
                                }`}></div>
                            API: {backendStatus.toUpperCase()}
                        </div>
                    </div>
                    <img
                        src="/logo.jpg"
                        alt="Logo Constructora"
                        className="w-20 h-20 rounded-2xl mx-auto mb-4 shadow-lg object-cover border-4 border-white/20"
                    />
                    <h1 className="text-3xl font-bold text-white tracking-tight">Bienvenido</h1>
                    <p className="text-slate-300 mt-2">Sistema ERP - G y H Construcciones SPA</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Usuario</label>
                        <div className="relative group">
                            <User className="w-5 h-5 text-slate-400 absolute left-3 top-3 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="admin@constructora.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Contraseña</label>
                        <div className="relative group">
                            <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="password"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="animate-pulse">Iniciando...</span>
                        ) : (
                            <>
                                Ingresar <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 space-y-3">
                    <div className="text-center">
                        <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                    
                    {/* Credenciales de Prueba */}
                    {backendStatus === 'offline' && (
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-xs text-slate-300">
                            <p className="font-semibold mb-2 text-slate-200">💡 Credenciales de Prueba:</p>
                            <div className="space-y-1.5">
                                <div>
                                    <span className="text-blue-400">Admin:</span> admin@constructora.com / admin123
                                </div>
                                <div>
                                    <span className="text-emerald-400">Trabajador:</span> trabajador@constructora.com / trabajador123
                                </div>
                                <div>
                                    <span className="text-purple-400">Cliente:</span> cliente@constructora.com / cliente123
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
