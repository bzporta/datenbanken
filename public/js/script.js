

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
    // showSinglePage('login-page');
    showSinglePage('home-page');
    setupHomePage();
}

function setupHomePage() {
    createTabButtons = document.querySelectorAll('.createTableButton');
    createTabForms   = document.querySelectorAll('.createTabForm');
    createTabButtons.forEach(button => {
        button.click();
    });
    setupPatientsTable();
    setupStationsTable();
    
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


    if (result.length > 0 ) {
        document.getElementById('login-error').classList.add('hidden');
        showSinglePage('home-page');
        setupHomePage();
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
    loginForm.reset();
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    var benutzername = registerForm.username.value;
    var passwort = registerForm.password.value;

    const preCheck = await executeSqlCommand(`
    SELECT BENUTZERNAME
    FROM BENUTZER
    WHERE BENUTZERNAME = '${benutzername}'
    `);

    
    if(preCheck.length > 0){
        document.getElementById('register-error').classList.remove('hidden');
        registerForm.reset();
    }
    else{
        document.getElementById('register-error').classList.add('hidden');
        loginLink.click();
        registerForm.reset();
        const result = await executeSqlCommand(`
        BEGIN
        INSERT INTO BENUTZER (BENUTZERNAME, PASSWORT)
        VALUES ('${benutzername}', '${passwort}');
        COMMIT;
        END;
        `);

    }
    
});



registerLink.onclick = () => {
    wrapper.classList.add('active');
    showElement('.form-box.register');
    hideElement('.form-box.login');
    document.getElementById('register-error').classList.add('hidden');
    loginForm.reset();
};

loginLink.onclick = () => {
    // wrapper.classList.remove('active');
    showElement('.form-box.login');
    hideElement('.form-box.register');
    document.getElementById('login-error').classList.add('hidden');
    registerForm.reset();
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

// // Treatment

// treatmentTabButtonTherapie = document.getElementById('therapie-tab-button2');
// treatmentTabButtonOperation = document.getElementById('operation-tab-button');
// treatmentTabButtonTherapie.addEventListener('click', (e) => {
//     e.preventDefault();
//     showElementById('therapietab');
//     hideElementById('operationstab');
// });

// treatmentTabButtonOperation.addEventListener('click', (e) => {
//     e.preventDefault();
//     showElementById('operationstab');
//     hideElementById('therapietab');
// });

// Stations

// Station Add Form
stationAddForm = document.getElementById('add-station-form');
stationAddForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const query = `BEGIN
    INSERT INTO "MIPM"."STATION" (KRANKENHAUS_ID, STATIONS_NAME, NOTFALLSTATION) 
    VALUES (
            '${stationAddForm.stationKrankenhausId.value}',
            '${stationAddForm.stationsName.value}',
            '${stationAddForm.notfallstation.value}');
            COMMIT;
            END;`;              
    executeSqlCommand(query);
    setupStationsTable();
    stationAddForm.reset();
});


// Stations Createtable form
stationCreateTableForm = document.getElementById('createStationsTableForm');
stationCreateTableForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    var result = await executeSqlCommand(
        `SELECT 
        K.NAME AS KRANKENHAUSNAME,
        STATIONS_NAME,
        STATIONS_ID,
        CASE
            WHEN NOTFALLSTATION = 1 THEN 'Ja'
            WHEN NOTFALLSTATION = 0 THEN 'Nein'
        END AS NOTFALLSTATION
        FROM "MIPM"."STATION"
        JOIN "MIPM"."KRANKENHAUS" K ON STATION.KRANKENHAUS_ID = K.KRANKENHAUS_ID
        ORDER BY "MIPM"."STATION".${stationCreateTableForm.stationsOrderBy.value}`
    )
    constructTable(result, 'stations-table');
});

// Stations Delete form
deleteStationForm = document.getElementById('stationsDeleteForm');
deleteStationForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    var result = await executeSqlCommand(
        `BEGIN
        DELETE FROM "MIPM"."STATION" WHERE STATIONS_ID = ${deleteStationForm.stationIdDelete.value};
        COMMIT;
        END;`
    )
    constructTable(result, 'stations-table');
    deleteStationForm.reset();
});

// Show Rooms in a Station
showStationForm = document.getElementById('stationsauswahlform');
showStationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    var result = await executeSqlCommand(
        `SELECT *
        FROM "MIPM". ${showStationForm.raumartauswahl.value}
        WHERE STATIONS_ID = ${showStationForm.chooseStationId.value}
        `
    )
    constructTable(result, 'stationsraeume-table');
});

