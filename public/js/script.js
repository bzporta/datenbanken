

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
         `
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


// Patient
// adds
versicherungForm = document.getElementById('versicherung-form-add');
versicherungForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = `BEGIN
                   INSERT INTO "MIPM"."VERSICHERUNG" (BETRIEBSNUMMER, VERSICHERUNGSNAME)
                   VALUES (
                   '${versicherungForm.betriebsnummer.value}',
                   '${versicherungForm.versicherungsname.value}');
                   COMMIT;
                   END;`;

    console.log(query);
    
    executeSqlCommand(query);

    versicherungForm.reset();
});

patientversicherungForm = document.getElementById('versicherung-form-add-patient');
patientversicherungForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = `BEGIN
                   INSERT INTO "MIPM"."PATIENT_VERSICHERUNG" (PATIENTEN_ID, BETRIEBSNUMMER, VERSICHERUNGSNUMMER)
                   VALUES (
                   '${patientversicherungForm.patientenid.value}',
                   '${patientversicherungForm.betriebsnummer.value}',
                   '${patientversicherungForm.versicherungsnummer.value}');
                   COMMIT;
                   END;`;

    console.log(query);
    
    executeSqlCommand(query);

    patientversicherungForm.reset();
});

rechnungForm = document.getElementById('rechnung-form-add');
rechnungForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = `BEGIN
                   INSERT INTO "MIPM"."RECHNUNG" (PATIENTEN_ID, BETRIEBSNUMMER, BETRAG, ZUZAHLUNG, AUSSTELLUNGS_DATUM, FAELLIGKEITS_DATUM, STATUS)
                   VALUES (
                   '${rechnungForm.patientenid.value}',
                   '${rechnungForm.betriebsnummer.value}',
                   '${rechnungForm.betrag.value}',
                   '${rechnungForm.zuzahlung.value}',
                   '${rechnungForm.ausstellungs_datum.value}',
                   '${rechnungForm.faelligkeits_datum.value}',
                   1);
                   COMMIT;
                   END;`;

    console.log(query);
    
    executeSqlCommand(query);

    rechnungForm.reset();
});

// deletes
versicherungremove = document.getElementById('versicherung-form-remove');
versicherungremove.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = `BEGIN
                   DELETE FROM PATIENT_VERSICHERUNG
                   WHERE PATIENTEN_ID = '${versicherungremove.patientenid.value}'
                   AND BETRIEBSNUMMER = '${versicherungremove.betriebsnummer.value}';
                   COMMIT;
                   END;`;

    console.log(query);
    
    executeSqlCommand(query);

    versicherungremove.reset();
});

versicherungdelete = document.getElementById('versicherung-form-del');
versicherungdelete.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = `BEGIN
                   DELETE FROM VERSICHERUNG WHERE BETRIEBSNUMMER = '${versicherungdelete.betriebsnummer.value}';
                   COMMIT;
                   END;`;

    console.log(query);
    
    executeSqlCommand(query);

    versicherungdelete.reset();
});

rechnungdelete = document.getElementById('rechnung-form-del');
rechnungdelete.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = `BEGIN
                   DELETE FROM RECHNUNG WHERE RECHNUNGS_NR = '${rechnungdelete.rechnungsnr.value}';
                   COMMIT;
                   END;`;

    console.log(query);
    
    executeSqlCommand(query);

    rechnungdelete.reset();
});

// updates
versicherungupdate = document.getElementById('versicherung-form-update');
versicherungupdate.addEventListener('submit', (e) => {
    e.preventDefault();

    const query = `BEGIN
                   UPDATE VERSICHERUNG
                   SET VERSICHERUNGSNAME = '${versicherungupdate.versicherungsname.value}'
                   WHERE BETRIEBSNUMMER = '${versicherungupdate.betriebsnummer.value}';
                   COMMIT;
                   END;`;

    console.log(query);
    
    executeSqlCommand(query);

    versicherungupdate.reset();
});

rechnungupdate = document.getElementById('rechnung-form-update');
rechnungupdate.addEventListener('submit', (e) => {
    e.preventDefault();

    if (rechnungupdate.patientenid.value == '' && rechnungupdate.betriebsnummer.value == '' && rechnungupdate.betrag.value == '' && rechnungupdate.zuzahlung.value == '' && rechnungupdate.ausstellungs_datum.value == '' && rechnungupdate.faelligkeits_datum.value == '' && rechnungupdate.status.value == '') return;

    var query = `BEGIN UPDATE RECHNUNG SET`;

    if (rechnungupdate.patientenid.value != '') {
        query += ` PATIENTEN_ID = '${rechnungupdate.patientenid.value}'`;
    }

    if (rechnungupdate.betriebsnummer.value != '') {
        if (query != `BEGIN UPDATE RECHNUNG SET`) query += `, `;
        query += ` BETRIEBSNUMMER = '${rechnungupdate.betriebsnummer.value}'`;
    }

    if (rechnungupdate.betrag.value != '') {
        if (query != `BEGIN UPDATE RECHNUNG SET`) query += `, `;
        query += ` BETRAG = '${rechnungupdate.betrag.value}'`;
    }

    if (rechnungupdate.zuzahlung.value != '') {
        if (query != `BEGIN UPDATE RECHNUNG SET`) query += `, `;
        query += ` ZUZAHLUNG = '${rechnungupdate.zuzahlung.value}'`;
    }

    if (rechnungupdate.ausstellungs_datum.value != '') {
        if (query != `BEGIN UPDATE RECHNUNG SET`) query += `, `;
        query += ` AUSSTELLUNGS_DATUM = '${rechnungupdate.ausstellungs_datum.value}'`;
    }

    if (rechnungupdate.faelligkeits_datum.value != '') {
        if (query != `BEGIN UPDATE RECHNUNG SET`) query += `, `;
        query += ` FAELLIGKEITS_DATUM = '${rechnungupdate.faelligkeits_datum.value}'`;
    }

    if (rechnungupdate.status.value != '') {
        if (query != `BEGIN UPDATE RECHNUNG SET`) query += `, `;
        query += ` STATUS = '${rechnungupdate.status.value}'`;
    }

    query += ` WHERE RECHNUNGS_NR = '${rechnungupdate.rechnungsnr.value}'; COMMIT; END;`;

    console.log(query);
    
    executeSqlCommand(query);

    rechnungupdate.reset();
});

// selects
versicherungCreateTable = document.getElementById('versicherung-form-read');
versicherungCreateTable.addEventListener('submit', async (e) => {
    e.preventDefault();

    var result;
    var query = `SELECT * FROM VERSICHERUNG`;

    if (versicherungCreateTable.patientenid.value != '' || versicherungCreateTable.betriebsnummer.value != '' || versicherungCreateTable.versicherungsname.value != '') {
        if (versicherungCreateTable.patientenid.value != '') {
            query = `SELECT PATIENT_VERSICHERUNG.PATIENTEN_ID, PATIENT_VERSICHERUNG.BETRIEBSNUMMER, PATIENT_VERSICHERUNG.VERSICHERUNGSNUMMER FROM VERSICHERUNG INNER JOIN PATIENT_VERSICHERUNG ON VERSICHERUNG.BETRIEBSNUMMER = PATIENT_VERSICHERUNG.BETRIEBSNUMMER`;
        }

        query += ` WHERE`;
    }

    if (versicherungCreateTable.patientenid.value != '') {
        query += ` PATIENT_VERSICHERUNG.PATIENTEN_ID = '${versicherungCreateTable.patientenid.value}'`;
    }

    if (versicherungCreateTable.betriebsnummer.value != '') {
        if (query.substring(query.length - 5) != 'WHERE') query += ' AND';

        query += ` VERSICHERUNG.BETRIEBSNUMMER = '${versicherungCreateTable.betriebsnummer.value}'`;
    }
    
    if (versicherungCreateTable.versicherungsname.value != '') {
        if (query.substring(query.length - 5) != 'WHERE') query += ' AND';

        query += ` VERSICHERUNG.VERSICHERUNGSNAME LIKE '${versicherungCreateTable.versicherungsname.value}'`
    }

    query += ` ORDER BY VERSICHERUNG.BETRIEBSNUMMER ASC`

    result = await executeSqlCommand(query);

    constructTable(result, 'Versicherung-table');
});

rechnungCreateTable = document.getElementById('rechnung-form-read');
rechnungCreateTable.addEventListener('submit', async (e) => {
    e.preventDefault();

    var result;
    var query = `SELECT RECHNUNGS_NR, PATIENTEN_ID, BETRIEBSNUMMER, BETRAG, ZUZAHLUNG, AUSSTELLUNGS_DATUM AS AUSSTELLUNGSDATUM, FAELLIGKEITS_DATUM AS FÄLLIGKEITSDATUM, STATUS FROM RECHNUNG`;

    if (rechnungCreateTable.rechnungsnr.value != '' || rechnungCreateTable.patientenid.value != '' || rechnungCreateTable.betriebsnummer.value != '' || rechnungCreateTable.betrag.value != '' || rechnungCreateTable.zuzahlung.value != '' || rechnungCreateTable.ausstellungs_datum.value != '' || rechnungCreateTable.faelligkeits_datum.value != '') {
        query += ` WHERE`;
    }

    if (rechnungCreateTable.rechnungsnr.value != '') {
        if (rechnungCreateTable.rechnungsnr.value.includes('sum')) {
            query = ` SELECT PATIENTEN_ID, SUM(BETRAG) + SUM(ZUZAHLUNG) AS GESAMTBETRAG FROM RECHNUNG`;
            if (rechnungCreateTable.patientenid.value != '' || rechnungCreateTable.betriebsnummer.value != '' || rechnungCreateTable.betrag.value != '' || rechnungCreateTable.zuzahlung.value != '') {
                query += ` WHERE`;
            }
        } else if (rechnungCreateTable.rechnungsnr.value.includes('-')) {
            query += ` RECHNUNGS_NR BETWEEN '${rechnungCreateTable.rechnungsnr.value.substring(0, rechnungCreateTable.rechnungsnr.value.indexOf('-'))}' AND '${rechnungCreateTable.rechnungsnr.value.substring(rechnungCreateTable.rechnungsnr.value.indexOf('-') + 1)}'`;
        } else {
            query += ` RECHNUNGS_NR = '${rechnungCreateTable.rechnungsnr.value}'`;
        }
    }

    if (rechnungCreateTable.patientenid.value != '') {
        if (query.substring(query.length - 5) != 'WHERE') query += ' AND';

        if (rechnungCreateTable.patientenid.value.includes('-')) {
            query += ` PATIENTEN_ID BETWEEN '${rechnungCreateTable.patientenid.value.substring(0, rechnungCreateTable.patientenid.value.indexOf('-'))}' AND '${rechnungCreateTable.patientenid.value.substring(rechnungCreateTable.patientenid.value.indexOf('-') + 1)}'`;
        } else {
            query += ` PATIENTEN_ID = '${rechnungCreateTable.patientenid.value}'`;
        }
    }

    if (rechnungCreateTable.betriebsnummer.value != '') {
        if (query.substring(query.length - 5) != 'WHERE') query += ' AND';

        if (rechnungCreateTable.betriebsnummer.value.includes('-')) {
            query += ` BETRIEBSNUMMER BETWEEN '${rechnungCreateTable.betriebsnummer.value.substring(0, rechnungCreateTable.betriebsnummer.value.indexOf('-'))}' AND '${rechnungCreateTable.betriebsnummer.value.substring(rechnungCreateTable.betriebsnummer.value.indexOf('-') + 1)}'`;
        } else {
            query += ` BETRIEBSNUMMER = '${rechnungCreateTable.betriebsnummer.value}'`;
        }
    }

    if (rechnungCreateTable.betrag.value != '') {
        if (query.substring(query.length - 5) != 'WHERE') query += ' AND';

        if (rechnungCreateTable.betrag.value.includes('-', 1)) {
            query += ` BETRAG BETWEEN '${rechnungCreateTable.betrag.value.substring(0, rechnungCreateTable.betrag.value.indexOf('-'))}' AND '${rechnungCreateTable.betrag.value.substring(rechnungCreateTable.betrag.value.indexOf('-') + 1)}'`;
        } else {
            query += ` BETRAG = '${rechnungCreateTable.betrag.value}'`;
        }
    }

    if (rechnungCreateTable.zuzahlung.value != '') {
        if (query.substring(query.length - 5) != 'WHERE') query += ' AND';
        
        if (rechnungCreateTable.zuzahlung.value.includes('-', 1)) {
            query += ` ZUZAHLUNG BETWEEN '${rechnungCreateTable.zuzahlung.value.substring(0, rechnungCreateTable.zuzahlung.value.indexOf('-'))}' AND '${rechnungCreateTable.zuzahlung.value.substring(rechnungCreateTable.zuzahlung.value.indexOf('-') + 1)}'`;
        } else {
            query += ` ZUZAHLUNG = '${rechnungCreateTable.zuzahlung.value}'`;
        }
    }

    if (rechnungCreateTable.ausstellungs_datum.value != '') {
        if (query.substring(query.length - 5) != 'WHERE') query += ' AND';
        
        if (rechnungCreateTable.ausstellungs_datum.value.includes('-')) {
            query += ` TRUNC(AUSSTELLUNGS_DATUM) BETWEEN TO_DATE('${rechnungCreateTable.ausstellungs_datum.value.substring(0, rechnungCreateTable.ausstellungs_datum.value.indexOf('-'))}','DD-MM-YYYY') AND TO_DATE('${rechnungCreateTable.ausstellungs_datum.value.substring(rechnungCreateTable.ausstellungs_datum.value.indexOf('-') + 1)}','DD-MM-YYYY')`;
        } else {
            query += ` TRUNC(AUSSTELLUNGS_DATUM) = to_date('${rechnungCreateTable.ausstellungs_datum.value}','DD-MM-YYYY')`;
        }
    }

    if (rechnungCreateTable.faelligkeits_datum.value != '') {
        if (query.substring(query.length - 5) != 'WHERE') query += ' AND';
        
        if (rechnungCreateTable.faelligkeits_datum.value.includes('fällig')) {
            query += ` TRUNC(FAELLIGKEITS_DATUM) < TRUNC(SYSDATE) AND STATUS = 1`;
        } else if (rechnungCreateTable.faelligkeits_datum.value.includes('-')) {
            query += ` TRUNC(FAELLIGKEITS_DATUM) BETWEEN TO_DATE('${rechnungCreateTable.faelligkeits_datum.value.substring(0, rechnungCreateTable.faelligkeits_datum.value.indexOf('-'))}','DD-MM-YYYY') AND TO_DATE('${rechnungCreateTable.faelligkeits_datum.value.substring(rechnungCreateTable.faelligkeits_datum.value.indexOf('-') + 1)}','DD-MM-YYYY')`;
        } else {
            query += ` TRUNC(FAELLIGKEITS_DATUM) = TO_DATE('${rechnungCreateTable.faelligkeits_datum.value}','DD-MM-YYYY')`;
        }
    }

    if (rechnungCreateTable.rechnungsnr.value.includes('sum')) {
        query += ` GROUP BY PATIENTEN_ID`;
    }

    query += ` ORDER BY PATIENTEN_ID ASC`;

    result = await executeSqlCommand(query);

    constructTable(result, 'Rechnung-table');
});

patientCreateTableButton = document.getElementById('patient-createTableButton');
patientCreateTableButton.addEventListener('click', async () => {
    var result = await executeSqlCommand(
        `SELECT *
         FROM PATIENT
         `
    )
    constructTable(result, 'Patient-table');

    var result = await executeSqlCommand( // ATTRIBUTE_6 AS Betriebsnummer, VERSICHERUNGSNAME AS Versicherungsname
        `SELECT *
         FROM VERSICHERUNG
         `
    )
    constructTable(result, 'Versicherung-table');

    var result = await executeSqlCommand( // RECHNUNGS_NR, PATIENTEN_ID, ATTRIBUTE_6 AS Betriebsnummer, BETRAG, ZUZAHLUNG
        `SELECT *
         FROM RECHNUNG
         `
    )
    constructTable(result, 'Rechnung-table');
});

/*
executeSqlCommand(`ALTER TABLE PATIENT_VERSICHERUNG
                   ADD CONSTRAINT FK_PATIENT_VERSICHERUNG
                   FOREIGN KEY (BETRIEBSNUMMER)
                   REFERENCES VERSICHERUNG (BETRIEBSNUMMER)
                   ON DELETE CASCADE`);


executeSqlCommand(`ALTER TABLE RECHNUNG
                   ADD CONSTRAINT FK_VERSICHERUNG_RECHNUNG
                   FOREIGN KEY (BETRIEBSNUMMER)
                   REFERENCES VERSICHERUNG (BETRIEBSNUMMER)
                   ON DELETE CASCADE`);
*/

init();
