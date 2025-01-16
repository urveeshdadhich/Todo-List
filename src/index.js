import { buildGeneral, buildToday, buildCompleted, buildTrash, buildUpcoming } from './modules/build-pages.js';
import { openProjectModal } from './modules/modal.js';
import { renderProjectNav } from './modules/projects.js';
import './reset.css';
import './styles.css';

const navBtn = document.querySelector('.header-nav-btn');
const navLinks = document.querySelectorAll('.header-main-nav-link');
const mobileNavBtn = document.querySelector('.mobile-nav-btn');

navBtn.addEventListener('click', () => {
    openProjectModal();
});

mobileNavBtn.addEventListener('click', () => {
    document.querySelector('.header').classList.toggle('is-active');
    document.querySelector('.main-container').classList.toggle('is-active');
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        switch (link.innerText) {
            case 'General':
                buildGeneral();
                break;
            case 'Today':
                buildToday();
                break;
            case 'Upcoming':
                buildUpcoming();
                break;
            case 'Completed':
                buildCompleted();
                break;
            case 'Trash':
                buildTrash();
                break;
        }
    });
});

renderProjectNav();
buildGeneral();
