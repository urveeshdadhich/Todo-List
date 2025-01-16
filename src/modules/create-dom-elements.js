import { format, isPast, add, addDays } from 'date-fns';
import { openEditModal } from './modal';
import { projects, removeProject, restoreProject } from './projects';
import { removeTodo, restoreTodo, updateStatus } from './todos';

const createDiv = (className) => {
    const div = document.createElement('div');
    div.classList.add(className);
    return div;
};

const createH1 = (className) => {
    const h1 = document.createElement('h1');
    h1.classList.add(className);
    return h1;
};

const createH2 = (className) => {
    const h2 = document.createElement('h2');
    h2.classList.add(className);
    return h2;
};

const createH3 = (className) => {
    const h3 = document.createElement('h3');
    h3.classList.add(className);
    return h3;
};

const createPara = (className) => {
    const para = document.createElement('p');
    para.classList.add(className);
    return para;
};

const createBtn = (className) => {
    const btn = document.createElement('button');
    btn.classList.add(className);
    return btn;
};

const createCheckbox = (className) => {
    const checkbox = document.createElement('input');
    checkbox.classList.add(className);
    checkbox.setAttribute('type', 'checkbox');
    return checkbox;
};

const createNavItem = (className, projectName) => {
    const li = document.createElement('li');
    const liLink = document.createElement('a');

    li.classList.add(className);
    liLink.classList.add(`${className}-link`);
    liLink.setAttribute('href', 'javascript:void(0);');
    liLink.append(createSvg('arrow'), projectName);

    li.append(liLink);

    return li;
};

const createTodoCard = (todo) => {
    const currentPage = document.querySelector('.main-container').getAttribute('data-id');
    const todoContainer = document.querySelector('.todo-container');
    const container = createDiv('todo-card');
    const checkbox = createCheckbox('todo-card-input');
    const title = createPara('todo-card-title');
    const date = createPara('todo-card-date');
    const editBtn = createBtn('todo-card-edit');
    const deleteBtn = createBtn('todo-card-delete');
    const btnContainer = createDiv('todo-btn-container');

    checkbox.checked = todo.checked;
    checkbox.addEventListener('click', () => updateStatus(todo.index, checkbox.checked));
    title.innerText = todo.title;
    date.innerText = format(new Date(todo.date), 'dd/MM/y');

    editBtn.append(createSvg('edit'));
    editBtn.addEventListener('click', () => openEditModal(todo));
    deleteBtn.append(createSvg('delete'));
    deleteBtn.addEventListener('click', () => removeTodo(todo));
    btnContainer.append(editBtn, deleteBtn);

    if (isPast(addDays(new Date(todo.date), 1))) {
        date.innerText = 'Expired';
        date.classList.add('is-expired');
    }

    if (todo.isImportant) {
        const important = createPara('todo-card-important');
        important.innerText = 'Important';
        container.append(important);
    }

    if (todo.isTrash) {
        const restoreBtn = createBtn('todo-card-restore');
        restoreBtn.append(createSvg('restore'));
        restoreBtn.addEventListener('click', () => restoreTodo(todo));
        btnContainer.insertBefore(restoreBtn, btnContainer.lastChild);
    }

    if (
        currentPage === 'Today' ||
        currentPage === 'Upcoming' ||
        currentPage === 'Completed' ||
        currentPage === 'Trash'
    ) {
        const type = createPara('todo-card-type');
        if (isNaN(todo.type)) {
            type.innerText = todo.type;
            type.setAttribute('title', todo.type);
        } else {
            type.innerText = projects[parseInt(todo.type)].title;
            type.setAttribute('title', projects[parseInt(todo.type)].title);
        }
        container.append(type);
    }

    container.append(checkbox, title, date, btnContainer);

    todoContainer.append(container);
};

const createProjectCard = (project, index) => {
    const projectContainer = document.querySelector('.project-container');
    const container = createDiv('project-card');
    const title = createPara('project-card-title');
    const deleteBtn = createBtn('project-card-delete');
    const restoreBtn = createBtn('project-card-restore');
    const btnContainer = createDiv('project-btn-container');

    title.innerText = project.title;

    deleteBtn.append(createSvg('delete'));
    deleteBtn.addEventListener('click', () => removeProject(project, index));
    restoreBtn.append(createSvg('restore'));
    restoreBtn.addEventListener('click', () => restoreProject(project));
    btnContainer.append(restoreBtn, deleteBtn);

    container.append(title, btnContainer);

    projectContainer.append(container);
};

const createLegend = (className) => {
    const legend = document.createElement('legend');
    legend.classList.add(className);
    return legend;
};

const createLabel = (className) => {
    const label = document.createElement('label');
    label.classList.add(`${className}-label`);
    label.setAttribute('for', `${className}-input`);
    return label;
};

const createInput = (className, inputType) => {
    const input = document.createElement('input');
    input.classList.add(`${className}-input`);
    input.setAttribute('type', inputType);
    input.setAttribute('id', `${className}-input`);
    input.setAttribute('name', `${className}-input`);
    return input;
};

const createTextArea = (className) => {
    const textArea = document.createElement('textarea');
    textArea.classList.add(`${className}-input`);
    textArea.setAttribute('id', `${className}-input`);
    textArea.setAttribute('name', `${className}-input`);
    return textArea;
};

