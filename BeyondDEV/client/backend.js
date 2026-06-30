/* ==========================================================================
   BeyondDev Backend Dashboard - Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
    // --- 1. Security check ---
    if (window.AuthAPI && !window.AuthAPI.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // --- 2. DOM Elements ---
    const sidebar = document.getElementById('dashboard-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const viewTitle = document.getElementById('view-title');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const dashboardViews = document.querySelectorAll('.dashboard-view');
    
    // User Profile displays
    const userInitials = document.getElementById('user-initials');
    const userDisplayName = document.getElementById('user-display-name');
    const btnLogoutSidebar = document.getElementById('btn-logout-sidebar');
    
    // Toast Container
    const toastContainer = document.getElementById('toast-container');

    // Global Search
    const globalSearchInput = document.getElementById('global-search');

    // Overview Stats
    const statTotalProj = document.getElementById('stat-total-projects');
    const statActiveProj = document.getElementById('stat-active-projects');
    const statCompletedProj = document.getElementById('stat-completed-projects');
    const statTotalBudget = document.getElementById('stat-total-budget');
    const criticalProjectsContainer = document.getElementById('critical-projects-list');

    // Projects Section
    const projectsContainer = document.getElementById('projects-list-container');
    const filterStatus = document.getElementById('filter-status');
    const filterType = document.getElementById('filter-type');
    const btnResetFilters = document.getElementById('btn-reset-filters');
    const btnOpenCreateModal = document.getElementById('btn-open-create-modal');

    // Modals
    const projectModal = document.getElementById('project-modal');
    const projectForm = document.getElementById('project-form');
    const btnCloseProjectModal = document.getElementById('btn-close-project-modal');
    const btnCancelProjectModal = document.getElementById('btn-cancel-project-modal');
    const modalProjectTitle = document.getElementById('modal-project-title');
    
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const deleteProjectName = document.getElementById('delete-project-name');
    const btnCancelDelete = document.getElementById('btn-cancel-delete');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');

    // Kanban Task board columns
    const columns = {
        todo: document.getElementById('column-todo-wrapper'),
        doing: document.getElementById('column-doing-wrapper'),
        testing: document.getElementById('column-testing-wrapper'),
        done: document.getElementById('column-done-wrapper')
    };
    const badges = {
        todo: document.getElementById('count-todo'),
        doing: document.getElementById('count-doing'),
        testing: document.getElementById('count-testing'),
        done: document.getElementById('count-done')
    };

    // State Variables
    let projects = [];
    let tasks = [];
    let currentDeleteProjId = null;

    // --- 3. User Interface Setup ---
    function setupUserPanel() {
        const currentUser = window.AuthAPI.getCurrentUser();
        if (currentUser) {
            userDisplayName.textContent = currentUser.name;
            // Get initials
            const names = currentUser.name.split(' ');
            const initials = names.map(n => n[0]).slice(0, 2).join('').toUpperCase();
            userInitials.textContent = initials;
        }
    }
    setupUserPanel();

    btnLogoutSidebar.addEventListener('click', () => {
        window.AuthAPI.logout();
    });

    // --- 4. Sidebar Responsive Menu & Drawer Switches ---
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });

    // View Switching Logic
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetView = link.getAttribute('data-view');
            
            // Remove active classes
            sidebarLinks.forEach(l => l.classList.remove('active'));
            dashboardViews.forEach(v => v.classList.remove('active'));
            
            // Add active classes
            link.classList.add('active');
            document.getElementById(`view-${targetView}`).classList.add('active');
            
            // Update Title
            const titles = {
                overview: 'Resumen del Sistema',
                projects: 'Panel de Proyectos',
                tasks: 'Tablero de Tareas Sprint',
                team: 'Disponibilidad del Equipo'
            };
            viewTitle.textContent = titles[targetView];

            // Close Mobile sidebar
            sidebar.classList.remove('open');

            // Hook for view reload
            if (targetView === 'overview') updateOverviewCounters();
            if (targetView === 'projects') renderProjects();
            if (targetView === 'tasks') renderKanbanBoard();
        });
    });

    // --- 5. Data Load Operations (now uses REST API) ---
    async function loadData() {
        try {
            projects = await window.AuthAPI.getProjects();
            tasks = await window.AuthAPI.getTasks();
        } catch (err) {
            console.error('Error loading data from API:', err);
            projects = [];
            tasks = [];
        }
    }

    async function saveProject(projectData, id = null) {
        if (id) {
            await window.AuthAPI.updateProject(id, projectData);
        } else {
            await window.AuthAPI.createProject(projectData);
        }
        // Refresh local arrays
        await loadData();
        updateOverviewCounters();
    }

    async function removeProject(id) {
        await window.AuthAPI.deleteProject(id);
        await loadData();
        updateOverviewCounters();
    }

    async function saveTask(taskData, id = null) {
        if (id) {
            await window.AuthAPI.updateTask(id, taskData);
        } else {
            await window.AuthAPI.createTask(taskData);
        }
        await loadData();
    }

    async function removeTask(id) {
        await window.AuthAPI.deleteTask(id);
        await loadData();
    }

    // Initial load
    await loadData();

    // --- 6. Overview Counters and Calculations ---
    function updateOverviewCounters() {
        
        statTotalProj.textContent = projects.length;
        
        const activeCount = projects.filter(p => p.status === 'desarrollo' || p.status === 'pruebas').length;
        statActiveProj.textContent = activeCount;

        const completedCount = projects.filter(p => p.status === 'completado').length;
        statCompletedProj.textContent = completedCount;

        // Total Budget sum
        let budgetSum = 0;
        projects.forEach(p => {
            const num = parseFloat(p.budget.replace(/,/g, ''));
            if (!isNaN(num)) budgetSum += num;
        });
        statTotalBudget.textContent = '$' + budgetSum.toLocaleString('en-US');

        // Render critical high priority alerts
        criticalProjectsContainer.innerHTML = '';
        const critical = projects.filter(p => p.priority === 'alta' && p.status !== 'completado');

        if (critical.length === 0) {
            criticalProjectsContainer.innerHTML = `
                <div class="empty-inbox" style="padding: 1rem 0;">
                    <p style="font-size: 0.8rem;"><i class="fa-solid fa-circle-check" style="color: var(--success-green); margin-right: 5px;"></i> Todos los proyectos prioritarios están en orden.</p>
                </div>
            `;
        } else {
            critical.forEach(p => {
                const item = document.createElement('div');
                item.className = p.status === 'pruebas' ? 'health-item warning' : 'health-item';
                
                let badgeClass = 'danger';
                let statusText = 'En Desarrollo';
                if (p.status === 'pruebas') {
                    badgeClass = 'warning';
                    statusText = 'En Pruebas (QA)';
                } else if (p.status === 'idea') {
                    statusText = 'En Idea / Planificación';
                }

                item.innerHTML = `
                    <div class="health-info">
                        <span class="health-name">${p.name}</span>
                        <span class="health-client">Cliente: ${p.client} | Progreso: ${p.progress}%</span>
                    </div>
                    <span class="health-badge ${badgeClass}">${statusText}</span>
                `;
                criticalProjectsContainer.appendChild(item);
            });
        }
    }
    updateOverviewCounters();

    // --- 7. Project CRUD Controller ---

    async function renderProjects() {
        await loadData();
        projectsContainer.innerHTML = '';
        
        const selectedStatus = filterStatus.value;
        const selectedType = filterType.value;
        const searchVal = globalSearchInput.value.toLowerCase().trim();

        const filtered = projects.filter(p => {
            const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
            const matchesType = selectedType === 'all' || p.type === selectedType;
            
            const matchesSearch = searchVal === '' || 
                p.name.toLowerCase().includes(searchVal) ||
                p.client.toLowerCase().includes(searchVal) ||
                p.desc.toLowerCase().includes(searchVal) ||
                p.developer.toLowerCase().includes(searchVal);

            return matchesStatus && matchesType && matchesSearch;
        });

        if (filtered.length === 0) {
            projectsContainer.innerHTML = `
                <div class="no-projects-fallback glass-card">
                    <i class="fa-regular fa-folder-open"></i>
                    <h3>Ningún proyecto coincide</h3>
                    <p>Modifica los criterios de búsqueda o registra un nuevo proyecto.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'project-card-kpi glass-card';
            card.setAttribute('data-id', p.id);

            // Icon for project type
            let typeIcon = 'fa-globe';
            if (p.type === 'mobile') typeIcon = 'fa-mobile-screen-button';
            if (p.type === 'system') typeIcon = 'fa-gears';

            // Initials for Lead dev avatar
            const leadInitials = p.developer.split(' ').map(n => n[0]).join('').toUpperCase();

            card.innerHTML = `
                <div class="project-card-header">
                    <div>
                        <div class="project-card-title"><i class="fa-solid ${typeIcon} highlight-gold" style="margin-right: 8px;"></i> ${p.name}</div>
                        <div class="project-card-client">Cliente: <strong>${p.client}</strong></div>
                    </div>
                    <div class="project-badges">
                        <span class="project-badge-tag priority-${p.priority}">${p.priority}</span>
                        <span class="project-badge-tag status-${p.status}">${p.status}</span>
                    </div>
                </div>
                <div class="project-card-body">
                    <p>${p.desc}</p>
                    <div class="project-details-grid">
                        <div class="detail-kpi-item">
                            <span class="detail-kpi-label">Presupuesto</span>
                            <span class="detail-kpi-val"><i class="fa-solid fa-dollar-sign"></i> ${p.budget} USD</span>
                        </div>
                        <div class="detail-kpi-item">
                            <span class="detail-kpi-label">Horas Dev</span>
                            <span class="detail-kpi-val"><i class="fa-regular fa-clock"></i> ${p.hours || '0'} hrs</span>
                        </div>
                        <div class="detail-kpi-item">
                            <span class="detail-kpi-label">Fecha Inicio</span>
                            <span class="detail-kpi-val">${p.startDate || 'N/A'}</span>
                        </div>
                        <div class="detail-kpi-item">
                            <span class="detail-kpi-label">Fecha Entrega</span>
                            <span class="detail-kpi-val">${p.endDate || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div class="project-progress-area">
                        <div class="progress-labels">
                            <span>Progreso del Proyecto</span>
                            <span>${p.progress}%</span>
                        </div>
                        <div class="progress-track">
                            <div class="progress-fill" style="width: ${p.progress}%;"></div>
                        </div>
                    </div>
                </div>
                
                <div class="project-card-footer">
                    <div class="developer-assignment">
                        <div class="lead-avatar-icon" title="Líder Técnico: ${p.developer}">${leadInitials}</div>
                        <span class="lead-name">Lead: ${p.developer}</span>
                    </div>
                    <div class="project-card-actions">
                        <button class="action-btn-circle edit" onclick="openEditProjectModal('${p.id}')" title="Editar detalles"><i class="fa-solid fa-pencil"></i></button>
                        <button class="action-btn-circle delete" onclick="triggerDeleteProject('${p.id}', '${p.name.replace(/'/g, "\\'")}')" title="Eliminar proyecto"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `;
            projectsContainer.appendChild(card);
        });
    }

    // Make functions globally accessible (since template literals reference them dynamically)
    window.openEditProjectModal = (id) => {
        loadData();
        const p = projects.find(proj => proj.id === id);
        if (!p) return;

        // Prefill modal form fields
        document.getElementById('project-id-field').value = p.id;
        document.getElementById('project-name-input').value = p.name;
        document.getElementById('project-client-input').value = p.client;
        document.getElementById('project-type-select').value = p.type;
        document.getElementById('project-priority-select').value = p.priority;
        document.getElementById('project-budget-input').value = p.budget;
        document.getElementById('project-progress-input').value = p.progress;
        document.getElementById('project-start-input').value = p.startDate || '';
        document.getElementById('project-end-input').value = p.endDate || '';
        document.getElementById('project-developer-select').value = p.developer;
        document.getElementById('project-status-select').value = p.status;
        document.getElementById('project-desc-input').value = p.desc;

        modalProjectTitle.textContent = 'Editar Detalles del Proyecto';
        projectModal.classList.add('open');
    };

    window.triggerDeleteProject = (id, name) => {
        currentDeleteProjId = id;
        deleteProjectName.textContent = name;
        deleteConfirmModal.classList.add('open');
    };

    // Filters Listeners
    filterStatus.addEventListener('change', renderProjects);
    filterType.addEventListener('change', renderProjects);
    btnResetFilters.addEventListener('click', () => {
        filterStatus.value = 'all';
        filterType.value = 'all';
        globalSearchInput.value = '';
        renderProjects();
        showToast('Filtros restaurados', 'info');
    });

    // Modal Actions
    btnOpenCreateModal.addEventListener('click', () => {
        projectForm.reset();
        document.getElementById('project-id-field').value = '';
        modalProjectTitle.textContent = 'Registrar Nuevo Proyecto';
        projectModal.classList.add('open');
    });

    function closeProjModal() {
        projectModal.classList.remove('open');
        // Reset validation classes
        projectForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('invalid'));
    }

    btnCloseProjectModal.addEventListener('click', closeProjModal);
    btnCancelProjectModal.addEventListener('click', closeProjModal);

    // Form validation and submit
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('project-id-field').value;
        const name = document.getElementById('project-name-input').value.trim();
        const client = document.getElementById('project-client-input').value.trim();
        const type = document.getElementById('project-type-select').value;
        const priority = document.getElementById('project-priority-select').value;
        const budget = document.getElementById('project-budget-input').value.trim();
        const progress = document.getElementById('project-progress-input').value;
        const startDate = document.getElementById('project-start-input').value;
        const endDate = document.getElementById('project-end-input').value;
        const developer = document.getElementById('project-developer-select').value;
        const status = document.getElementById('project-status-select').value;
        const desc = document.getElementById('project-desc-input').value.trim();

        // Validations
        const groupName = document.getElementById('project-name-input').closest('.form-group');
        const groupClient = document.getElementById('project-client-input').closest('.form-group');
        const groupType = document.getElementById('project-type-select').closest('.form-group');
        const groupBudget = document.getElementById('project-budget-input').closest('.form-group');
        const groupProgress = document.getElementById('project-progress-input').closest('.form-group');
        const groupDesc = document.getElementById('project-desc-input').closest('.form-group');

        let isFormValid = true;
        
        if (name === '') isFormValid = !groupName.classList.add('invalid');
        else groupName.classList.remove('invalid');

        if (client === '') isFormValid = !groupClient.classList.add('invalid');
        else groupClient.classList.remove('invalid');

        if (type === '') isFormValid = !groupType.classList.add('invalid');
        else groupType.classList.remove('invalid');

        const budgetNum = parseFloat(budget.replace(/,/g, ''));
        if (budget === '' || isNaN(budgetNum)) isFormValid = !groupBudget.classList.add('invalid');
        else groupBudget.classList.remove('invalid');

        const progVal = parseInt(progress);
        if (progress === '' || isNaN(progVal) || progVal < 0 || progVal > 100) isFormValid = !groupProgress.classList.add('invalid');
        else groupProgress.classList.remove('invalid');

        if (desc === '') isFormValid = !groupDesc.classList.add('invalid');
        else groupDesc.classList.remove('invalid');

        if (isFormValid) {
            const formattedBudget = budgetNum.toLocaleString('en-US');
            const projectData = {
                name, client, type, priority, budget: formattedBudget,
                progress: progVal, startDate, endDate, developer, status, desc,
                hours: id ? undefined : '0'
            };

            if (id) {
                await saveProject(projectData, id);
                showToast('Proyecto actualizado correctamente', 'success');
            } else {
                await saveProject(projectData);
                showToast('Proyecto registrado y asignado', 'success');
            }

            closeProjModal();
            await renderProjects();
        }
    });

    // Delete Operations
    btnCancelDelete.addEventListener('click', () => {
        deleteConfirmModal.classList.remove('open');
        currentDeleteProjId = null;
    });

    btnConfirmDelete.addEventListener('click', async () => {
        if (currentDeleteProjId) {
            await loadData();
            
            // Get project name for feedback
            const p = projects.find(proj => proj.id === currentDeleteProjId);
            const pName = p ? p.name : '';

            // Delete associated tasks first
            const associatedTasks = tasks.filter(t => t.project === pName);
            for (const t of associatedTasks) {
                await window.AuthAPI.deleteTask(t.id);
            }

            // Delete project
            await removeProject(currentDeleteProjId);

            deleteConfirmModal.classList.remove('open');
            currentDeleteProjId = null;
            showToast('Proyecto eliminado del sistema', 'error');
            
            await renderProjects();
        }
    });

    // Global Search trigger
    globalSearchInput.addEventListener('input', async () => {
        const projectsLink = document.querySelector('.sidebar-link[data-view="projects"]');
        if (!projectsLink.classList.contains('active')) {
            projectsLink.click();
        }
        await renderProjects();
    });

    // --- 8. Kanban Task Board Controller ---

    async function populateKanbanProjectsDropdown() {
        await loadData();
        document.querySelectorAll('.project-selector').forEach(select => {
            select.innerHTML = '<option value="" disabled selected>Elegir Proyecto</option>';
            projects.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.name;
                opt.textContent = p.name;
                select.appendChild(opt);
            });
        });
    }

    async function renderKanbanBoard() {
        await loadData();
        populateKanbanProjectsDropdown();

        // Clear columns
        columns.todo.innerHTML = '';
        columns.doing.innerHTML = '';
        columns.testing.innerHTML = '';
        columns.done.innerHTML = '';

        // Tally categories
        const tally = { todo: 0, doing: 0, testing: 0, done: 0 };

        tasks.forEach(t => {
            if (!columns[t.status]) return;
            
            tally[t.status]++;

            const card = document.createElement('div');
            card.className = 'kanban-card';
            card.setAttribute('data-id', t.id);

            // Shift buttons display rules
            const showLeft = t.status !== 'todo';
            const showRight = t.status !== 'done';

            card.innerHTML = `
                <div class="kanban-card-text">${t.text}</div>
                <div class="kanban-card-footer">
                    <span class="kanban-card-project-tag" title="Proyecto: ${t.project}">${t.project}</span>
                    <div class="kanban-card-nav">
                        ${showLeft ? `<button class="kanban-nav-btn" onclick="moveTask('${t.id}', 'left')" title="Mover izquierda"><i class="fa-solid fa-chevron-left"></i></button>` : ''}
                        ${showRight ? `<button class="kanban-nav-btn" onclick="moveTask('${t.id}', 'right')" title="Mover derecha"><i class="fa-solid fa-chevron-right"></i></button>` : ''}
                        <button class="kanban-nav-btn delete-btn" onclick="deleteTask('${t.id}')" title="Eliminar tarea"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `;
            columns[t.status].appendChild(card);
        });

        // Update counts
        badges.todo.textContent = tally.todo;
        badges.doing.textContent = tally.doing;
        badges.testing.textContent = tally.testing;
        badges.done.textContent = tally.done;
    }

    // Task shifting controllers
    window.moveTask = async (id, direction) => {
        await loadData();
        const t = tasks.find(tsk => tsk.id === id);
        if (!t) return;

        const statusFlow = ['todo', 'doing', 'testing', 'done'];
        const currentIdx = statusFlow.indexOf(t.status);
        
        let newIdx = currentIdx;
        if (direction === 'left' && currentIdx > 0) newIdx = currentIdx - 1;
        if (direction === 'right' && currentIdx < 3) newIdx = currentIdx + 1;

        await window.AuthAPI.updateTask(id, { status: statusFlow[newIdx] });
        await loadData();
        renderKanbanBoard();
    };

    // Task Deletion
    window.deleteTask = async (id) => {
        await removeTask(id);
        await renderKanbanBoard();
        showToast('Tarea eliminada', 'info');
    };

    document.querySelectorAll('.quick-task-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const status = form.getAttribute('data-target');
            const input = form.querySelector('input');
            const select = form.querySelector('.project-selector');

            const text = input.value.trim();
            const project = select.value;

            if (text !== '' && project !== '') {
                const newTask = { text, status, project };
                await saveTask(newTask);
                
                input.value = '';
                select.value = '';
                
                await renderKanbanBoard();
                showToast('Tarea agregada', 'success');
            } else {
                showToast('Ingresa la tarea y selecciona el proyecto', 'error');
            }
        });
    });

    // --- 9. Toast Notification Helper ---
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-item ${type}`;
        
        let icon = 'fa-circle-info';
        if (type === 'success') icon = 'fa-circle-check';
        if (type === 'error') icon = 'fa-triangle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span class="toast-msg">${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Slide in
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Slide out & remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }
});
