import { useState } from 'react';
import { X, FileText, AlertCircle, Calendar, DollarSign, Tag, Save } from 'lucide-react';
import { cn } from '../lib/utils';

interface CreateRequirementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (requirement: RequirementData) => void;
    projectId?: number;
}

export interface RequirementData {
    titulo: string;
    descripcion: string;
    tipo: 'funcional' | 'tecnico' | 'diseño' | 'legal' | 'otro';
    prioridad: 'baja' | 'media' | 'alta' | 'critica';
    fecha_limite?: string;
    costo_estimado?: number;
    proyecto_id?: number;
}

export function CreateRequirementModal({ isOpen, onClose, onSave, projectId }: CreateRequirementModalProps) {
    const [formData, setFormData] = useState<RequirementData>({
        titulo: '',
        descripcion: '',
        tipo: 'funcional',
        prioridad: 'media',
        fecha_limite: '',
        costo_estimado: undefined,
        proyecto_id: projectId
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.titulo.trim()) {
            newErrors.titulo = 'El título es requerido';
        }
        
        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        }
        
        if (formData.descripcion.length < 10) {
            newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
            // Reset form
            setFormData({
                titulo: '',
                descripcion: '',
                tipo: 'funcional',
                prioridad: 'media',
                fecha_limite: '',
                costo_estimado: undefined,
                proyecto_id: projectId
            });
            setErrors({});
            onClose();
        }
    };

    const tipoOptions = [
        { value: 'funcional', label: 'Funcional', icon: '⚙️' },
        { value: 'tecnico', label: 'Técnico', icon: '🔧' },
        { value: 'diseño', label: 'Diseño', icon: '🎨' },
        { value: 'legal', label: 'Legal', icon: '📋' },
        { value: 'otro', label: 'Otro', icon: '📌' }
    ];

    const prioridadColors = {
        baja: 'bg-slate-100 text-slate-700 border-slate-200',
        media: 'bg-blue-100 text-blue-700 border-blue-200',
        alta: 'bg-amber-100 text-amber-700 border-amber-200',
        critica: 'bg-red-100 text-red-700 border-red-200'
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Nuevo Requisito</h2>
                            <p className="text-blue-100 text-sm">Solicita cambios o mejoras para tu proyecto</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Título del Requisito *
                        </label>
                        <input
                            type="text"
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            className={cn(
                                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                errors.titulo ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500"
                            )}
                            placeholder="Ej: Instalación de sistema de seguridad adicional"
                        />
                        {errors.titulo && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.titulo}
                            </p>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Descripción Detallada *
                        </label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            rows={5}
                            className={cn(
                                "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none",
                                errors.descripcion ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500"
                            )}
                            placeholder="Describe detalladamente el requisito, incluyendo especificaciones técnicas si aplica..."
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            {formData.descripcion.length} caracteres (mínimo 10)
                        </p>
                        {errors.descripcion && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.descripcion}
                            </p>
                        )}
                    </div>

                    {/* Tipo y Prioridad */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <Tag className="w-4 h-4 inline mr-1" />
                                Tipo de Requisito
                            </label>
                            <select
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as RequirementData['tipo'] })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {tipoOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.icon} {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <AlertCircle className="w-4 h-4 inline mr-1" />
                                Prioridad
                            </label>
                            <select
                                value={formData.prioridad}
                                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value as RequirementData['prioridad'] })}
                                className={cn(
                                    "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                    `border-${formData.prioridad === 'baja' ? 'slate' : formData.prioridad === 'media' ? 'blue' : formData.prioridad === 'alta' ? 'amber' : 'red'}-200`,
                                    `focus:ring-${formData.prioridad === 'baja' ? 'slate' : formData.prioridad === 'media' ? 'blue' : formData.prioridad === 'alta' ? 'amber' : 'red'}-500`
                                )}
                            >
                                <option value="baja">🟢 Baja</option>
                                <option value="media">🟡 Media</option>
                                <option value="alta">🟠 Alta</option>
                                <option value="critica">🔴 Crítica</option>
                            </select>
                        </div>
                    </div>

                    {/* Fecha Límite y Costo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Fecha Límite (Opcional)
                            </label>
                            <input
                                type="date"
                                value={formData.fecha_limite}
                                onChange={(e) => setFormData({ ...formData, fecha_limite: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Costo Estimado (Opcional)
                            </label>
                            <input
                                type="number"
                                value={formData.costo_estimado || ''}
                                onChange={(e) => setFormData({ ...formData, costo_estimado: e.target.value ? parseFloat(e.target.value) : undefined })}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">Información importante:</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-700">
                                    <li>Tu requisito será revisado por el equipo de proyecto</li>
                                    <li>Recibirás una notificación cuando sea aprobado o rechazado</li>
                                    <li>Los requisitos críticos serán priorizados automáticamente</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            Crear Requisito
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
