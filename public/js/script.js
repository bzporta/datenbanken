

const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link a');
const loginLink = document.querySelector('.login-link a');
const loginButton = document.querySelector('form-box.login form button');
const loginForm = document.querySelector('.form-box.login form');
const homepageTabs = document.querySelectorAll('.home-page header .tablink');
const signOutButtons = document.querySelectorAll('.sign-out-button');
const homepageContents = document.querySelectorAll('.home-page .content-box > .content');

let currentTab = 0;

function init() {
    showSinglePage('login-page');
    // showSinglePage('home-page');
    setupHomePage();
}

function setupHomePage() {
    createTabButtons = document.querySelectorAll('.createTableButton');
    createTabButtons.forEach(button => {
        button.click();
    });
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
    wrapper.classList.add('active');
    showElement('.form-box.register');
    hideElement('.form-box.login');
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

function showElementByIdDisplay(id, display) {
    /**
     * Funktion, um das Element anzuzeigen
     */
    const element = document.getElementById(id);
    if (element) {
        element.style.display = display;
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

function hideElementById(id) {
    // Funktion, um das Element auszublenden
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'none';
    }
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

// Treatment

treatmentTabButtonTherapie = document.getElementById('therapie-tab-button2');
treatmentTabButtonOperation = document.getElementById('operation-tab-button');
treatmentTabButtonTherapie.addEventListener('click', (e) => {
    e.preventDefault();
    showElementById('therapietab');
    hideElementById('operationstab');
});

treatmentTabButtonOperation.addEventListener('click', (e) => {
    e.preventDefault();
    showElementById('operationstab');
    hideElementById('therapietab');
});

// Patients

aufnahmedatumDatePicker = document.getElementById('patientenaufnahmedatum');
aufnahmedatumDatePicker.value = new Date().toISOString().slice(0, 10);
// Createtable Patient

patientCreateTableButton = document.querySelector('#patiententab .wrapper .createTableButton');
patientCreateTableButton.addEventListener('click', async() => {
    var result = await executeSqlCommand(
        `SELECT PATIENTEN_ID, KRANKENHAUS_ID, PATIENTENRAUM_ID, NAME, SUBSTR(AUFNAHME_DATUM ,0,8) AS AUFNAHMEDATUM, SUBSTR(ENTLASSUNGS_DATUM ,0,8) AS ENTLASSUNGSDATUM, GESCHLECHT, SUBSTR(GEBURTSDATUM ,0,8) AS GEBURTSDATUM, BLUTGRUPPE
        FROM "MIPM"."PATIENT"`
    )
    constructTable(result, 'patienten-table');
});

// Add Patient

addpatientForm = document.getElementById('patienten-form');
addpatientForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(addpatientForm.patientenentlassungsdatum.value);

    var query_entlassungsdatum = "''";
    if (addpatientForm.patientenentlassungsdatum.value != '') {
        query_entlassungsdatum = "TO_DATE('${addpatientForm.patientenentlassungsdatum.value} 00:00:00', 'YYYY-MM-DD HH24:MI:SS')";
    }
    const query = `BEGIN
    INSERT INTO "MIPM"."PATIENT" (KRANKENHAUS_ID, PATIENTENRAUM_ID, NAME, AUFNAHME_DATUM, ENTLASSUNGS_DATUM, GESCHLECHT, GEBURTSDATUM, BLUTGRUPPE) 
    VALUES (
                   '${addpatientForm.patientenKrankenhausId.value}',
                   '${addpatientForm.patientenRaumId.value}',
                   '${addpatientForm.name.value}',
                    TO_DATE('${addpatientForm.patientenaufnahmedatum.value} 00:00:00', 'YYYY-MM-DD HH24:MI:SS'),
                    ${query_entlassungsdatum},
                   '${addpatientForm.patientengeschlecht.value}',
                    TO_DATE('${addpatientForm.patientengeburtsdatum.value} 00:00:00', 'YYYY-MM-DD HH24:MI:SS'),
                   '${addpatientForm.patientenblutgruppe.value}');
                   COMMIT;
                   END;`;
                   
    console.log(query);
    executeSqlCommand(query);
    patientCreateTableButton.click();
    addpatientForm.reset();
});


// Delete Patient

deletePatientForm = document.querySelector('#patiententab .wrapper form:nth-of-type(2)');
deletePatientForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const query = `BEGIN
    DELETE FROM "MIPM"."PATIENT" WHERE PATIENTEN_ID = ${deletePatientForm.patientendelete.value};
    COMMIT;
    END;`;
    
    executeSqlCommand(query);
    patientCreateTableButton.click();
    deletePatientForm.reset();
});

