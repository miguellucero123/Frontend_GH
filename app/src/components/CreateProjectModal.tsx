import { useState } from 'react';
import { X, Calendar, Type, MapPin, Building, DollarSign } from 'lucide-react';
import { projectService, CreateProjectData } from '../services/projectService';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProjectCreated: () => void;
}

const initialFormData: CreateProjectData = {
    nombre_mandante: '',
    direccion: '',
    ciudad: '',
    descripcion: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_termino_estimado: '',
    costo_inicial: 0,
    costos_adicionales: 0,
    costos_extras: 0
};

export function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateProjectData>(initialFormData);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await projectService.create(formData);
            onProjectCreated();
            onClose();
            setFormData(initialFormData);
        } catch (error) {
            console.error(error);
            alert('Error al crear el proyecto. Verifica los datos e intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof CreateProjectData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
                    <h3 className="font-bold text-lg text-slate-800">Nuevo Proyecto</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información Básica */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Información General</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Nombre del Mandante</label>
                                <div className="relative">
                                    <Type className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Cliente o Nombre Proyecto"
                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        value={formData.nombre_mandante}
                                        onChange={(e) => handleChange('nombre_mandante', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Ciudad</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ciudad de la obra"
                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        value={formData.ciudad}
                                        onChange={(e) => handleChange('ciudad', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Dirección</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Dirección completa de la obra"
                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        value={formData.direccion}
                                        onChange={(e) => handleChange('direccion', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700">Descripción</label>
                                <textarea
                                    placeholder="Detalles clave del proyecto..."
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all h-20 resize-none"
                                    value={formData.descripcion}
                                    onChange={(e) => handleChange('descripcion', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Plazos</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Fecha de Inicio</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        required
                                        type="date"
                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        value={formData.fecha_inicio}
                                        onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Término Estimado</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        required
                                        type="date"
                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        value={formData.fecha_termino_estimado}
                                        onChange={(e) => handleChange('fecha_termino_estimado', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Costos */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Presupuesto Inicial</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Costo Inicial</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        value={formData.costo_inicial || ''}
                                        onChange={(e) => handleChange('costo_inicial', Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Adicionales</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        value={formData.costos_adicionales || ''}
                                        onChange={(e) => handleChange('costos_adicionales', Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Extras</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        value={formData.costos_extras || ''}
                                        onChange={(e) => handleChange('costos_extras', Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex gap-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                        >
                            {loading ? 'Creando Proyecto...' : 'Crear Proyecto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
