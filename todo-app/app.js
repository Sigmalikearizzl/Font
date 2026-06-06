// =====================================================
// TASK MASTER - TO-DO LIST APPLICATION
// =====================================================

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.currentSort = 'date';
        this.storageKey = 'taskmaster_todos';

        this.initializeElements();
        this.loadTodos();
        this.attachEventListeners();
        this.render();
    }

    // ==================== INITIALIZATION ====================

    initializeElements() {
        // Form elements
        this.todoForm = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.charCount = document.getElementById('charCount');

        // Filter buttons
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        // Sort buttons
        this.sortByDate = document.getElementById('sortByDate');
        this.sortByName = document.getElementById('sortByName');
        this.sortByPriority = document.getElementById('sortByPriority');

        // Display elements
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.completedState = document.getElementById('completedState');

        // Statistics
        this.statTotal = document.getElementById('statTotal');
        this.statCompleted = document.getElementById('statCompleted');
        this.statProgress = document.getElementById('statProgress');
        this.progressBar = document.getElementById('progressBar');

        // Badges
        this.badgeAll = document.getElementById('badgeAll');
        this.badgeActive = document.getElementById('badgeActive');
        this.badgeCompleted = document.getElementById('badgeCompleted');

        // Action buttons
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.exportTodosBtn = document.getElementById('exportTodos');
        this.importTodosBtn = document.getElementById('importTodos');
        this.importFile = document.getElementById('importFile');
        this.resetAllBtn = document.getElementById('resetAll');
    }

    attachEventListeners() {
        // Form submission
        this.todoForm.addEventListener('submit', (e) => this.addTodo(e));

        // Character counter
        this.todoInput.addEventListener('input', () => this.updateCharCount());

        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.closest('.filter-btn')));
        });

        // Sort buttons
        this.sortByDate.addEventListener('click', () => this.setSort('date'));
        this.sortByName.addEventListener('click', () => this.setSort('name'));
        this.sortByPriority.addEventListener('click', () => this.setSort('priority'));

        // Action buttons
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.exportTodosBtn.addEventListener('click', () => this.exportTodos());
        this.importTodosBtn.addEventListener('click', () => this.importFile.click());
        this.importFile.addEventListener('change', (e) => this.handleImportFile(e));
        this.resetAllBtn.addEventListener('click', () => this.resetAll());
    }

    // ==================== TODO MANAGEMENT ====================

    addTodo(event) {
        event.preventDefault();

        const text = this.todoInput.value.trim();

        if (text.length === 0) {
            alert('Please enter a task!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: 'medium',
            createdAt: new Date().toISOString(),
            dueDate: null
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.todoInput.value = '';
        this.charCount.textContent = '0';
        this.render();
    }

    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveTodos();
            this.render();
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    updateTodoPriority(id, priority) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.priority = priority;
            this.saveTodos();
            this.render();
        }
    }

    clearCompleted() {
        const completedCount = this.todos.filter(todo => todo.completed).length;

        if (completedCount === 0) {
            alert('No completed tasks to clear!');
            return;
        }

        if (confirm(`Delete ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveTodos();
            this.render();
        }
    }

    resetAll() {
        if (confirm('Are you sure? This will delete ALL tasks. This cannot be undone!')) {
            if (confirm('Really reset everything?')) {
                this.todos = [];
                this.saveTodos();
                this.render();
            }
        }
    }

    // ==================== FILTERING & SORTING ====================

    setFilter(filterBtn) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');
        this.currentFilter = filterBtn.dataset.filter;
        this.render();
    }

    setSort(sortType) {
        this.currentSort = sortType;
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            case 'all':
            default:
                return this.todos;
        }
    }

    getSortedTodos(todos) {
        const sorted = [...todos];

        switch (this.currentSort) {
            case 'name':
                sorted.sort((a, b) => a.text.localeCompare(b.text));
                break;
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'date':
            default:
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        return sorted;
    }

    // ==================== RENDERING ====================

    render() {
        this.updateStatistics();
        this.updateBadges();
        this.renderTodos();
    }

    renderTodos() {
        const filteredTodos = this.getFilteredTodos();
        const sortedTodos = this.getSortedTodos(filteredTodos);

        this.todoList.innerHTML = '';

        if (this.todos.length === 0) {
            this.emptyState.style.display = 'block';
            this.completedState.style.display = 'none';
        } else if (filteredTodos.length === 0 && this.currentFilter === 'active') {
            this.emptyState.style.display = 'none';
            this.completedState.style.display = 'block';
        } else {
            this.emptyState.style.display = 'none';
            this.completedState.style.display = 'none';
        }

        sortedTodos.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            this.todoList.appendChild(todoElement);
        });
    }

    createTodoElement(todo) {
        const div = document.createElement('div');
        div.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        const createdDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        div.innerHTML = `
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="app.toggleTodo(${todo.id})"
            >
            <div class="todo-content">
                <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                <div class="todo-meta">
                    <span class="todo-date">📅 ${createdDate}</span>
                    <span class="todo-priority">
                        <span class="priority-tag priority-${todo.priority}">
                            ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                        </span>
                    </span>
                </div>
            </div>
            <div class="todo-actions">
                <button class="btn-edit" onclick="app.showPriorityMenu(${todo.id})" title="Change priority">
                    ⚡
                </button>
                <button class="btn-delete" onclick="app.deleteTodo(${todo.id})" title="Delete task">
                    🗑️
                </button>
            </div>
        `;

        return div;
    }

    showPriorityMenu(id) {
        const priorities = ['high', 'medium', 'low'];
        const todo = this.todos.find(t => t.id === id);

        if (!todo) return;

        const menu = prompt(
            `Change priority for: ${todo.text}\n\nCurrent: ${todo.priority}\n\nEnter: high, medium, or low`,
            todo.priority
        );

        if (menu && priorities.includes(menu.toLowerCase())) {
            this.updateTodoPriority(id, menu.toLowerCase());
        } else if (menu) {
            alert('Invalid priority. Please enter: high, medium, or low');
        }
    }

    // ==================== STATISTICS ====================

    updateStatistics() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

        this.statTotal.textContent = total;
        this.statCompleted.textContent = completed;
        this.statProgress.textContent = `${progress}%`;
        this.progressBar.style.width = `${progress}%`;
    }

    updateBadges() {
        const active = this.todos.filter(todo => !todo.completed).length;
        const completed = this.todos.filter(todo => todo.completed).length;

        this.badgeAll.textContent = this.todos.length;
        this.badgeActive.textContent = active;
        this.badgeCompleted.textContent = completed;
    }

    // ==================== STORAGE ====================

    saveTodos() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving todos to localStorage:', error);
            alert('Error saving tasks. Please check your storage.');
        }
    }

    loadTodos() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.todos = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading todos from localStorage:', error);
            this.todos = [];
        }
    }

    // ==================== IMPORT/EXPORT ====================

    exportTodos() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = `taskmaster-tasks-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert('Tasks exported successfully!');
    }

    handleImportFile(event) {
        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);

                if (!Array.isArray(imported)) {
                    throw new Error('Invalid file format');
                }

                if (confirm(`Import ${imported.length} task(s)? Existing tasks will be preserved.`)) {
                    this.todos = [...imported, ...this.todos];
                    this.saveTodos();
                    this.render();
                    alert('Tasks imported successfully!');
                }
            } catch (error) {
                alert('Error importing file: Invalid JSON format');
                console.error('Import error:', error);
            }
        };

        reader.readAsText(file);
        this.importFile.value = '';
    }

    // ==================== UTILITIES ====================

    updateCharCount() {
        this.charCount.textContent = this.todoInput.value.length;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ==================== APPLICATION START ====================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
});

// Auto-save to localStorage periodically
setInterval(() => {
    if (app) {
        app.saveTodos();
    }
}, 30000); // Every 30 seconds
