// Clase GestorDocumental para la gestión de archivos y permisos
class GestorDocumental {
    constructor() {
        this.documentos = [];
    }

    // Método para agregar un documento
    agregarDocumento(documento) {
        this.documentos.push(documento);
    }

    // Método para listar documentos
    listarDocumentos() {
        return this.documentos;
    }

    // Método para validar permisos
    validarPermiso(usuario, documento) {
        return documento.permisos.includes(usuario.rol);
    }

    // Método para descargar un documento
    descargarDocumento(documentoId) {
        const documento = this.documentos.find(doc => doc.id === documentoId);
        if (documento) {
            console.log(`Descargando: ${documento.nombre}`);
        } else {
            console.error('Documento no encontrado');
        }
    }
}

// Exportar la clase para su uso en otros módulos
export default GestorDocumental;