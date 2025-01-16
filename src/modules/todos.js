import { createTodoCard } from './create-dom-elements';
import { format, compareAsc, addDays, eachDayOfInterval } from 'date-fns';
import { projects, restoreProject } from './projects';

const LOCAL_STORAGE_TODO_KEY = 'todolist.todos';
const todos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TODO_KEY)) || [
    {
        type: 'General',
        checked: false,
        title: 'Welcome to my Todo App! 😃',
        date: '1000-01-01',
        isImportant: true,
        isTrash: false,
    },
    {
        type: '0',
        checked: false,
        title: 'Go to the store 🛒',
        date: format(new Date(), 'yyyy-MM-dd'),
        isImportant: false,
        isTrash: false,
    },
    {
        type: '0',
        checked: true,
        title: 'Take dogs for a walk 🐕',
        date: format(new Date(), 'yyyy-MM-dd'),
        isImportant: true,
        isTrash: false,
    },
    {
        type: '0',
        checked: false,
        title: 'Go to the gym 🏋️‍♀️',
        date: format(new Date(), 'yyyy-MM-dd'),
        isImportant: true,
        isTrash: false,
    },
    {
        type: '0',
        checked: false,
        title: 'Go to the cinema with friends 🎦',
        date: format(new Date(), 'yyyy-MM-dd'),
        isImportant: false,
        isTrash: true,
    },
    {
        type: '0',
        checked: false,
        title: 'Pick up birthday present for friend 🎁',
        date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
        isImportant: true,
        isTrash: false,
    },
    {
        type: '0',
        checked: false,
        title: 'Do some gardening 🏡',
        date: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
        isImportant: false,
        isTrash: false,
    },
];

const saveTodos = () => {
    localStorage.setItem(LOCAL_STORAGE_TODO_KEY, JSON.stringify(todos));
};

const todoFactory = (type, title, date, isImportant) => {
    const checked = false;
    const isTrash = false;
    return { type, checked, title, date, isImportant, isTrash };
};

const createTodo = (type, title, date, isImportant) => {
    const newTodo = todoFactory(type, title, date, isImportant);
    todos.push(newTodo);
    renderTodos();
};

const editTodo = (index, title, date, isImportant) => {
    const currentTodo = todos[index];
    currentTodo.title = title;
    currentTodo.date = date;
    currentTodo.isImportant = isImportant;
    renderTodos();
};

const updateStatus = (index, value) => {
    todos[index].checked = value;
    updateStatusTimeout.setup();
};

const updateStatusTimeout = {
    reset() {
        this.timeoutID = undefined;
    },

    setup() {
        if (typeof this.timeoutID === 'number') {
            this.cancel();
        }

        this.timeoutID = setTimeout(
            function () {
                renderTodos();
                this.reset();
            }.bind(this),
            2000
        );
    },

    cancel() {
        clearTimeout(this.timeoutID);
    },
};

const removeTodo = (todo) => {
    if (todo.isTrash) {
        todos.splice(todo.index, 1);
        renderTodos();
    } else {
        todos[todo.index].isTrash = true;
        renderTodos();
    }
};

const updateAllProjectTodos = (project) => {
    todos.forEach((todo) => {
        if (todo.type == project.iD) todo.isTrash = true;
    });
};

const removeAllProjectTodos = (project) => {
    let i = todos.length;
    while (i--) {
        const todo = todos[i];
        if (todo.type == project.iD) {
            todos.splice(todo.index, 1);
        }
    }
    renderTodos();
};

const restoreTodo = (todo) => {
    if (typeof parseInt(todo.type) === 'number') restoreProject(projects[parseInt(todo.type)]);
    todos[todo.index].isTrash = false;
    renderTodos();
};

const renderTodos = () => {
    const currentPage = document.querySelector('.main-container').getAttribute('data-id');
    const todoContainer = document.querySelector('.todo-container');
    const filteredTodos = filterTodos(currentPage);
    todoContainer.textContent = '';
    filteredTodos.forEach((todo) => createTodoCard(todo));
    saveTodos();
};

const filterTodos = (currentPage) => {
    const sortBtn = document.querySelector('.todo-sort');
    const filteredTodos = todos.filter((todo, index) => {
        todo.index = index;
        switch (currentPage) {
            case 'Today':
                return (
                    todo.date === format(new Date(), 'yyyy-MM-dd') && todo.isTrash === false && todo.checked === false
                );
            case 'Upcoming':
                const dates = getDates();
                return dates.includes(todo.date) && todo.isTrash === false && todo.checked === false;
            case 'Completed':
                return todo.checked === true && todo.isTrash === false;
            case 'Trash':
                return todo.isTrash === true;
            default:
                if (sortBtn && sortBtn.innerText === 'Important') {
                    return (
                        todo.type === currentPage &&
                        todo.isTrash === false &&
                        todo.isImportant === true &&
                        todo.checked === false
                    );
                }
                return todo.type === currentPage && todo.isTrash === false && todo.checked === false;
        }
    });

    filteredTodos.sort((a, b) => {
        return compareAsc(new Date(a.date), new Date(b.date));
    });
    return filteredTodos;
};

const getDates = () => {
    const dates = eachDayOfInterval({
        start: addDays(new Date(), 1),
        end: addDays(new Date(), 7),
    });

    dates.forEach((date, index) => dates.splice(index, 1, format(date, 'yyyy-MM-dd')));
    return dates;
};

export {
    todos,
    createTodo,
    removeTodo,
    updateAllProjectTodos,
    removeAllProjectTodos,
    restoreTodo,
    editTodo,
    updateStatus,
    renderTodos,
};
