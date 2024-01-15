

const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link a');
const loginLink = document.querySelector('.login-link a');
const loginButton = document.querySelector('form-box.login form button');
const loginForm = document.querySelector('.form-box.login form');
const registerForm = document.querySelector('.form-box.register form');
const homepageTabs = document.querySelectorAll('.home-page header .tablink');
const signOutButtons = document.querySelectorAll('.sign-out-button');
const homepageContents = document.querySelectorAll('.home-page .content-box .content');
console.log(homepageContents.length);
let currentTab = 0;
var patientId;

function init() {
    showSinglePage('login-page');
    // showSinglePage('home-page');
    setupHomePage();
}

function setupHomePage() {
    createTabButtons = document.querySelectorAll('.createTableButton');
    createTabForms   = document.querySelectorAll('.createTabForm');
    createTabButtons.forEach(button => {
        button.click();
    });
    setupPatientsTable();
    
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

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const benutzername = loginForm.username.value;
    const passwort = loginForm.password.value;

    //console.log(loginForm.username.value, loginForm.password.value)
    const result = await executeSqlCommand(`

        SELECT * 
        FROM BENUTZER
        WHERE BENUTZERNAME = '${benutzername}'
        AND PASSWORT = '${passwort}'

    `);

    console.log(result);

    if (result.length > 0 ) {
        document.getElementById('login-error').classList.add('hidden');
        showSinglePage('home-page');
        setupHomePage();
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }

});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    var benutzername = registerForm.username.value;
    var passwort = registerForm.password.value;

    
    const result = await executeSqlCommand(`
        BEGIN
        INSERT INTO BENUTZER (BENUTZERNAME, PASSWORT)
        VALUES ('${benutzername}', '${passwort}');
        COMMIT;
        END;
    `);

    console.log(result);
    if(result != null){
        document.getElementById('register-error').classList.add('hidden');
        console.log('test');
        loginLink.click();
    }else{
        document.getElementById('register-error').classList.remove('hidden');
    }

    


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
    logSqlCommand(sql_command);
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

function logSqlCommand(sql_command) {
    const border = '#'.repeat(60);
    console.log('\x1b[32m%s\x1b[0m',`${border}\n
                 ${sql_command}\n
                 ${border}`);
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

patientCreateTableForm = document.getElementById('createPatientTableForm');
patientCreateTableForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    var result = await executeSqlCommand(
        `SELECT PATIENT.PATIENTEN_ID, 
        K.NAME AS KRANKENHAUSNAME, 
        S.STATIONS_NAME || '-' || PATIENT.PATIENTENRAUM_ID AS PATIENTENRAUM, 
        PATIENT.NAME, 
        SUBSTR(AUFNAHME_DATUM ,0,8) AS AUFNAHMEDATUM, 
        SUBSTR(ENTLASSUNGS_DATUM ,0,8) AS ENTLASSUNGSDATUM, 
        CASE
            WHEN GESCHLECHT = 0 THEN 'Männlich'
            WHEN GESCHLECHT = 1 THEN 'Weiblich'
            WHEN GESCHLECHT = 2 THEN 'Divers'
            ELSE 'Unbekannt'
        END AS GESCHLECHT,
        SUBSTR(GEBURTSDATUM ,0,8) AS GEBURTSDATUM, 
        BLUTGRUPPE
        FROM "MIPM"."PATIENT"
        JOIN "MIPM"."KRANKENHAUS" K ON PATIENT.KRANKENHAUS_ID = K.KRANKENHAUS_ID
        JOIN "MIPM"."PATIENTENRAUM" PR ON PATIENT.PATIENTENRAUM_ID = PR.PATIENTENRAUM_ID
        JOIN "MIPM"."STATION" S ON PR.STATIONS_ID = S.STATIONS_ID
        ORDER BY "MIPM"."PATIENT".${patientCreateTableForm.patientOrderBy.value}`
    )
    constructTable(result, 'patienten-table');
});

