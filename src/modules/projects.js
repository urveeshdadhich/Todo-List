import { buildGeneral, buildProjectPage } from './build-pages';
import { createNavItem, createProjectCard } from './create-dom-elements';
import { removeAllProjectTodos, updateAllProjectTodos } from './todos';

const LOCAL_STORAGE_PROJECTS_KEY = 'todolist.projects';
const projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY)) || [
    {
        title: 'Demo Project',
        desc: 'This is a demo project with some filler content, feel free to remove it!',
        isTrash: false,
    },
];

const saveProjects = () => {
    localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
};

const projectFactory = (title, desc) => {
    const isTrash = false;
    return { title, desc, isTrash };
};

const createProject = (title, desc) => {
    const newProject = projectFactory(title, desc);
    projects.push(newProject);
    renderProjectNav();
    buildProjectPage(projects[projects.length - 1], projects[projects.length - 1].iD);
};

const editProject = (project, title, desc) => {
    const currentProject = projects[project.iD];
    currentProject.title = title;
    currentProject.desc = desc;
    renderProjectNav();
    buildProjectPage(project, project.iD);
};

const removeProject = (project, index) => {
    if (project.isTrash) {
        removeAllProjectTodos(project);
        projects.splice(index, 1);
        renderTrashProjects();
    } else {
        updateAllProjectTodos(project);
        project.isTrash = true;
        renderProjectNav();
        buildGeneral();
    }
};

const restoreProject = (project) => {
    project.isTrash = false;
    renderTrashProjects();
    renderProjectNav();
};

const renderProjectNav = () => {
    const projectNav = document.querySelector('#projects-list');
    projectNav.textContent = '';

    projects.forEach((project, index) => {
        project.iD = index;
        if (project.isTrash === false) {
            const navItem = createNavItem('header-nav-item', project.title);
            navItem.addEventListener('click', () => buildProjectPage(project, index));
            projectNav.append(navItem);
        }
    });
    saveProjects();
};

const renderTrashProjects = () => {
    const projectContainer = document.querySelector('.project-container');
    projectContainer.textContent = '';
    projects.forEach((project, index) => {
        if (project.isTrash) {
            createProjectCard(project, index);
        }
    });
    saveProjects();
};

export { projects, createProject, editProject, removeProject, restoreProject, renderProjectNav, renderTrashProjects };
