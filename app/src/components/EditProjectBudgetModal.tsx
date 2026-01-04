import { useState } from 'react';
import { X, DollarSign, Building2, AlertCircle } from 'lucide-react';

interface EditProjectBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    projectData: {
        id: number;
        name: string;
        budget: number;
        spent: number;
    };
}

export function EditProjectBudgetModal({ isOpen, onClose, onSave, projectData }: EditProjectBudgetModalProps) {
    const [budget, setBudget] = useState(projectData.budget.toString());
    const [spent, setSpent] = useState(projectData.spent.toString());
    const [errors, setErrors] = useState<{ budget?: string; spent?: string }>({});

    if (!isOpen) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors: { budget?: string; spent?: string } = {};
        const budgetNum = parseFloat(budget.replace(/[^0-9.-]+/g, ''));
        const spentNum = parseFloat(spent.replace(/[^0-9.-]+/g, ''));
        
        if (isNaN(budgetNum) || budgetNum <= 0) {
            newErrors.budget = 'El presupuesto debe ser mayor a 0';
        }
        
        if (isNaN(spentNum) || spentNum < 0) {
            newErrors.spent = 'El gasto debe ser mayor o igual a 0';
        }
        
        if (spentNum > budgetNum) {
            newErrors.spent = 'El gasto no puede ser mayor al presupuesto';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        onSave({
            budget: budgetNum,
            spent: spentNum,
            progress: (spentNum / budgetNum) * 100
        });
        onClose();
    };

    const handleChange = (field: 'budget' | 'spent', val: string) => {
        // Remover caracteres no numéricos excepto punto y coma
        const cleaned = val.replace(/[^0-9.,]/g, '').replace(',', '.');
        if (field === 'budget') {
            setBudget(cleaned);
        } else {
            setSpent(cleaned);
        }
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const budgetNum = parseFloat(budget.replace(/[^0-9.-]+/g, '')) || 0;
    const spentNum = parseFloat(spent.replace(/[^0-9.-]+/g, '')) || 0;
    const remaining = budgetNum - spentNum;
    const percentage = budgetNum > 0 ? (spentNum / budgetNum) * 100 : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">Editar Presupuesto</h3>
                            <p className="text-xs text-slate-500">{projectData.name}</p>
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
                            Presupuesto Total <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="1200000"
                                className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                                    errors.budget 
                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                } outline-none transition-all`}
                                value={budget}
                                onChange={(e) => handleChange('budget', e.target.value)}
                            />
                        </div>
                        {errors.budget && (
                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.budget}
                            </p>
                        )}
                        {!errors.budget && budgetNum > 0 && (
                            <p className="text-xs text-slate-500 mt-1">
                                {formatCurrency(budgetNum)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">
                            Gasto Ejecutado <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="950000"
                                className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                                    errors.spent 
                                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                } outline-none transition-all`}
                                value={spent}
                                onChange={(e) => handleChange('spent', e.target.value)}
                            />
                        </div>
                        {errors.spent && (
                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.spent}
                            </p>
                        )}
                        {!errors.spent && spentNum > 0 && (
                            <p className="text-xs text-slate-500 mt-1">
                                {formatCurrency(spentNum)}
                            </p>
                        )}
                    </div>

                    {budgetNum > 0 && spentNum >= 0 && !errors.budget && !errors.spent && (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Disponible:</span>
                                <span className="font-semibold text-slate-800">{formatCurrency(remaining)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Porcentaje usado:</span>
                                <span className={cn(
                                    "font-semibold",
                                    percentage > 90 ? "text-red-600" : percentage > 75 ? "text-amber-600" : "text-emerald-600"
                                )}>
                                    {percentage.toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                                <div
                                    className={cn(
                                        "h-2 rounded-full transition-all",
                                        percentage > 90 ? "bg-red-500" : percentage > 75 ? "bg-amber-500" : "bg-emerald-500"
                                    )}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

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

function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

