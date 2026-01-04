import { 
    Save, Bell, Lock, Globe, Database, Mail, Palette, Shield, 
    User as UserIcon, Key, Smartphone, Monitor, Moon, Sun, Settings as SettingsIcon,
    Zap, Link2, FileText, BarChart3, Users, CreditCard, Calendar,
    AlertCircle, CheckCircle, XCircle, RefreshCw, Download, Upload,
    Eye, EyeOff, Trash2, LogOut, Clock, MapPin, Phone, Building2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { authService, User } from '../services/authService';

interface SettingsData {
    general: {
        companyName: string;
        rut: string;
        address: string;
        phone: string;
        email: string;
        timezone: string;
        language: string;
        currency: string;
    };
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
        projectUpdates: boolean;
        taskAssignments: boolean;
        budgetAlerts: boolean;
        messageNotifications: boolean;
        deadlineReminders: boolean;
        weeklyReports: boolean;
    };
    security: {
        twoFactorEnabled: boolean;
        sessionTimeout: number;
        passwordExpiry: number;
        loginAlerts: boolean;
    };
    appearance: {
        theme: 'light' | 'dark' | 'auto';
        primaryColor: string;
        fontSize: 'small' | 'medium' | 'large';
        compactMode: boolean;
        sidebarCollapsed: boolean;
    };
    integrations: {
        emailEnabled: boolean;
        smsEnabled: boolean;
        calendarSync: boolean;
        cloudStorage: boolean;
    };
}

