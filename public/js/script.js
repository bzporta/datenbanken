

const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link a');
const loginLink = document.querySelector('.login-link a');
const loginButton = document.querySelector('form-box.login form button');
const loginForm = document.querySelector('.form-box.login form');
const homepageTabs = document.querySelectorAll('.home-page header .tablink');
const signOutButtons = document.querySelectorAll('.sign-out-button');
const homepageContents = document.querySelectorAll('.home-page .content-box .content');

let currentTab = 0;

function init() {
    showSinglePage('login-page');
    // showSinglePage('home-page');
    setupHomePage();
}

function setupHomePage() {
    setupFirstTab();  
}

function setupFirstTab() {
    homepageTabs.forEach(tab => {tab.classList.remove('tabactive')});
    homepageTabs[currentTab].click();
}

window.addEventListener('resize', () => {
    homepageTabs[currentTab].click();
});

signOutButtons.forEach(button => {
    button.addEventListener('click', () => {
        showSinglePage('login-page');
    })
});

homepageTabs.forEach((tab, index) => {
    tab.addEventListener('click', (e) => {
        homepageTabs.forEach(tab => {tab.classList.remove('tabactive')});
        tab.classList.add('tabactive');

        var line = document.querySelector('.line');
        line.style.width = e.target.offsetWidth + 'px';
        line.style.left = e.target.offsetLeft + 'px';

        homepageContents.forEach(content => {
            content.classList.remove('active');
        });
        homepageContents[index].classList.add('active');
        currentTab = index;
        // changeHomePageTabContent(tab.id);
    })
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showSinglePage('home-page');
    setupHomePage();
});

registerLink.onclick = () => {
    // wrapper.classList.add('active');
    // showElement('.form-box.register');
    // hideElement('.form-box.login');
    fetch('/api/arzt')
        .then(response => response.json())
        .then(response => {
            let data = response;
            console.log(data);
        });
};

loginLink.onclick = () => {
    // wrapper.classList.remove('active');
    showElement('.form-box.login');
    hideElement('.form-box.register');
}

function showElement(selector) {
    // Funktion, um das Element anzuzeigen
    const element = document.querySelector(selector);
    if (element) {
        element.style.display = 'block';
    }
}

// function to show element by id
function showElementById(id) {
    /**
     * Funktion, um das Element anzuzeigen
     */
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'block';
    }
}

function showSinglePage(id) {
    /**
     * Funktion, um das Element anzuzeigen
     */
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (page.id === id) {
            page.style.display = 'block';
        } else {
            page.style.display = 'none';
        }
    });
}

function changeHomePageTabContent(tab) {
    /**
     * Funktion, um den Inhalt des Tabs auf der Home-Seite zu ändern
     */
    homepageContents.forEach(content => {
        if (content.id === tab) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

function hideElement(selector) {
    // Funktion, um das Element auszublenden
    const element = document.querySelector(selector);
    if (element) {
        element.style.display = 'none';
    }
}

init();