import { useState } from 'react';
import { X, DollarSign, Briefcase, CheckCircle2, AlertTriangle, Users, Zap } from 'lucide-react';
import { AlertCircle as AlertIcon } from 'lucide-react';

interface EditKPIModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    kpiData: {
        label: string;
        value: string;
        trend: string;
        trendUp: boolean;
    };
}

const kpiIcons: Record<string, any> = {
    'Presupuesto Total': DollarSign,
    'Proyectos Activos': Briefcase,
    'Completados': CheckCircle2,
    'Riesgos Activos': AlertTriangle,
    'Usuarios Activos': Users,
    'Eficiencia Global': Zap,
};

export function EditKPIModal({ isOpen, onClose, onSave, kpiData }: EditKPIModalProps) {
    const [value, setValue] = useState(kpiData.value);
    const [trend, setTrend] = useState(kpiData.trend);
    const [trendUp, setTrendUp] = useState(kpiData.trendUp);
    const [errors, setErrors] = useState<{ value?: string; trend?: string }>({});

    if (!isOpen) return null;

    const Icon = kpiIcons[kpiData.label] || DollarSign;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors: { value?: string; trend?: string } = {};
        
        if (!value.trim()) {
            newErrors.value = 'El valor es requerido';
        }
        
        if (!trend.trim()) {
            newErrors.trend = 'La tendencia es requerida';
        } else if (!/^[+-]?\d+%?$/.test(trend)) {
            newErrors.trend = 'Formato inválido (ej: +12% o -5)';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        onSave({
            value: value.trim(),
            trend: trend.trim(),
            trendUp
        });
        onClose();
    };

    const handleChange = (field: 'value' | 'trend', val: string) => {
        if (field === 'value') {
            setValue(val);
        } else {
            setTrend(val);
        }
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">Editar KPI</h3>
                            <p className="text-xs text-slate-500">{kpiData.label}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">
                            Valor <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: $2.400.000 o 24"
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.value 
                                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                    : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                            } outline-none transition-all`}
                            value={value}
                            onChange={(e) => handleChange('value', e.target.value)}
                        />
                        {errors.value && (
                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertIcon className="w-3 h-3" />
                                {errors.value}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">
                            Tendencia <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="+12% o -5"
                                className={`flex-1 px-4 py-2 rounded-lg border ${
                                    errors.trend 
                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                } outline-none transition-all`}
                                value={trend}
                                onChange={(e) => handleChange('trend', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setTrendUp(!trendUp)}
                                className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                                    trendUp
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-red-50 border-red-200 text-red-700'
                                }`}
                            >
                                {trendUp ? '↑' : '↓'}
                            </button>
                        </div>
                        {errors.trend && (
                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertIcon className="w-3 h-3" />
                                {errors.trend}
                            </p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                            Formato: +12% o -5 (positivo = tendencia al alza)
                        </p>
                    </div>

                    <div className="pt-4 flex gap-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