// Show Roomsdetails (kalender)
showRoomDetailsForm = document.getElementById('raumauswahlform');
showRoomDetailsForm.addEventListener('submit', async (e) => {
    e.preventDefault();


    const kalenderraumartauswahlValue = showRoomDetailsForm.kalenderraumartauswahl.value;

    if (kalenderraumartauswahlValue === "OPERATIONSSAAL") {
        result = await executeSqlCommand(
            `
            SELECT * 
            FROM "MIPM"."OPERATION"
            WHERE OPERATIONSSAAL_ID = ${showRoomDetailsForm.kalenderchooseRaumId.value}
            `
        );
    } 
    else if (kalenderraumartauswahlValue === "LAGERRAUM") {
        var result = await executeSqlCommand(
            `
            SELECT *
            FROM "MIPM"."MEDIKAMENT"
            WHERE LAGERRAUM_ID = ${showRoomDetailsForm.kalenderchooseRaumId.value}
            `
        );
    } 
    else if (kalenderraumartauswahlValue === "PATIENTENRAUM") {
        var result = await executeSqlCommand(
        `
        SELECT
            TD.BEHANDLUNGS_ID,
            TD.DIAGNOSE_ID,
            T.BEZEICHNUNG,
            T.INFO,
            T.STARTZEITPUNKT,
            T.ENDZEITPUNKT,
            P.NAME,
            PR.PATIENTENRAUM_ID
        FROM
            THERAPIE_DIAGNOSE TD
        JOIN
            THERAPIE T ON TD.BEHANDLUNGS_ID = T.BEHANDLUNGS_ID
        JOIN
            DIAGNOSE D ON TD.DIAGNOSE_ID = D.DIAGNOSE_ID
        JOIN
            PATIENT P ON D.PATIENTEN_ID = P.PATIENTEN_ID
        JOIN
            PATIENTENRAUM PR ON P.PATIENTENRAUM_ID = PR.PATIENTENRAUM_ID
        WHERE
            PR.PATIENTENRAUM_ID = ${showRoomDetailsForm.kalenderchooseRaumId.value}
        `
        );
    }
    
            
    

    // var result = await executeSqlCommand(
    //     `
    //     SELECT *
    //     FROM "MIPM".${showRoomDetailsForm.kalenderraumartauswahl.value}
    //     WHERE ${showRoomDetailsForm.kalenderauswahl.value} = ${showRoomDetailsForm.chooseRoomId.value}
    //     `
    // )
    constructTable(result, 'raumKalender-table');

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
    // var result = await executeSqlCommand(
        // `
        // CREATE VIEW meine_view AS
        // SELECT PATIENT.PATIENTEN_ID, 
        // K.NAME AS KRANKENHAUSNAME, 
        // S.STATIONS_NAME || '-' || PATIENT.PATIENTENRAUM_ID AS PATIENTENRAUM, 
        // PATIENT.NAME, 
        // SUBSTR(AUFNAHME_DATUM ,0,8) AS AUFNAHMEDATUM, 
        // SUBSTR(ENTLASSUNGS_DATUM ,0,8) AS ENTLASSUNGSDATUM, 
        // CASE
        //     WHEN GESCHLECHT = 1 THEN 'Weiblich'
        //     WHEN GESCHLECHT = 0 THEN 'Männlich'
        //     WHEN GESCHLECHT = 2 THEN 'Divers'
        //     ELSE 'Unbekannt'
        // END AS GESCHLECHT,
        // SUBSTR(GEBURTSDATUM ,0,8) AS GEBURTSDATUM, 
        // BLUTGRUPPE
        // FROM "MIPM"."PATIENT"
        // JOIN "MIPM"."KRANKENHAUS" K ON PATIENT.KRANKENHAUS_ID = K.KRANKENHAUS_ID
        // JOIN "MIPM"."PATIENTENRAUM" PR ON PATIENT.PATIENTENRAUM_ID = PR.PATIENTENRAUM_ID
        // JOIN "MIPM"."STATION" S ON PR.STATIONS_ID = S.STATIONS_ID
        // `
    // )
    var result = await executeSqlCommand(
        `SELECT * 
        FROM SHOW_PATIENTS_TABLE_VIEW`
    )
    constructTable(result, 'patienten-table');
}

async function setupStationsTable() {
    var result = await executeSqlCommand(
        `SELECT 
        K.NAME AS KRANKENHAUSNAME,
        STATIONS_NAME,
        STATIONS_ID,
        CASE
            WHEN NOTFALLSTATION = 1 THEN 'Ja'
            WHEN NOTFALLSTATION = 0 THEN 'Nein'
        END AS NOTFALLSTATION
        FROM "MIPM"."STATION"
        JOIN "MIPM"."KRANKENHAUS" K ON STATION.KRANKENHAUS_ID = K.KRANKENHAUS_ID
        ORDER BY "MIPM"."STATION".${stationCreateTableForm.stationsOrderBy.value}`
    )

    constructTable(result, 'stations-table');
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
    showElementByIdDisplay('patientenBehandlung-table', 'table');
});

