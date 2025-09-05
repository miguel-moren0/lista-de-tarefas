const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');
const taskCounter = document.getElementById('taskCounter');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    tasks.push({ text, completed: false });
    saveTasks();
    taskInput.value = '';
    renderTasks();
}

function removeTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function setFilter(newFilter) {
    filter = newFilter;
    filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (filteredTasks.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.id = 'emptyState';
        emptyState.innerHTML = `
            <p>Nenhuma tarefa encontrada.</p>
        `;
        taskList.appendChild(emptyState);
    } else {
        filteredTasks.forEach(task => {
            const index = tasks.indexOf(task);

            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'check';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleComplete(index));

            const taskText = document.createElement('span');
            taskText.textContent = (task.completed ? '✓ ' : '') + task.text;

            taskContent.appendChild(checkbox);
            taskContent.appendChild(taskText);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = '✕';
            removeBtn.addEventListener('click', () => removeTask(index));

            taskItem.appendChild(taskContent);
            taskItem.appendChild(removeBtn);

            taskList.appendChild(taskItem);
        });
    }

    // Calculando as tarefas pendentes e concluídas
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = tasks.filter(task => !task.completed).length;

    // Atualiza o contador com a quantidade de tarefas ativas e concluídas
    taskCounter.textContent = `Ativas: ${activeTasks} | Concluídas: ${completedTasks}`;
}

// Eventos
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
});
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

// Inicializa
setFilter(filter);
renderTasks();
