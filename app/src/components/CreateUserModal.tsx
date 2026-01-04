import { useState } from 'react';
import { X, User, Mail, Phone, Shield, Lock, MapPin, Briefcase, Calendar, FileText, Building, UserCheck, Bell, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: () => void;
}

interface CreateUserData {
    // Información básica
    nombre: string;
    email: string;
    password: string;
    telefono: string;
    telefono_alternativo: string;
    email_alternativo: string;
    rol: 'jefe' | 'trabajador' | 'cliente';
    
    // Información personal extendida
    rut: string;
    fecha_nacimiento: string;
    direccion: string;
    ciudad: string;
    region: string;
    
    // Información profesional
    cargo: string;
    especialidad: string;
    anos_experiencia: string;
    supervisor: string;
    
    // Información de asignación
    proyectos_iniciales: string;
    notas: string;
    
    // Configuración
    recibir_notificaciones_email: boolean;
    recibir_notificaciones_sms: boolean;
}

const initialFormData: CreateUserData = {
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    telefono_alternativo: '',
    email_alternativo: '',
    rol: 'trabajador',
    rut: '',
    fecha_nacimiento: '',
    direccion: '',
    ciudad: '',
    region: '',
    cargo: '',
    especialidad: '',
    anos_experiencia: '',
    supervisor: '',
    proyectos_iniciales: '',
    notas: '',
    recibir_notificaciones_email: true,
    recibir_notificaciones_sms: false
};