// Delete Patient Treatment
deleteTreatmentForm = document.getElementById('deleteTreatment-form');
deleteTreatmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const result = await executeSqlCommand(
        `BEGIN
        DELETE FROM "MIPM"."${deleteTreatmentForm.behandlungstypauswahldelete.value}" WHERE BEHANDLUNGS_ID = ${deleteTreatmentForm.deleteTreatmentId.value};
        COMMIT;
        END;`
    );
    constructTable(result, 'patientenBehandlung-table');
    deleteTreatmentForm.reset();
});


// Add Patient Treatment

// addTreatmentForm = document.getElementById('addTreatment-form');
// addTreatmentForm.addEventListener('submit', (e) => {

addTherapieForm = document.getElementById('addTherapie-form');
addTherapieForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // const krankenhaus_id = await executeSqlCommand(`SELECT KRANKENHAUS_ID FROM PATIENT WHERE PATIENTEN_ID = ${patientId}`);

    krankenhaus_id = 1;

    hideElementById('addTreatmentPopup');

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

addOperationForm = document.getElementById('addOperation-form');
addOperationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

   
    console.log(addOperationForm.operationEndzeit.value);

    const response = await fetch('/sql/operation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            operationssaal_id: ``,
            bezeichnung: `${addOperationForm.operationBezeichnung.value}`,
            info: `${addOperationForm.operationInfo.value} 00:00:00`,
            endzeit: `${addOperationForm.operationEndzeit.value}`,
            fachrichtung: `${addOperationForm.operationFachrichtung.value} 00:00:00`,
            startzeit: `${addOperationForm.operationStartzeit.value}`,
        }),
    });
});

//YYYY-MM-DD HH24:MI:SS

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
        `
        SELECT *
        FROM SHOW_PATIENTS_TABLE_VIEW
        WHERE 
            PATIENTEN_ID = ${patientId}`

    )

    constructTable(result, 'patientenDetails-table');
}

// Patientdetailsclose

patientDetailsCloseButton = document.querySelector('#patientenDetailsTab .wrapper .closeButton');
patientDetailsCloseButton.addEventListener('click', () => {
    showElementByIdDisplay('patiententab', 'flex');
    hideElementById('patientenDetailsTab');
    hideElementById('patientenBehandlung-table');
});

// Patientendiagnosesclose
// addDiagnosisPopupCloseButton = document.querySelector('#addDiagnosisPopup .closeButton');
// addDiagnosisPopupCloseButton.addEventListener('click', () => {
//     hideElementById('addDiagnosisPopup');
// });

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

// Delete Treatment
openDeleteTreatmentButton = document.getElementById('deleteTreatmentButton');
openDeleteTreatmentButton.addEventListener('click', () => {
    showElementByIdDisplay('deleteTreatmentPopup', 'flex');
});

// deleteTreatmentCloseButton = document.querySelector('#deleteTreatmentPopup .closeButton');
// deleteTreatmentCloseButton.addEventListener('click', () => {
//     hideElementById('deleteTreatmentPopup');
// });

// closeAddTreatmentButton = document.querySelector('#addTreatmentPopup .wrapper .closeButtonContainer .closeButton');
// closeAddTreatmentButton = document.getElementById('closeTreatmentPopup');
// closeAddTreatmentButton.addEventListener('click', () => {
//     hideElementById('addTreatmentPopup');
// });

closePopupButtons = document.querySelectorAll('.closeButton');
closePopupButtons.forEach(button => {
    button.addEventListener('click', () => {
        // var popup = this.parentElement.parentElement.parentElement;
        var popup = button.closest('.popup')
        if (popup) popup.style.display = 'none';
    });
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





init();