async function setupPatientsTable() {
    var result = await executeSqlCommand(
        `SELECT PATIENT.PATIENTEN_ID, 
        K.NAME AS KRANKENHAUSNAME, 
        S.STATIONS_NAME || '-' || PATIENT.PATIENTENRAUM_ID AS PATIENTENRAUM, 
        PATIENT.NAME, 
        SUBSTR(AUFNAHME_DATUM ,0,8) AS AUFNAHMEDATUM, 
        SUBSTR(ENTLASSUNGS_DATUM ,0,8) AS ENTLASSUNGSDATUM, 
        CASE
            WHEN GESCHLECHT = 1 THEN 'Weiblich'
            WHEN GESCHLECHT = 0 THEN 'Männlich'
            WHEN GESCHLECHT = 2 THEN 'Divers'
            ELSE 'Unbekannt'
        END AS GESCHLECHT,
        SUBSTR(GEBURTSDATUM ,0,8) AS GEBURTSDATUM, 
        BLUTGRUPPE
        FROM "MIPM"."PATIENT"
        JOIN "MIPM"."KRANKENHAUS" K ON PATIENT.KRANKENHAUS_ID = K.KRANKENHAUS_ID
        JOIN "MIPM"."PATIENTENRAUM" PR ON PATIENT.PATIENTENRAUM_ID = PR.PATIENTENRAUM_ID
        JOIN "MIPM"."STATION" S ON PR.STATIONS_ID = S.STATIONS_ID
        `
    )
    constructTable(result, 'patienten-table');
}

// patientCreateTableButton = document.querySelector('#patiententab .wrapper .createTableButton');
// patientCreateTableButton.addEventListener('click', async() => {
//     var result = await executeSqlCommand(
//         `SELECT PATIENTEN_ID, 
//         KRANKENHAUS_ID, 
//         PATIENTENRAUM_ID, 
//         NAME, 
//         SUBSTR(AUFNAHME_DATUM ,0,8) AS AUFNAHMEDATUM, 
//         SUBSTR(ENTLASSUNGS_DATUM ,0,8) AS ENTLASSUNGSDATUM, 
//         CASE
//             WHEN GESCHLECHT = 1 THEN 'Weiblich'
//             WHEN GESCHLECHT = 0 THEN 'Männlich'
//             WHEN GESCHLECHT = 2 THEN 'Divers'
//             ELSE 'Unbekannt'
//         END AS GESCHLECHT,
//         SUBSTR(GEBURTSDATUM ,0,8) AS GEBURTSDATUM, 
//         BLUTGRUPPE
//         FROM "MIPM"."PATIENT"`
//     )
//     constructTable(result, 'patienten-table');
// });

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
    DELETE FROM "MIPM"."DIAGNOSE" WHERE PATIENTEN_ID = ${deletePatientForm.patientendelete.value};
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
    patientId = showDetailsForm.choosePatientId.value;
    createPatientDetailsTable();
    createPatientDiagnosesTable();
    showElementByIdDisplay('patientenDetailsTab', 'flex');
    hideElementById('patiententab');

});

// Show Patient treatments
showTreatmentForm = document.getElementById('behandlungsauswahlform');
showTreatmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const result =  await executeSqlCommand(
        `SELECT *
        FROM ${showTreatmentForm.behandlungstypauswahl.value}
        WHERE BEHANDLUNGS_ID = ${showTreatmentForm.chooseBehandlungsId.value}`);
    
    constructTable(result, 'patientenBehandlung-table');
});

// Add Patient Treatment

// addTreatmentForm = document.getElementById('addTreatment-form');
// addTreatmentForm.addEventListener('submit', (e) => {

