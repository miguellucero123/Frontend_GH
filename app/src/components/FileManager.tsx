import { useState, useEffect } from 'react';
import { Folder as FolderIcon, FileText, ChevronRight, Upload, Home, FolderPlus } from 'lucide-react';
import { cn } from '../lib/utils';
import { folderService, Folder } from '../services/folderService';

interface FileManagerProps {
    projectId: number;
}

export function FileManager({ projectId }: FileManagerProps) {
    const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [files, setFiles] = useState<any[]>([]); // TODO: Type File interface
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: number | null, name: string }[]>([{ id: null, name: 'Inicio' }]);

    useEffect(() => {
        loadContents();
    }, [projectId, currentFolderId]);

    const loadContents = async () => {
        try {
            // Cargar carpetas
            // Nota: folderService.list actualmente no filtra por carpeta padre en el frontend service,
            // pero el backend sí lo soporta (veremos si implementamos getByParent).
            // Por ahora asumiremos que list devuelve estructura plana o ajustamos.

            // Si folderService.getTree está implementado, usémoslo o listemos planos.
            // Vamos a usar list. Pero necesitamos filtrar por parent.
            // Si el servicio no lo soporta, traeremos todo y filtraremos en cliente (MVP).
            const allFolders = await folderService.list(projectId);
            setFolders(allFolders.filter(f => f.carpeta_padre_id === currentFolderId));

            // TODO: Cargar archivos (fileService aún no existe en frontend)
            setFiles([]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleNavigate = (folder: Folder) => {
        setCurrentFolderId(folder.id);
        setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.nombre }]);
    };

    const handleNavigateBreadcrumb = (index: number) => {
        const item = breadcrumbs[index];
        setCurrentFolderId(item.id);
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    };

    const handleCreateFolder = async () => {
        const name = prompt("Nombre de la carpeta:");
        if (name) {
            try {
                await folderService.create({
                    nombre: name,
                    proyecto_id: projectId,
                    carpeta_padre_id: currentFolderId || undefined
                });
                loadContents();
            } catch (e) {
                alert("Error creando carpeta");
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    {breadcrumbs.map((item, idx) => (
                        <div key={idx} className="flex items-center">
                            {idx > 0 && <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />}
                            <button
                                onClick={() => handleNavigateBreadcrumb(idx)}
                                className={cn("hover:text-blue-600 font-medium", idx === breadcrumbs.length - 1 && "text-slate-900 font-bold")}
                            >
                                {item.id === null ? <Home className="w-4 h-4" /> : item.name}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCreateFolder}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-700"
                    >
                        <FolderPlus className="w-4 h-4" /> Nueva Carpeta
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        <Upload className="w-4 h-4" /> Subir Archivo
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Folders */}
                    {folders.map(folder => (
                        <div
                            key={folder.id}
                            onDoubleClick={() => handleNavigate(folder)}
                            className="group p-4 border border-slate-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all flex flex-col items-center gap-3 text-center"
                        >
                            <FolderIcon className="w-12 h-12 text-blue-400 fill-blue-100 group-hover:text-blue-500 group-hover:fill-blue-200 transition-colors" />
                            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 truncate w-full">
                                {folder.nombre}
                            </span>
                        </div>
                    ))}

                    {/* Files (Placeholder) */}
                    {files.map(file => (
                        <div key={file.id} className="group p-4 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-all flex flex-col items-center gap-3 text-center">
                            <FileText className="w-12 h-12 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 truncate w-full">
                                {file.nombre}
                            </span>
                        </div>
                    ))}

                    {folders.length === 0 && files.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-400">
                            <p>Carpeta vacía</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
