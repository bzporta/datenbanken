

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


// table-managment

function clearTable(table) {
    // Clear table
    const thead = table.getElementsByTagName('thead')[0];
    const tbody = table.getElementsByTagName('tbody')[0];
    thead.innerHTML = '';
    tbody.innerHTML = '';
}

function constructTable(data, table_id) {
    // From JSON to Table
    const currentTable = document.getElementById(table_id);
    const currentThead = currentTable.getElementsByTagName('thead')[0];
    const currentTbody = currentTable.getElementsByTagName('tbody')[0];

    clearTable(currentTable);

    const headerRow = currentThead.insertRow();
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });

    data.forEach(element => {
        const row = currentTbody.insertRow();
        Object.values(element).forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });
    });
}

// personnel

// temporary data
let personnel = [
    {
        name: 'Max Mustermann',
        position: 'CEO',
        email: 'testmail.com',
        geschlecht: 'Divers'
    },
    {
        name: 'Bjarne Mädel',
        position: 'CTO',
        email: 'Bjarnemail.com'
    }
]

async function executeSqlCommand(sql_command) {
    var result = await fetch('/api/sql', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({sql_command: sql_command})
    })
    try {
        return result.json();
    }
    catch {
        return null;
    }
}

personnelCreateTableButton = document.getElementById('createTableButton');
personnelCreateTableButton.addEventListener('click', async () => {
    var result = await executeSqlCommand(
        `SELECT *
         FROM ARZT
         WHERE KRANKENHAUS_ID = 1
         ORDER BY MITARBEITER_NR`
    )
    constructTable(result, 'Personnel-table');

});

// Personnelform ARZT
personnelForm = document.getElementById('personnel-form');
personnelForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = `BEGIN
                   INSERT INTO "MIPM"."ARZT" (KRANKENHAUS_ID, NAME, VORNAME, ARBEITSBEGINN, ARBEITSENDE, FACHRICHTUNG, POSITION) 
                   VALUES (
                   '${personnelForm.krankenhausid.value}',
                   '${personnelForm.name.value}',
                   '${personnelForm.vorname.value}',
                   '${personnelForm.arbeitsbeginn.value}',
                   '${personnelForm.arbeitsende.value}',
                   '${personnelForm.fachrichtung.value}',
                   '${personnelForm.position.value}');
                   COMMIT;
                   END;`;

    console.log(query);
    
    executeSqlCommand(query);

    // temporarly changing the personnel
    // personnel.push({
    //     krankenhaus_id: personnelForm.krankenhausid.value,
    //     name: personnelForm.name.value,
    //     position: personnelForm.value,
    //     email: personnelForm.email.value
    // });

    personnelForm.reset();
});


init();