addTherapieForm = document.getElementById('addTherapie-form');
addTherapieForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // const krankenhaus_id = await executeSqlCommand(`SELECT KRANKENHAUS_ID FROM PATIENT WHERE PATIENTEN_ID = ${patientId}`);

    krankenhaus_id = 1;

    // Ermitteln der genug qualifizierten Mitarbeiter
    const mitarberbeiternr = await executeSqlCommand(
        `
        SELECT KP.MITARBEITER_NR
        FROM KRANKENPFLEGER KP
        JOIN PATIENT P ON kp.krankenhaus_id = ${krankenhaus_id}
        WHERE berechtigungen >= ${addTherapieForm.therapieBerechtigung.value}
        AND p.patienten_id = ${patientId}
        ORDER BY DBMS_RANDOM.RANDOM
        FETCH FIRST ${addTherapieForm.therapieAnzahlPersonal.value} ROWS ONLY`
        
    );

    // Einfügen des Datensatzes in die Datenbank und Zurücklieferung der erstellten neuen ID
    const response = await fetch('/sql/therapie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bezeichnung: `${addTherapieForm.therapieBezeichnung.value}`,
            info: `${addTherapieForm.therapieInfo.value}`,
            startzeitpunkt: `${addTherapieForm.therapieStartZeit.value} 00:00:00`,
            berechtigungsstufe: `${addTherapieForm.therapieBerechtigung.value}`,
            endzeitpunkt: `${addTherapieForm.therapieEndZeit.value} 00:00:00`
        }),
    });

    var behandlungs_id = await response.json();
    behandlungs_id = behandlungs_id.behandlungsId;

    
    
    
    // Eintragen der MitarbeiterIDs und der BehandlungsID in Zwischentabelle
    mitarberbeiternr.forEach(element => {
        executeSqlCommand(`
        BEGIN
        INSERT INTO "MIPM"."KRANKENPFLEGER_THERAPIE" (BEHANDLUNGS_ID, MITARBEITER_NR) 
        VALUES (${behandlungs_id}, ${element.MITARBEITER_NR});
        COMMIT;
        END;
        `);
    }
    );

    // Eintragen der BEHANDLUNGS_ID und der DIAGNOSE_ID in die entsprechende Zwischentabelle
    executeSqlCommand(`
    BEGIN
    INSERT INTO "MIPM"."THERAPIE_DIAGNOSE" (BEHANDLUNGS_ID, DIAGNOSE_ID)
    VALUES (${behandlungs_id}, ${addTherapieForm.therapieDiagnoseId.value});
    COMMIT;
    END;
    `)

});



function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - new Date(birthday).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

async function createPatientDiagnosesTable() {
    console.log(patientId);
    var result = await executeSqlCommand(
    `SELECT 
    D.DIAGNOSE_ID,
    D.MITARBEITER_NR,
    A.NAME || ', ' || A.VORNAME AS "DIAGNOSTIZIERENDER ARZT",
    SUBSTR(D.DIAGNOSE_DATUM ,0,8) AS DIAGNOSEDATUM,
    D.BESCHREIBUNG,
    CASE
        WHEN D.STATUS = 0 THEN 'Treatment Completed'
        WHEN D.STATUS = 1 THEN 'No Treatment'
        WHEN D.STATUS = 2 THEN 'Treatment in Progress'
    END AS Diagnosestatus,
    LISTAGG(O.BEHANDLUNGS_ID, ', ') WITHIN GROUP (ORDER BY O.BEHANDLUNGS_ID) AS OPERATIONEN,
    LISTAGG(DISTINCT T.BEHANDLUNGS_ID, ', ') WITHIN GROUP (ORDER BY T.BEHANDLUNGS_ID) AS THERAPIEN
FROM
    DIAGNOSE D
JOIN
    ARZT A ON D.MITARBEITER_NR = A.MITARBEITER_NR
LEFT JOIN
    OPERATION_DIAGNOSE R ON D.DIAGNOSE_ID = R.DIAGNOSE_ID
LEFT JOIN
    OPERATION O ON R.BEHANDLUNGS_ID = O.BEHANDLUNGS_ID
LEFT JOIN
    THERAPIE_DIAGNOSE TD ON D.DIAGNOSE_ID = TD.DIAGNOSE_ID
LEFT JOIN
    THERAPIE T ON TD.BEHANDLUNGS_ID = T.BEHANDLUNGS_ID
WHERE 
    D.PATIENTEN_ID = ${patientId}
GROUP BY
    D.DIAGNOSE_ID,
    D.MITARBEITER_NR,
    A.NAME,
    A.VORNAME,
    D.DIAGNOSE_DATUM,
    D.BESCHREIBUNG,
    D.STATUS
    `
    )

    constructTable(result, 'patientenDiagnoses-table');
}