export function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateUserData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<keyof CreateUserData, string>>>({});
    const [activeSection, setActiveSection] = useState<'personal' | 'profesional' | 'asignacion' | 'config'>('personal');

    if (!isOpen) return null;

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof CreateUserData, string>> = {};

        // Validación de campos requeridos
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.trim().length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (!/^\+?[0-9\s-()]+$/.test(formData.telefono)) {
            newErrors.telefono = 'El formato del teléfono no es válido';
        }

        // Validación de email alternativo si se proporciona
        if (formData.email_alternativo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_alternativo)) {
            newErrors.email_alternativo = 'El email alternativo no es válido';
        }

        // Validación de teléfono alternativo si se proporciona
        if (formData.telefono_alternativo && !/^\+?[0-9\s-()]+$/.test(formData.telefono_alternativo)) {
            newErrors.telefono_alternativo = 'El formato del teléfono alternativo no es válido';
        }

        // Validación de RUT si se proporciona
        if (formData.rut && !/^[0-9]{7,8}-[0-9kK]{1}$/.test(formData.rut)) {
            newErrors.rut = 'El formato del RUT no es válido (ej: 12345678-9)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setActiveSection('personal'); // Ir a la sección con errores
            return;
        }

        setLoading(true);
        try {
            // Enviar solo los campos que el backend acepta
            await authService.register({
                nombre: formData.nombre.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                telefono: formData.telefono.trim(),
                rol: formData.rol,
                // Campos adicionales que pueden ser útiles en el futuro
                metadata: {
                    telefono_alternativo: formData.telefono_alternativo.trim() || undefined,
                    email_alternativo: formData.email_alternativo.trim() || undefined,
                    rut: formData.rut.trim() || undefined,
                    fecha_nacimiento: formData.fecha_nacimiento || undefined,
                    direccion: formData.direccion.trim() || undefined,
                    ciudad: formData.ciudad.trim() || undefined,
                    region: formData.region.trim() || undefined,
                    cargo: formData.cargo.trim() || undefined,
                    especialidad: formData.especialidad.trim() || undefined,
                    anos_experiencia: formData.anos_experiencia || undefined,
                    supervisor: formData.supervisor.trim() || undefined,
                    proyectos_iniciales: formData.proyectos_iniciales.trim() || undefined,
                    notas: formData.notas.trim() || undefined,
                    recibir_notificaciones_email: formData.recibir_notificaciones_email,
                    recibir_notificaciones_sms: formData.recibir_notificaciones_sms
                }
            });
            
            onUserCreated();
            onClose();
            setFormData(initialFormData);
            setErrors({});
            setActiveSection('personal');
        } catch (error: any) {
            console.error('Error al crear usuario:', error);
            
            let errorMsg = 'Error al crear el usuario. Verifica los datos e intenta nuevamente.';
            
            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                if (Array.isArray(detail)) {
                    const messages = detail.map((err: any) => err.msg || JSON.stringify(err)).join('. ');
                    errorMsg = messages;
                } else if (typeof detail === 'string') {
                    errorMsg = detail;
                }
            } else if (error.message) {
                errorMsg = error.message;
            }
            
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof CreateUserData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const sections = [
        { id: 'personal', label: 'Información Personal', icon: User },
        { id: 'profesional', label: 'Información Profesional', icon: Briefcase },
        { id: 'asignacion', label: 'Asignación y Notas', icon: Building },
        { id: 'config', label: 'Configuración', icon: Bell }
    ] as const;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Nuevo Usuario</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Complete todos los campos requeridos (*)</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navegación de secciones */}
                <div className="border-b border-slate-100 bg-white px-6 py-3 flex gap-2 overflow-x-auto">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {section.label}
                            </button>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* SECCIÓN 1: Información Personal */}
                        {activeSection === 'personal' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="w-5 h-5 text-blue-600" />
                                    <h4 className="text-base font-semibold text-slate-900">Información Personal</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Nombre Completo <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Ej: Juan Pérez González"
                                                className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                                                    errors.nombre 
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                                } outline-none transition-all`}
                                                value={formData.nombre}
                                                onChange={(e) => handleChange('nombre', e.target.value)}
                                            />
                                        </div>
                                        {errors.nombre && (
                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.nombre}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            RUT
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="12345678-9"
                                                className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                                                    errors.rut 
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                                } outline-none transition-all`}
                                                value={formData.rut}
                                                onChange={(e) => handleChange('rut', e.target.value)}
                                            />
                                        </div>
                                        {errors.rut && (
                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.rut}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            Fecha de Nacimiento
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="date"
                                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                value={formData.fecha_nacimiento}
                                                onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            Email Corporativo <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                required
                                                type="email"
                                                placeholder="usuario@constructora.com"
                                                className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                                                    errors.email 
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                                } outline-none transition-all`}
                                                value={formData.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            Email Alternativo
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="email"
                                                placeholder="email.personal@ejemplo.com"
                                                className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                                                    errors.email_alternativo 
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                                } outline-none transition-all`}
                                                value={formData.email_alternativo}
                                                onChange={(e) => handleChange('email_alternativo', e.target.value)}
                                            />
                                        </div>
                                        {errors.email_alternativo && (
                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.email_alternativo}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            Teléfono <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                required
                                                type="tel"
                                                placeholder="+56 9 1234 5678"
                                                className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                                                    errors.telefono 
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                                } outline-none transition-all`}
                                                value={formData.telefono}
                                                onChange={(e) => handleChange('telefono', e.target.value)}
                                            />
                                        </div>
                                        {errors.telefono && (
                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.telefono}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            Teléfono Alternativo
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="tel"
                                                placeholder="+56 9 8765 4321"
                                                className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                                                    errors.telefono_alternativo 
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                                } outline-none transition-all`}
                                                value={formData.telefono_alternativo}
                                                onChange={(e) => handleChange('telefono_alternativo', e.target.value)}
                                            />
                                        </div>
                                        {errors.telefono_alternativo && (
                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.telefono_alternativo}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Dirección
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Calle, número, departamento"
                                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                value={formData.direccion}
                                                onChange={(e) => handleChange('direccion', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            Ciudad
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Santiago"
                                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                value={formData.ciudad}
                                                onChange={(e) => handleChange('ciudad', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            Región
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Región Metropolitana"
                                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                value={formData.region}
                                                onChange={(e) => handleChange('region', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECCIÓN 2: Información Profesional */}
                        {activeSection === 'profesional' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex items-center gap-2 mb-4">
                                    <Briefcase className="w-5 h-5 text-blue-600" />
                                    <h4 className="text-base font-semibold text-slate-900">Información Profesional</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            Rol <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 z-10" />
                                            <select
                                                required
                                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white"
                                                value={formData.rol}
                                                onChange={(e) => handleChange('rol', e.target.value as CreateUserData['rol'])}
                                            >
                                                <option value="trabajador">Trabajador</option>
                                                <option value="jefe">Jefe de Obra</option>
                                                <option value="cliente">Cliente</option>
                                            </select>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Define los permisos y acceso del usuario
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            Cargo
                                        </label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Ej: Ingeniero Civil, Capataz, Supervisor"
                                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                value={formData.cargo}
                                                onChange={(e) => handleChange('cargo', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            Especialidad
                                        </label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Ej: Estructuras, Obras Civiles, Electricidad"
                                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                value={formData.especialidad}
                                                onChange={(e) => handleChange('especialidad', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            Años de Experiencia
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="number"
                                                min="0"
                                                max="50"
                                                placeholder="5"
                                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                value={formData.anos_experiencia}
                                                onChange={(e) => handleChange('anos_experiencia', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Supervisor/Jefe Directo
                                        </label>
                                        <div className="relative">
                                            <UserCheck className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Nombre del supervisor o jefe directo"
                                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                value={formData.supervisor}
                                                onChange={(e) => handleChange('supervisor', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Contraseña <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                required
                                                type="password"
                                                placeholder="Mínimo 6 caracteres"
                                                className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                                                    errors.password 
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                                } outline-none transition-all`}
                                                value={formData.password}
                                                onChange={(e) => handleChange('password', e.target.value)}
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.password}
                                            </p>
                                        )}
                                        <p className="text-xs text-slate-500 mt-1">
                                            El usuario recibirá un email con instrucciones para cambiar su contraseña
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECCIÓN 3: Asignación y Notas */}
                        {activeSection === 'asignacion' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex items-center gap-2 mb-4">
                                    <Building className="w-5 h-5 text-blue-600" />
                                    <h4 className="text-base font-semibold text-slate-900">Asignación y Notas</h4>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            Proyectos Iniciales
                                        </label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Ej: Proyecto A, Proyecto B (separados por comas)"
                                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                value={formData.proyectos_iniciales}
                                                onChange={(e) => handleChange('proyectos_iniciales', e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Proyectos a los que se asignará el usuario inicialmente
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">
                                            Notas y Observaciones
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                            <textarea
                                                placeholder="Información adicional, observaciones, comentarios relevantes..."
                                                rows={4}
                                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                                                value={formData.notas}
                                                onChange={(e) => handleChange('notas', e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Información adicional que pueda ser útil para el equipo
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECCIÓN 4: Configuración */}
                        {activeSection === 'config' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex items-center gap-2 mb-4">
                                    <Bell className="w-5 h-5 text-blue-600" />
                                    <h4 className="text-base font-semibold text-slate-900">Configuración de Notificaciones</h4>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                id="notif_email"
                                                className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                                checked={formData.recibir_notificaciones_email}
                                                onChange={(e) => handleChange('recibir_notificaciones_email', e.target.checked)}
                                            />
                                            <div className="flex-1">
                                                <label htmlFor="notif_email" className="text-sm font-medium text-slate-700 cursor-pointer">
                                                    Recibir notificaciones por Email
                                                </label>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    El usuario recibirá notificaciones importantes por correo electrónico
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                id="notif_sms"
                                                className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                                checked={formData.recibir_notificaciones_sms}
                                                onChange={(e) => handleChange('recibir_notificaciones_sms', e.target.checked)}
                                            />
                                            <div className="flex-1">
                                                <label htmlFor="notif_sms" className="text-sm font-medium text-slate-700 cursor-pointer">
                                                    Recibir notificaciones por SMS
                                                </label>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    El usuario recibirá alertas importantes por mensaje de texto
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="p-6 pt-0 flex gap-3 border-t border-slate-100 bg-white sticky bottom-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                        >
                            {loading ? 'Creando Usuario...' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
