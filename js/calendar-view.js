/**
 * ============================================================================
 * VISTA DE CALENDARIO - MEJORA FASE 1
 * ============================================================================
 * Calendario para visualizar hitos y eventos del proyecto
 * Versión: 1.0.0
 * ============================================================================
 */

class CalendarView {
    constructor() {
        this.currentDate = new Date();
        this.events = [];
        this.init();
    }

    /**
     * Inicializar vista de calendario
     */
    init() {
        this.loadEvents();
        this.createCalendarButton();
    }

    /**
     * Crear botón de calendario
     */
    createCalendarButton() {
        const btn = document.createElement('button');
        btn.id = 'btnCalendarView';
        btn.className = 'fixed top-20 right-24 z-40 glass-effect rounded-lg px-4 py-2 text-sm text-white hover:bg-white/10 transition-all flex items-center gap-2';
        btn.innerHTML = '<i class="fas fa-calendar-alt"></i> Calendario';
        btn.onclick = () => this.showCalendar();
        document.body.appendChild(btn);
    }

    /**
     * Mostrar calendario
     */
    showCalendar() {
        const modal = document.createElement('div');
        modal.id = 'calendarModal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="this.closest('#calendarModal').remove()"></div>
            <div class="relative glass-effect rounded-xl p-6 border border-white/10 shadow-2xl max-w-4xl w-full">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-white flex items-center gap-2">
                        <i class="fas fa-calendar-alt text-blue-400"></i>
                        Calendario de Hitos
                    </h3>
                    <div class="flex items-center gap-2">
                        <button onclick="calendarView.previousMonth()" 
                            class="text-slate-400 hover:text-white">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span id="calendarMonth" class="text-white font-semibold min-w-[200px] text-center"></span>
                        <button onclick="calendarView.nextMonth()" 
                            class="text-slate-400 hover:text-white">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button onclick="this.closest('#calendarModal').remove()" 
                            class="text-slate-400 hover:text-white ml-4">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <div id="calendarGrid" class="grid grid-cols-7 gap-2">
                    ${this.renderCalendar()}
                </div>

                <div class="mt-4 pt-4 border-t border-slate-700">
                    <h4 class="text-white font-semibold mb-2">Leyenda:</h4>
                    <div class="flex items-center gap-4 text-sm">
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded bg-green-500"></div>
                            <span class="text-slate-300">Completado</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded bg-blue-500"></div>
                            <span class="text-slate-300">En Progreso</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded bg-red-500"></div>
                            <span class="text-slate-300">Retrasado</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-4 h-4 rounded bg-yellow-500"></div>
                            <span class="text-slate-300">Pendiente</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.updateMonthLabel();
    }

    /**
     * Renderizar calendario
     */
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        let html = '';

        // Días de la semana
        const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        weekDays.forEach(day => {
            html += `<div class="text-center text-slate-400 font-semibold text-sm py-2">${day}</div>`;
        });

        // Días vacíos al inicio
        for (let i = 0; i < startingDayOfWeek; i++) {
            html += '<div class="aspect-square"></div>';
        }

        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = this.formatDate(date);
            const dayEvents = this.getEventsForDate(date);