export function Settings() {
    const [activeTab, setActiveTab] = useState('general');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

    const [settings, setSettings] = useState<SettingsData>({
        general: {
            companyName: 'Constructora GYH',
            rut: '76.XXX.XXX-X',
            address: 'Av. Principal 1234, Santiago',
            phone: '+56 2 2XXX XXXX',
            email: 'contacto@constructoragyh.cl',
            timezone: 'America/Santiago',
            language: 'es',
            currency: 'CLP'
        },
        notifications: {
            email: true,
            push: true,
            sms: false,
            projectUpdates: true,
            taskAssignments: true,
            budgetAlerts: true,
            messageNotifications: true,
            deadlineReminders: true,
            weeklyReports: false
        },
        security: {
            twoFactorEnabled: false,
            sessionTimeout: 30,
            passwordExpiry: 90,
            loginAlerts: true
        },
        appearance: {
            theme: 'light',
            primaryColor: '#3b82f6',
            fontSize: 'medium',
            compactMode: false,
            sidebarCollapsed: false
        },
        integrations: {
            emailEnabled: true,
            smsEnabled: false,
            calendarSync: false,
            cloudStorage: false
        }
    });

    useEffect(() => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        
        // Cargar configuración guardada
        const savedSettings = localStorage.getItem('app_settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(prev => ({ ...prev, ...parsed }));
            } catch (error) {
                console.error('Error cargando configuración:', error);
            }
        }
    }, []);

    const tabs = [
        { id: 'general', label: 'General', icon: Globe, desc: 'Información básica' },
        { id: 'notifications', label: 'Notificaciones', icon: Bell, desc: 'Alertas y avisos' },
        { id: 'security', label: 'Seguridad', icon: Lock, desc: 'Protección de cuenta' },
        { id: 'appearance', label: 'Apariencia', icon: Palette, desc: 'Personalización UI' },
        { id: 'integrations', label: 'Integraciones', icon: Link2, desc: 'Servicios externos' },
        { id: 'data', label: 'Datos', icon: Database, desc: 'Respaldo y exportación' }
    ];

    const handleSettingChange = (section: keyof SettingsData, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
        setHasChanges(true);
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            // Guardar en localStorage
            localStorage.setItem('app_settings', JSON.stringify(settings));
            
            // Simular guardado en backend
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setHasChanges(false);
            alert('✅ Configuración guardada exitosamente');
        } catch (error) {
            alert('❌ Error al guardar la configuración');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges && !confirm('⚠️ Tienes cambios sin guardar.\n\n¿Deseas descartarlos?')) return;
        
        // Recargar configuración guardada
        const savedSettings = localStorage.getItem('app_settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(prev => ({ ...prev, ...parsed }));
            } catch (error) {
                console.error('Error cargando configuración:', error);
            }
        }
        setHasChanges(false);
    };

    const validatePassword = () => {
        const errors: Record<string, string> = {};
        
        if (!passwordData.current) {
            errors.current = 'La contraseña actual es requerida';
        }
        
        if (!passwordData.new) {
            errors.new = 'La nueva contraseña es requerida';
        } else if (passwordData.new.length < 8) {
            errors.new = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.new)) {
            errors.new = 'Debe contener mayúsculas, minúsculas y números';
        }
        
        if (passwordData.new !== passwordData.confirm) {
            errors.confirm = 'Las contraseñas no coinciden';
        }
        
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = () => {
        if (!validatePassword()) return;
        
        alert('✅ Contraseña cambiada exitosamente');
        setPasswordData({ current: '', new: '', confirm: '' });
        setPasswordErrors({});
    };

    const handleEnable2FA = () => {
        if (!confirm('🔐 Activar Autenticación de Dos Factores\n\nSe enviará un código a tu teléfono móvil.\n\n¿Continuar?')) return;
        const code = prompt('Ingresa el código de 6 dígitos enviado a tu teléfono:');
        if (code && code.length === 6) {
            handleSettingChange('security', 'twoFactorEnabled', true);
            alert('✅ 2FA activado exitosamente\n\nTu cuenta ahora está más segura');
        }
    };

    const handleBackup = () => {
        alert('💾 Creando respaldo manual...\n\nIncluye:\n• Proyectos y tareas\n• Usuarios y permisos\n• Mensajes\n• Configuración\n\n⏳ Tiempo estimado: 2-3 minutos\n\n✅ Se te notificará cuando esté listo');
    };

    const handleExportData = () => {
        if (!confirm('📦 Exportar Todos los Datos\n\nSe creará un archivo ZIP con:\n• Base de datos completa\n• Archivos adjuntos\n• Configuración del sistema\n\n¿Continuar?')) return;
        alert('✅ Exportación iniciada\n\nRecibirás un email con el enlace de descarga en 10-15 minutos');
    };

    const timezones = [
        { value: 'America/Santiago', label: 'Santiago, Chile (GMT-3)' },
        { value: 'America/Buenos_Aires', label: 'Buenos Aires, Argentina (GMT-3)' },
        { value: 'America/Lima', label: 'Lima, Perú (GMT-5)' },
        { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
        { value: 'America/New_York', label: 'Nueva York, USA (GMT-5)' }
    ];

    const languages = [
        { value: 'es', label: 'Español' },
        { value: 'en', label: 'English' },
        { value: 'pt', label: 'Português' }
    ];

    const currencies = [
        { value: 'CLP', label: 'Peso Chileno (CLP)' },
        { value: 'USD', label: 'Dólar (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' },
        { value: 'ARS', label: 'Peso Argentino (ARS)' }
    ];

    const primaryColors = [
        { value: '#3b82f6', name: 'Azul' },
        { value: '#10b981', name: 'Verde' },
        { value: '#f59e0b', name: 'Ámbar' },
        { value: '#ef4444', name: 'Rojo' },
        { value: '#8b5cf6', name: 'Púrpura' },
        { value: '#ec4899', name: 'Rosa' },
        { value: '#06b6d4', name: 'Cian' },
        { value: '#84cc16', name: 'Lima' }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configuración</h1>
                    <p className="text-slate-500 mt-1">Personaliza tu experiencia en el sistema</p>
                </div>
                {hasChanges && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-medium text-amber-700">Tienes cambios sin guardar</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-2 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all group',
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50'
                                )}
                            >
                                <tab.icon className={cn(
                                    'w-5 h-5 transition-transform',
                                    activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
                                )} />
                                <div className="flex-1">
                                    <p className="font-medium">{tab.label}</p>
                                    <p className={cn(
                                        'text-xs mt-0.5',
                                        activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'
                                    )}>
                                        {tab.desc}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* User Info Card */}
                    {currentUser && (
                        <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg",
                                    currentUser.rol === 'jefe' ? "bg-gradient-to-br from-blue-600 to-indigo-600" :
                                    currentUser.rol === 'trabajador' ? "bg-gradient-to-br from-emerald-600 to-teal-600" :
                                    "bg-gradient-to-br from-purple-600 to-pink-600"
                                )}>
                                    {currentUser.nombre.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 truncate">{currentUser.nombre}</p>
                                    <p className="text-xs text-slate-500 capitalize">{currentUser.rol}</p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-slate-100">
                                <p className="text-xs text-slate-500 mb-1">Email</p>
                                <p className="text-sm font-medium text-slate-700 truncate">{currentUser.email}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Globe className="w-6 h-6 text-blue-600" />
                                        Configuración General
                                    </h2>
                                    <p className="text-slate-500 mb-6">Ajusta las preferencias básicas del sistema y la información de la empresa</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                            Información de la Empresa
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                        Nombre de la Empresa <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={settings.general.companyName}
                                                        onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
                                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                        placeholder="Nombre de la empresa"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                        RUT <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={settings.general.rut}
                                                        onChange={(e) => handleSettingChange('general', 'rut', e.target.value)}
                                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                        placeholder="76.XXX.XXX-X"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    Dirección
                                                </label>
                                                <input
                                                    type="text"
                                                    value={settings.general.address}
                                                    onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                    placeholder="Dirección completa"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                                        <Phone className="w-4 h-4" />
                                                        Teléfono
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={settings.general.phone}
                                                        onChange={(e) => handleSettingChange('general', 'phone', e.target.value)}
                                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                        placeholder="+56 2 2XXX XXXX"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                                        <Mail className="w-4 h-4" />
                                                        Email Corporativo
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={settings.general.email}
                                                        onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
                                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                        placeholder="contacto@empresa.cl"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <SettingsIcon className="w-5 h-5 text-blue-600" />
                                            Preferencias Regionales
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Zona Horaria
                                                </label>
                                                <select
                                                    value={settings.general.timezone}
                                                    onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {timezones.map(tz => (
                                                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Idioma</label>
                                                <select
                                                    value={settings.general.language}
                                                    onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {languages.map(lang => (
                                                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4" />
                                                    Moneda
                                                </label>
                                                <select
                                                    value={settings.general.currency}
                                                    onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {currencies.map(curr => (
                                                        <option key={curr.value} value={curr.value}>{curr.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Bell className="w-6 h-6 text-blue-600" />
                                        Notificaciones
                                    </h2>
                                    <p className="text-slate-500 mb-6">Configura cómo y cuándo recibir alertas y notificaciones</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <Mail className="w-5 h-5 text-blue-600" />
                                            Canales de Notificación
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                { key: 'email', label: 'Email', desc: 'Recibir notificaciones por correo electrónico', icon: Mail },
                                                { key: 'push', label: 'Push', desc: 'Notificaciones en el navegador', icon: Bell },
                                                { key: 'sms', label: 'SMS', desc: 'Alertas críticas por mensaje de texto', icon: Smartphone }
                                            ].map((channel) => (
                                                <label key={channel.key} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                            <channel.icon className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{channel.label}</p>
                                                            <p className="text-sm text-slate-500">{channel.desc}</p>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={settings.notifications[channel.key as keyof typeof settings.notifications]}
                                                            onChange={(e) => handleSettingChange('notifications', channel.key, e.target.checked)}
                                                            className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                        />
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <Bell className="w-5 h-5 text-blue-600" />
                                            Tipos de Alertas
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                { key: 'projectUpdates', label: 'Actualizaciones de Proyectos', desc: 'Cambios en cronogramas y estados' },
                                                { key: 'taskAssignments', label: 'Asignación de Tareas', desc: 'Cuando te asignen una nueva tarea' },
                                                { key: 'budgetAlerts', label: 'Alertas de Presupuesto', desc: 'Desviaciones en costos planificados' },
                                                { key: 'messageNotifications', label: 'Mensajes', desc: 'Nuevos mensajes en el chat' },
                                                { key: 'deadlineReminders', label: 'Recordatorios de Fechas', desc: 'Alertas antes de vencimientos' },
                                                { key: 'weeklyReports', label: 'Reportes Semanales', desc: 'Resumen semanal por email' }
                                            ].map((alert) => (
                                                <label key={alert.key} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all">
                                                    <div>
                                                        <p className="font-medium text-slate-900">{alert.label}</p>
                                                        <p className="text-sm text-slate-500">{alert.desc}</p>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.notifications[alert.key as keyof typeof settings.notifications]}
                                                        onChange={(e) => handleSettingChange('notifications', alert.key, e.target.checked)}
                                                        className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Shield className="w-6 h-6 text-blue-600" />
                                        Seguridad
                                    </h2>
                                    <p className="text-slate-500 mb-6">Protege tu cuenta y datos sensibles con configuraciones avanzadas</p>
                                </div>

                                <div className="space-y-4">
                                    <div className={cn(
                                        "p-4 rounded-xl border-2 transition-all",
                                        settings.security.twoFactorEnabled
                                            ? "bg-emerald-50 border-emerald-200"
                                            : "bg-blue-50 border-blue-200"
                                    )}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <Shield className={cn(
                                                    "w-6 h-6 mt-0.5",
                                                    settings.security.twoFactorEnabled ? "text-emerald-600" : "text-blue-600"
                                                )} />
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                                        Autenticación de Dos Factores (2FA)
                                                        {settings.security.twoFactorEnabled && (
                                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3" />
                                                                Activo
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        {settings.security.twoFactorEnabled
                                                            ? 'Tu cuenta está protegida con autenticación de dos factores'
                                                            : 'Agrega una capa extra de seguridad a tu cuenta'}
                                                    </p>
                                                    {!settings.security.twoFactorEnabled && (
                                                        <button
                                                            onClick={handleEnable2FA}
                                                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                                        >
                                                            Activar 2FA
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {settings.security.twoFactorEnabled && (
                                                <button
                                                    onClick={() => handleSettingChange('security', 'twoFactorEnabled', false)}
                                                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    Desactivar
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <Key className="w-5 h-5 text-blue-600" />
                                            Cambiar Contraseña
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña Actual</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword.current ? 'text' : 'password'}
                                                        value={passwordData.current}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                                                        placeholder="Ingresa tu contraseña actual"
                                                        className={cn(
                                                            "w-full px-4 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all",
                                                            passwordErrors.current
                                                                ? "border-red-300 focus:ring-red-500"
                                                                : "border-slate-200 focus:ring-blue-500"
                                                        )}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {passwordErrors.current && (
                                                    <p className="text-xs text-red-600 mt-1">{passwordErrors.current}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Nueva Contraseña</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword.new ? 'text' : 'password'}
                                                        value={passwordData.new}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                                                        placeholder="Mínimo 8 caracteres, mayúsculas, minúsculas y números"
                                                        className={cn(
                                                            "w-full px-4 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all",
                                                            passwordErrors.new
                                                                ? "border-red-300 focus:ring-red-500"
                                                                : "border-slate-200 focus:ring-blue-500"
                                                        )}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {passwordErrors.new && (
                                                    <p className="text-xs text-red-600 mt-1">{passwordErrors.new}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Confirmar Nueva Contraseña</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword.confirm ? 'text' : 'password'}
                                                        value={passwordData.confirm}
                                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                                                        placeholder="Confirma tu nueva contraseña"
                                                        className={cn(
                                                            "w-full px-4 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all",
                                                            passwordErrors.confirm
                                                                ? "border-red-300 focus:ring-red-500"
                                                                : "border-slate-200 focus:ring-blue-500"
                                                        )}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                    >
                                                        {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {passwordErrors.confirm && (
                                                    <p className="text-xs text-red-600 mt-1">{passwordErrors.confirm}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={handleChangePassword}
                                                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                Cambiar Contraseña
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                            Configuración de Sesión
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Tiempo de Inactividad (minutos)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="5"
                                                    max="120"
                                                    value={settings.security.sessionTimeout}
                                                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">La sesión se cerrará automáticamente después de {settings.security.sessionTimeout} minutos de inactividad</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Expiración de Contraseña (días)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="30"
                                                    max="365"
                                                    value={settings.security.passwordExpiry}
                                                    onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">Se requerirá cambiar la contraseña cada {settings.security.passwordExpiry} días</p>
                                            </div>
                                            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                                                <div>
                                                    <p className="font-medium text-slate-900">Alertas de Inicio de Sesión</p>
                                                    <p className="text-sm text-slate-500">Recibir notificación cuando alguien inicie sesión en tu cuenta</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={settings.security.loginAlerts}
                                                    onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
                                                    className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <h3 className="font-semibold text-slate-900 mb-3">Sesiones Activas</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                <div className="flex items-center gap-3">
                                                    <Monitor className="w-5 h-5 text-slate-400" />
                                                    <div>
                                                        <p className="font-medium text-slate-900">Windows • Chrome</p>
                                                        <p className="text-sm text-slate-500">Santiago, Chile • Activa ahora</p>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">Actual</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Palette className="w-6 h-6 text-blue-600" />
                                        Apariencia
                                    </h2>
                                    <p className="text-slate-500 mb-6">Personaliza la interfaz del sistema según tus preferencias</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <Moon className="w-5 h-5 text-blue-600" />
                                            Tema
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { id: 'light', label: 'Claro', icon: Sun, active: settings.appearance.theme === 'light' },
                                                { id: 'dark', label: 'Oscuro', icon: Moon, active: settings.appearance.theme === 'dark' },
                                                { id: 'auto', label: 'Automático', icon: Monitor, active: settings.appearance.theme === 'auto' }
                                            ].map((theme) => (
                                                <button
                                                    key={theme.id}
                                                    onClick={() => handleSettingChange('appearance', 'theme', theme.id)}
                                                    className={cn(
                                                        'p-4 rounded-xl border-2 transition-all text-center',
                                                        theme.active
                                                            ? 'border-blue-600 bg-blue-50 shadow-md'
                                                            : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                                    )}
                                                >
                                                    <theme.icon className={cn(
                                                        'w-8 h-8 mx-auto mb-2',
                                                        theme.active ? 'text-blue-600' : 'text-slate-400'
                                                    )} />
                                                    <p className={cn(
                                                        'font-semibold',
                                                        theme.active ? 'text-blue-700' : 'text-slate-700'
                                                    )}>
                                                        {theme.label}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <Palette className="w-5 h-5 text-blue-600" />
                                            Color Principal
                                        </h3>
                                        <div className="grid grid-cols-4 gap-3">
                                            {primaryColors.map((color) => (
                                                <button
                                                    key={color.value}
                                                    onClick={() => handleSettingChange('appearance', 'primaryColor', color.value)}
                                                    className={cn(
                                                        'relative w-full aspect-square rounded-xl border-2 shadow-lg hover:scale-105 transition-transform',
                                                        settings.appearance.primaryColor === color.value
                                                            ? 'border-blue-600 ring-2 ring-blue-300'
                                                            : 'border-white'
                                                    )}
                                                    style={{ backgroundColor: color.value }}
                                                    title={color.name}
                                                >
                                                    {settings.appearance.primaryColor === color.value && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <CheckCircle className="w-6 h-6 text-white drop-shadow-lg" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            Tamaño de Fuente
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { value: 'small', label: 'Pequeño', desc: 'Más contenido visible' },
                                                { value: 'medium', label: 'Mediano', desc: 'Recomendado' },
                                                { value: 'large', label: 'Grande', desc: 'Mejor legibilidad' }
                                            ].map((size) => (
                                                <button
                                                    key={size.value}
                                                    onClick={() => handleSettingChange('appearance', 'fontSize', size.value)}
                                                    className={cn(
                                                        'p-4 rounded-xl border-2 transition-all text-center',
                                                        settings.appearance.fontSize === size.value
                                                            ? 'border-blue-600 bg-blue-50'
                                                            : 'border-slate-200 hover:border-slate-300'
                                                    )}
                                                >
                                                    <p className={cn(
                                                        'font-semibold mb-1',
                                                        size.value === 'small' ? 'text-sm' : size.value === 'medium' ? 'text-base' : 'text-lg',
                                                        settings.appearance.fontSize === size.value ? 'text-blue-700' : 'text-slate-700'
                                                    )}>
                                                        {size.label}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{size.desc}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <h3 className="font-semibold text-slate-900 mb-4">Opciones de Interfaz</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                                                <div>
                                                    <p className="font-medium text-slate-900">Modo Compacto</p>
                                                    <p className="text-sm text-slate-500">Reduce el espaciado para mostrar más contenido</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={settings.appearance.compactMode}
                                                    onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                                                    className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                            </label>
                                            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-blue-300 transition-colors">
                                                <div>
                                                    <p className="font-medium text-slate-900">Barra Lateral Colapsada</p>
                                                    <p className="text-sm text-slate-500">Inicia con la barra lateral minimizada</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={settings.appearance.sidebarCollapsed}
                                                    onChange={(e) => handleSettingChange('appearance', 'sidebarCollapsed', e.target.checked)}
                                                    className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'integrations' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Link2 className="w-6 h-6 text-blue-600" />
                                        Integraciones
                                    </h2>
                                    <p className="text-slate-500 mb-6">Conecta servicios externos para mejorar tu experiencia</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { 
                                            key: 'emailEnabled', 
                                            label: 'Servicio de Email', 
                                            desc: 'Integración con proveedores de email (Gmail, Outlook)',
                                            icon: Mail,
                                            color: 'blue'
                                        },
                                        { 
                                            key: 'smsEnabled', 
                                            label: 'Servicio de SMS', 
                                            desc: 'Envío de mensajes de texto para notificaciones críticas',
                                            icon: Smartphone,
                                            color: 'emerald'
                                        },
                                        { 
                                            key: 'calendarSync', 
                                            label: 'Sincronización de Calendario', 
                                            desc: 'Sincroniza eventos con Google Calendar o Outlook',
                                            icon: Calendar,
                                            color: 'purple'
                                        },
                                        { 
                                            key: 'cloudStorage', 
                                            label: 'Almacenamiento en la Nube', 
                                            desc: 'Integración con Google Drive, Dropbox o OneDrive',
                                            icon: Database,
                                            color: 'amber'
                                        }
                                    ].map((integration) => (
                                        <div key={integration.key} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "p-2 rounded-lg",
                                                        integration.color === 'blue' ? "bg-blue-50" :
                                                        integration.color === 'emerald' ? "bg-emerald-50" :
                                                        integration.color === 'purple' ? "bg-purple-50" :
                                                        "bg-amber-50"
                                                    )}>
                                                        <integration.icon className={cn(
                                                            "w-5 h-5",
                                                            integration.color === 'blue' ? "text-blue-600" :
                                                            integration.color === 'emerald' ? "text-emerald-600" :
                                                            integration.color === 'purple' ? "text-purple-600" :
                                                            "text-amber-600"
                                                        )} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{integration.label}</p>
                                                        <p className="text-sm text-slate-500">{integration.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {settings.integrations[integration.key as keyof typeof settings.integrations] ? (
                                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Conectado
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleSettingChange('integrations', integration.key, true)}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                                        >
                                                            Conectar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'data' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Database className="w-6 h-6 text-blue-600" />
                                        Gestión de Datos
                                    </h2>
                                    <p className="text-slate-500 mb-6">Administra el almacenamiento y respaldo de información</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <h3 className="font-semibold text-slate-900 mb-4">Uso de Almacenamiento</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-slate-600 font-medium">Documentos</span>
                                                    <span className="font-semibold text-slate-900">2.4 GB / 10 GB</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                                    <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: '24%' }}></div>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">24% utilizado</p>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-slate-600 font-medium">Imágenes</span>
                                                    <span className="font-semibold text-slate-900">1.8 GB / 10 GB</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                                    <div className="bg-emerald-600 h-2.5 rounded-full transition-all" style={{ width: '18%' }}></div>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">18% utilizado</p>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-slate-600 font-medium">Videos</span>
                                                    <span className="font-semibold text-slate-900">0.5 GB / 10 GB</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                                    <div className="bg-purple-600 h-2.5 rounded-full transition-all" style={{ width: '5%' }}></div>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">5% utilizado</p>
                                            </div>
                                            <div className="pt-3 border-t border-slate-200">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-semibold text-slate-900">Total</span>
                                                    <span className="font-bold text-slate-900">4.7 GB / 10 GB</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                        <div className="flex items-start gap-3 mb-3">
                                            <Database className="w-6 h-6 text-amber-600 mt-0.5" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-amber-900 mb-1">Respaldo Automático</h3>
                                                <p className="text-sm text-amber-700 mb-3">Último respaldo: Hoy a las 03:00 AM</p>
                                                <p className="text-xs text-amber-600 mb-3">Los respaldos automáticos se realizan diariamente a las 3:00 AM</p>
                                                <button
                                                    onClick={handleBackup}
                                                    className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Crear Respaldo Manual
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-red-900 mb-1">Zona de Peligro</h3>
                                                <p className="text-sm text-red-700 mb-3">Acciones irreversibles que afectan tus datos</p>
                                                <div className="space-y-2">
                                                    <button
                                                        onClick={handleExportData}
                                                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Exportar Todos los Datos
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('⚠️ ¿Estás seguro de eliminar todos los datos?\n\nEsta acción es IRREVERSIBLE.')) {
                                                                alert('🗑️ Eliminación iniciada...');
                                                            }
                                                        }}
                                                        className="w-full px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Eliminar Todos los Datos
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3">
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                disabled={!hasChanges || isSaving}
                                className={cn(
                                    "px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2",
                                    hasChanges && !isSaving
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                )}
                            >
                                {isSaving ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
