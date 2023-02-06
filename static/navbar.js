let navbar = document.querySelector('#navbar');
let navLogo = document.getElementById('logo-navbar');

let options = document.querySelector('.options');
let showSidebar = false;
let burguer = document.querySelector('.burguer');
let navIcon = document.querySelector('.nav-icon');

let mainContent = document.querySelector('#content');


function toggleSidebar() {
    showSidebar = !showSidebar;
    if(showSidebar) {
        options.style.right = '0';
        options.style.animationName = 'showSidebar';
        options.style.display = 'flex';
        navIcon.classList.remove('fa-bars');
        navIcon.classList.add('fa-xmark');
    } else {
        options.style.right = '-100vw';
        options.style.display = 'none';
        options.style.animationName = '';
        navIcon.classList.remove('fa-xmark');
        navIcon.classList.add('fa-bars');
    }
}

mainContent.addEventListener('click', () => {
    if(showSidebar) {
        toggleSidebar();
    }
});

window.addEventListener('resize', () => {
    if(window.innerWidth > 980 && showSidebar) {
        toggleSidebar();
    }
});