            html += `
                <div class="aspect-square glass-effect rounded-lg p-1 border border-white/5 hover:border-blue-500 transition-all cursor-pointer"
                     onclick="calendarView.showDayDetails('${dateStr}')">
                    <div class="text-white text-sm font-semibold mb-1">${day}</div>
                    <div class="space-y-1">
                        ${dayEvents.slice(0, 3).map(event => `
                            <div class="text-xs px-1 py-0.5 rounded ${this.getEventColorClass(event)} truncate"
                                 title="${event.title}">
                                ${event.title}
                            </div>
                        `).join('')}
                        ${dayEvents.length > 3 ? `<div class="text-xs text-slate-400">+${dayEvents.length - 3}</div>` : ''}
                    </div>
                </div>
            `;
        }

        return html;
    }

    /**
     * Obtener eventos para una fecha
     */
    getEventsForDate(date) {
        const dateStr = this.formatDate(date);
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return this.formatDate(eventDate) === dateStr;
        });
    }

    /**
     * Obtener clase de color para evento
     */
    getEventColorClass(event) {
        if (event.status === 'completed') return 'bg-green-500 text-white';
        if (event.status === 'in-progress') return 'bg-blue-500 text-white';
        if (event.status === 'delayed') return 'bg-red-500 text-white';
        return 'bg-yellow-500 text-white';
    }

    /**
     * Formatear fecha
     */
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Mes anterior
     */
    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.updateCalendar();
    }

    /**
     * Mes siguiente
     */
    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.updateCalendar();
    }

    /**
     * Actualizar calendario
     */
    updateCalendar() {
        const grid = document.getElementById('calendarGrid');
        if (grid) {
            grid.innerHTML = this.renderCalendar();
        }
        this.updateMonthLabel();
    }

    /**
     * Actualizar etiqueta de mes
     */
    updateMonthLabel() {
        const label = document.getElementById('calendarMonth');
        if (label) {
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            label.textContent = `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        }
    }

    /**
     * Mostrar detalles del día
     */
    showDayDetails(dateStr) {
        const dayEvents = this.events.filter(e => {
            const eventDate = new Date(e.date);
            return this.formatDate(eventDate) === dateStr;
        });

        if (dayEvents.length === 0) {
            alert('No hay eventos para este día');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" onclick="this.remove()"></div>
            <div class="relative glass-effect rounded-xl p-6 border border-white/10 shadow-2xl max-w-md w-full">
                <h4 class="text-white font-bold mb-4">Eventos del ${new Date(dateStr).toLocaleDateString('es-ES')}</h4>
                <div class="space-y-2">
                    ${dayEvents.map(event => `
                        <div class="glass-effect rounded-lg p-3 border border-white/5">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-white font-semibold">${event.title}</span>
                                <span class="badge badge-${event.status} text-xs">${event.status}</span>
                            </div>
                            <p class="text-slate-400 text-sm">${event.description || ''}</p>
                            ${event.project ? `<p class="text-slate-500 text-xs mt-1">Proyecto: ${event.project}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Cargar eventos desde proyectos
     */
    loadEvents() {
        // Cargar desde proyectos si están disponibles
        if (typeof window.gestorGerencia !== 'undefined') {
            const proyectos = window.gestorGerencia.obtenerProyectos();
            
            proyectos.forEach(proyecto => {
                if (proyecto.hitos) {
                    proyecto.hitos.forEach(hito => {
                        this.events.push({
                            id: `hito_${proyecto.id}_${hito.id}`,
                            title: hito.nombre || 'Hito',
                            date: hito.fechaFin || hito.fechaInicio,
                            description: hito.descripcion,
                            project: proyecto.nombre,
                            status: this.getHitoStatus(hito)
                        });
                    });
                }
            });
        }

        // Cargar desde localStorage
        const saved = localStorage.getItem('calendarEvents');
        if (saved) {
            try {
                const savedEvents = JSON.parse(saved);
                this.events = [...this.events, ...savedEvents];
            } catch (error) {
                console.warn('Error cargando eventos:', error);
            }
        }
    }

    /**
     * Obtener estado de hito
     */
    getHitoStatus(hito) {
        const fechaFin = new Date(hito.fechaFin);
        const hoy = new Date();
        
        if (hito.completado) return 'completed';
        if (fechaFin < hoy) return 'delayed';
        if (hito.enProgreso) return 'in-progress';
        return 'pending';
    }

    /**
     * Agregar evento
     */
    addEvent(event) {
        this.events.push(event);
        this.saveEvents();
    }

    /**
     * Guardar eventos
     */
    saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(this.events));
    }
}

// Inicializar vista de calendario
if (typeof window !== 'undefined') {
    window.calendarView = new CalendarView();
}

