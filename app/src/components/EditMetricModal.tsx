import { useState } from 'react';
import { X, Target, AlertCircle } from 'lucide-react';

interface EditMetricModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    metricData: {
        metric: string;
        value: number;
        target: number;
    };
}

export function EditMetricModal({ isOpen, onClose, onSave, metricData }: EditMetricModalProps) {
    const [value, setValue] = useState(metricData.value.toString());
    const [target, setTarget] = useState(metricData.target.toString());
    const [errors, setErrors] = useState<{ value?: string; target?: string }>({});

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors: { value?: string; target?: string } = {};
        const valueNum = parseFloat(value);
        const targetNum = parseFloat(target);
        
        if (isNaN(valueNum) || valueNum < 0 || valueNum > 100) {
            newErrors.value = 'El valor debe ser un número entre 0 y 100';
        }
        
        if (isNaN(targetNum) || targetNum < 0 || targetNum > 100) {
            newErrors.target = 'El objetivo debe ser un número entre 0 y 100';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        onSave({
            value: valueNum,
            target: targetNum
        });
        onClose();
    };

    const handleChange = (field: 'value' | 'target', val: string) => {
        if (field === 'value') {
            setValue(val);
        } else {
            setTarget(val);
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
                            <Target className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">Editar Métrica</h3>
                            <p className="text-xs text-slate-500">{metricData.metric}</p>
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
                            Valor Actual (%) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            placeholder="94"
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
                                <AlertCircle className="w-3 h-3" />
                                {errors.value}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">
                            Objetivo (%) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            placeholder="95"
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.target 
                                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                    : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                            } outline-none transition-all`}
                            value={target}
                            onChange={(e) => handleChange('target', e.target.value)}
                        />
                        {errors.target && (
                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.target}
                            </p>
                        )}
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-700">
                            <strong>Nota:</strong> Los valores deben estar entre 0 y 100. El valor actual se comparará con el objetivo para determinar el estado.
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