const createTodoModalElements = (title) => {
    const formFieldset = document.querySelector('.modal-form-fieldset');
    const legend = createLegend('modal-form-legend');
    const labelName = createLabel('modal-form-title');
    const inputName = createInput('modal-form-title', 'text');
    const labelDate = createLabel('modal-form-date');
    const inputDate = createInput('modal-form-date', 'date');
    const labelPrio = createLabel('modal-form-prio');
    const inputPrio = createInput('modal-form-prio', 'checkbox');

    legend.innerText = title;
    labelName.innerText = 'Name';
    labelDate.innerText = 'Date';
    labelPrio.innerText = 'Important?';

    inputName.setAttribute('required', '');
    inputName.setAttribute('maxlength', '150');
    inputDate.setAttribute('required', '');

    labelPrio.append(inputPrio);

    formFieldset.textContent = '';
    formFieldset.append(legend, labelName, inputName, labelDate, inputDate, labelPrio);
};

const createProjectModalElements = (title) => {
    const formFieldset = document.querySelector('.modal-form-fieldset');
    const legend = createLegend('modal-form-legend');
    const labelName = createLabel('modal-form-title');
    const inputName = createInput('modal-form-title', 'text');
    const labelDesc = createLabel('modal-form-desc');
    const inputDesc = createTextArea('modal-form-desc');

    legend.innerText = title;
    labelName.innerText = 'Project Name';
    labelDesc.innerText = 'Project Description';

    inputName.setAttribute('required', '');
    inputName.setAttribute('maxlength', '50');
    inputDesc.setAttribute('maxlength', '250');

    formFieldset.textContent = '';
    formFieldset.append(legend, labelName, inputName, labelDesc, inputDesc);
};

const createSvg = (type) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    svg.setAttribute('width', '24px');
    svg.setAttribute('height', '24px');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('viewBox', '0 0 24 24');

    path.setAttribute('fill', 'currentColor');

    switch (type) {
        case 'delete':
            path.setAttribute(
                'd',
                'M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6q-.425 0-.713-.287Q4 5.425 4 5t.287-.713Q4.575 4 5 4h4q0-.425.288-.713Q9.575 3 10 3h4q.425 0 .713.287Q15 3.575 15 4h4q.425 0 .712.287Q20 4.575 20 5t-.288.713Q19.425 6 19 6v13q0 .825-.587 1.413Q17.825 21 17 21ZM7 6v13h10V6Zm2 10q0 .425.288.712Q9.575 17 10 17t.713-.288Q11 16.425 11 16V9q0-.425-.287-.713Q10.425 8 10 8t-.712.287Q9 8.575 9 9Zm4 0q0 .425.288.712q.287.288.712.288t.713-.288Q15 16.425 15 16V9q0-.425-.287-.713Q14.425 8 14 8t-.712.287Q13 8.575 13 9ZM7 6v13V6Z'
            );
            break;
        case 'plus':
            path.setAttribute(
                'd',
                'M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z'
            );
            break;
        case 'edit':
            path.setAttribute(
                'd',
                'M6 22q-.825 0-1.412-.587Q4 20.825 4 20V4q0-.825.588-1.413Q5.175 2 6 2h7.175q.4 0 .763.15q.362.15.637.425l4.85 4.85q.275.275.425.637q.15.363.15.763V12h-2V9h-4q-.425 0-.712-.288Q13 8.425 13 8V4H6v16h6v2Zm0-2V4v16Zm12.3-5.475l1.075 1.075l-3.875 3.85v1.05h1.05l3.875-3.85l1.05 1.05l-4 4q-.15.15-.338.225q-.187.075-.387.075H14.5q-.2 0-.35-.15q-.15-.15-.15-.35v-2.25q0-.2.075-.387q.075-.188.225-.338Zm3.175 3.175L18.3 14.525l1.45-1.45q.275-.275.7-.275q.425 0 .7.275l1.775 1.775q.275.275.275.7q0 .425-.275.7Z'
            );
            break;
        case 'restore':
            path.setAttribute(
                'd',
                'M18 22H6q-.825 0-1.412-.587Q4 20.825 4 20V4q0-.825.588-1.413Q5.175 2 6 2h7.175q.4 0 .763.15q.362.15.637.425l4.85 4.85q.275.275.425.637q.15.363.15.763V20q0 .825-.587 1.413Q18.825 22 18 22Zm0-2V8.85L13.15 4H6v16Zm-6-2.25q1.95 0 3.35-1.4q1.4-1.4 1.4-3.35q0-1.95-1.4-3.35q-1.4-1.4-3.35-1.4q-.95 0-1.775.35t-1.475.95v-.8q0-.325-.212-.538Q8.325 8 8 8q-.325 0-.537.212q-.213.213-.213.538v2.5q0 .425.287.712q.288.288.713.288h2.5q.325 0 .538-.213q.212-.212.212-.537q0-.325-.212-.538q-.213-.212-.538-.212H9.7q.425-.45 1.025-.725q.6-.275 1.275-.275q1.35 0 2.3.95q.95.95.95 2.3q0 1.35-.95 2.3q-.95.95-2.3.95q-.975 0-1.738-.512q-.762-.513-1.187-1.338q-.075-.175-.25-.287Q8.65 14 8.45 14q-.475 0-.712.325q-.238.325-.038.725q.575 1.2 1.725 1.95q1.15.75 2.575.75ZM6 20V4v16Z'
            );
            break;
        case 'arrow':
            path.setAttribute(
                'd',
                'M11.7 15.3q-.475.475-1.087.212Q10 15.25 10 14.575v-5.15q0-.675.613-.937q.612-.263 1.087.212l2.6 2.6q.15.15.225.325q.075.175.075.375t-.075.375q-.075.175-.225.325Z'
            );
            break;
    }

    svg.append(path);

    return svg;
};

export {
    createDiv,
    createH1,
    createH2,
    createH3,
    createPara,
    createBtn,
    createInput,
    createTodoCard,
    createProjectCard,
    createTodoModalElements,
    createProjectModalElements,
    createNavItem,
    createSvg,
};