async function createPatientDetailsTable() {
    var result = await executeSqlCommand(
        `SELECT 
        P.PATIENTEN_ID, 
        P.NAME, 
        K.NAME AS KRANKENHAUSNAME,  -- Hier wird der Name des Krankenhauses angezeigt
        PR.RAUM_NR AS PATIENTENRAUM, 
        SUBSTR(P.AUFNAHME_DATUM, 0, 8) AS AUFNAHMEDATUM, 
        SUBSTR(P.ENTLASSUNGS_DATUM, 0, 8) AS ENTLASSUNGSDATUM, 
        SUBSTR(P.GEBURTSDATUM, 0, 8) AS GEBURTSDATUM, 
        CASE
            WHEN P.GESCHLECHT = 1 THEN 'Weiblich'
            WHEN P.GESCHLECHT = 0 THEN 'Männlich'
            WHEN P.GESCHLECHT = 2 THEN 'Divers'
            ELSE 'Unbekannt'
        END AS GESCHLECHT,
        P.BLUTGRUPPE
        FROM 
            MIPM.PATIENT P
        JOIN
            MIPM.KRANKENHAUS K ON P.KRANKENHAUS_ID = K.KRANKENHAUS_ID
        JOIN
            MIPM.PATIENTENRAUM PR ON P.PATIENTENRAUM_ID = PR.PATIENTENRAUM_ID
        WHERE 
            P.PATIENTEN_ID = ${patientId}`
    )

    constructTable(result, 'patientenDetails-table');
}

// Patientdetailsclose

patientDetailsCloseButton = document.querySelector('#patientenDetailsTab .wrapper .closeButton');
patientDetailsCloseButton.addEventListener('click', () => {
    showElementByIdDisplay('patiententab', 'flex');
    hideElementById('patientenDetailsTab');
});

// Patientendiagnosesclose
addDiagnosisPopupCloseButton = document.querySelector('#addDiagnosisPopup .closeButton');
addDiagnosisPopupCloseButton.addEventListener('click', () => {
    hideElementById('addDiagnosisPopup');
});

// PatientenaddDiagnoses
addDiagnosisForm = document.getElementById('addDiagnosis-form');
addDiagnosisForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const query = `BEGIN
    INSERT INTO "MIPM"."DIAGNOSE" (MITARBEITER_NR, DIAGNOSE_DATUM, BESCHREIBUNG, STATUS, PATIENTEN_ID) 
    VALUES (
       '${addDiagnosisForm.diagnosisMitarbeiterNr.value}',
       TO_DATE('${addDiagnosisForm.diagnosisdate.value} 00:00:00', 'YYYY-MM-DD HH24:MI:SS'),
       '${addDiagnosisForm.diagnosisdescription.value}',
       '1',
       '${patientId}');
       COMMIT;
       END;`;
                   
    console.log(query);
    executeSqlCommand(query);
    createPatientDiagnosesTable();
    addDiagnosisForm.reset();
});


// Patientendiagnoseopen
openAddPatientButton = document.querySelector('#patientenDetailsTab .wrapper .h2row button:nth-of-type(1)');
openAddPatientButton.addEventListener('click', () => {
    showElementByIdDisplay('addDiagnosisPopup', 'flex');
});

// Refresh Patientendiagnose
refreshDiagnosesButton = document.querySelector('#patientenDetailsTab .wrapper .h2row button:nth-of-type(2)');
refreshDiagnosesButton.addEventListener('click', () => {
    createPatientDiagnosesTable();
});

// Behandlungpopup open
openAddTreatmentButton = document.getElementById('addTreatmentButton');
openAddTreatmentButton.addEventListener('click', () => {
    showElementByIdDisplay('addTreatmentPopup', 'flex');
});

// closeAddTreatmentButton = document.querySelector('#addTreatmentPopup .wrapper .closeButtonContainer .closeButton');
closeAddTreatmentButton = document.getElementById('closeTreatmentPopup');
closeAddTreatmentButton.addEventListener('click', () => {
    hideElementById('addTreatmentPopup');
});

// Toggle Treatment
toggleTreatmentButton = document.getElementById('toggleAddTreatment');
toggleTreatmentButton.addEventListener('click', () => {
    if (toggleTreatmentButton.textContent === 'Operation') {
        toggleTreatmentButton.textContent = 'Therapie';
        showElementById('addOperationDiv');
        hideElementById('addTherapieDiv');
    } else {
        toggleTreatmentButton.textContent = 'Operation';
        showElementById('addTherapieDiv');
        hideElementById('addOperationDiv');
    }
});

// Refresh Behandlung
refreshTreatmentButton = document.getElementById('refreshTreatmentButton');


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