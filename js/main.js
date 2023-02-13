const form = document.querySelector('#form');
const taskInput = form.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

// array consists of objects{name: ***, status: done/not}
let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', doneTask);



function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    tasks.push(newTask);

    renderTask(newTask);

    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();

    saveToLocalStorage();
}

function deleteTask(e) {
    if (e.target.dataset.action !== 'delete') return;



    const parentNode = e.target.closest('.list-group-item');

    const id = Number(parentNode.id);

    // ANOTHER WAY TO DELETE ELEMENT
    // const index = tasks.findIndex((task) => task.id === id); 
    // tasks.splice(index, 1);
    
    tasks = tasks.filter((task) => task.id !== id);
    
    parentNode.remove();

    checkEmptyList();

    saveToLocalStorage();
}

function doneTask(e) {
    if (e.target.dataset.action != 'done') return;

    const parentNode = e.target.closest('.list-group-item');

    const id = Number(parentNode.id);

    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');

    saveToLocalStorage();
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
        <li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
            <div class="empty-list__title">Список дел пуст</div>
        </li>`;
        taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
    } 

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const cssClass = task.done ? "task-title task-title--done" : 'task-title';

    const taskHTML = `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>`;
    
    taskList.insertAdjacentHTML('beforeend', taskHTML);
}