// Patient Details
// Show Patient Details
showDetailsForm = document.getElementById('patientenauswahlform');
showDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showElementById('patientenDetailsTab');
    hideElementById('patiententab');
});

// Diagnosis

diagnosisdatepicker = document.getElementById('diagnosisdate');
diagnosisdatepicker.value = new Date().toISOString().slice(0, 10);


// personnel

personnelTabButtonAerzte         = document.getElementById('aerzte-tab-button-2');
personnelTabButtonKrankenpfleger = document.getElementById('krankenpfleger-tab-button');
personnelTabButtonAerzte.addEventListener('click', (e) => {
    e.preventDefault();
    showElementByIdDisplay('aerztetab', 'flex');
    hideElementById('krankenpflegertab');
});

personnelTabButtonKrankenpfleger.addEventListener('click', (e) => {
    e.preventDefault();
    showElementByIdDisplay('krankenpflegertab', 'flex');
    hideElementById('aerztetab');
});

// Createtable Krankenpfleger
personnelKrankenpflegerCreateTableButton = document.querySelector('#krankenpflegertab .wrapper .createTableButton');
personnelKrankenpflegerCreateTableButton.addEventListener('click', async() => {
    var result = await executeSqlCommand(
        `SELECT * FROM "MIPM"."KRANKENPFLEGER"`
    )
    constructTable(result, 'krankenpfleger-table');
});


// Personnelform Krankenpfleger
krankenpflegerForm = document.querySelector('#krankenpflegertab .wrapper form:first-of-type');
krankenpflegerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const query = `BEGIN
    INSERT INTO "MIPM"."KRANKENPFLEGER" (KRANKENHAUS_ID, NAME, VORNAME, ARBEITSBEGINN, ARBEITSENDE, QUALIFIKATIONEN, BERECHTIGUNGEN) 
    VALUES (
                   '${krankenpflegerForm.krankenhausid.value}',
                   '${krankenpflegerForm.name.value}',
                   '${krankenpflegerForm.vorname.value}',
                   '${krankenpflegerForm.arbeitsbeginn.value}',
                   '${krankenpflegerForm.arbeitsende.value}',
                   '${krankenpflegerForm.qualifikationen.value}',
                   '${krankenpflegerForm.berechtigungen.value}');
                   COMMIT;
                   END;`;
                   
    executeSqlCommand(query);
    personnelKrankenpflegerCreateTableButton.click();
    krankenpflegerForm.reset();
});
                
                // Delete krankenpfleger
                deleteKrankenpflegerForm = document.querySelector('#krankenpflegertab .wrapper form:nth-of-type(2)');
                deleteKrankenpflegerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const query = `BEGIN
    DELETE FROM "MIPM"."KRANKENPFLEGER" WHERE MITARBEITER_NR = ${deleteKrankenpflegerForm.mitarbeiteridDelete.value};
    COMMIT;
    END;`;
    
    executeSqlCommand(query);
    personnelKrankenpflegerCreateTableButton.click();
    deleteKrankenpflegerForm.reset();
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
        
        executeSqlCommand(query);
        personnelCreateTableButton.click();
        personnelForm.reset();
    });
    
    // Createtable Arzt
    personnelCreateTableButton = document.getElementById('createTableButton');
    personnelCreateTableButton.addEventListener('click', async () => {
        var result = await executeSqlCommand(
            `SELECT * FROM "MIPM"."ARZT"
             `
        )
        constructTable(result, 'Personnel-table');
    });

    // Delete Arzt
    
    deleteArztForm = document.querySelector('#aerztetab .wrapper form:nth-of-type(2)');
    deleteArztForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const query = `BEGIN
        DELETE FROM "MIPM"."ARZT" WHERE MITARBEITER_NR = ${deleteArztForm.mitarbeiteridDelete.value};
        COMMIT;
                   END;`;

    executeSqlCommand(query);
    personnelCreateTableButton.click();
    deleteArztForm.reset();
});



// Stations


init();