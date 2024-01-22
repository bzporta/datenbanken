

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
var personnelId;

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
    INSERT INTO "MIPM"."STATION" (STATIONS_NAME, KRANKENHAUS_ID, NOTFALLSTATION) 
    VALUES (
            '${stationAddForm.stationsName.value}',
            '${stationAddForm.stationKrankenhausId.value}',
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
    var result;

    if (showStationForm.raumartauswahl.value == "OPERATIONSSAAL") {
        result = await executeSqlCommand(
            `SELECT *
            FROM "MIPM". "OPERATIONSSAAL"
            WHERE STATIONS_ID = ${showStationForm.chooseStationId.value}
            `
        );
    }
    else if (showStationForm.raumartauswahl.value == "LAGERRAUM") {
        result = await executeSqlCommand(
            `SELECT *
            FROM "MIPM". "LAGERRAUM"
            WHERE STATIONS_ID = ${showStationForm.chooseStationId.value}
            `
        );
    }
    else if (showStationForm.raumartauswahl.value == "PATIENTENRAUM") {
        result = await executeSqlCommand(
            `SELECT p.patientenraum_id,
            p.bettkapazitaet,
            p.bettkapazitaet - COUNT(pa.patienten_id) AS Freie_Betten
            FROM PATIENTENRAUM p
            LEFT JOIN PATIENT pa ON p.patientenraum_id = pa.patientenraum_id
            WHERE p.stations_id = ${showStationForm.chooseStationId.value}
            GROUP BY
            p.patientenraum_id, p.bettkapazitaet
            `
        );
    }
    
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
            SUBSTR(T.STARTZEITPUNKT ,0,8) AS STARTZEITPUNKT,
            SUBSTR(T.ENDZEITPUNKT, 0, 8) AS ENDZEITPUNKT,
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
    var result = await executeSqlCommand(
        `
        
        SELECT PATIENT.PATIENTEN_ID, 
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
    );

    console.log(result);
    // var result = await executeSqlCommand(
    //     `SELECT * 
    //     FROM SHOW_PATIENTS_TABLE_VIEW`
    // )
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

// deletePatientForm = document.querySelector('#patiententab .wrapper form:nth-of-type(2)');
// deletePatientForm.addEventListener('submit', (e) => {
//     e.preventDefault();
    
//     const query = `BEGIN
//     DELETE FROM "MIPM"."
//     DELETE FROM "MIPM"."DIAGNOSE" WHERE PATIENTEN_ID = ${deletePatientForm.patientendelete.value};
//     DELETE FROM "MIPM"."PATIENT" WHERE PATIENTEN_ID = ${deletePatientForm.patientendelete.value};
//     COMMIT;
//     END;`;
    
//     executeSqlCommand(query);
//     patientCreateTableButton.click();
//     deletePatientForm.reset();
// });

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

// Change Patient
changePatientForm = document.getElementById('changePatientForm');
changePatientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const result = await executeSqlCommand(`
    BEGIN
    UPDATE "MIPM"."PATIENT" SET KRANKENHAUS_ID = ${changePatientForm.newKrankenhausId.value} WHERE PATIENTEN_ID = ${changePatientForm.changePatientId.value};
    UPDATE "MIPM"."PATIENT" SET PATIENTENRAUM_ID = ${changePatientForm.newRaumId.value} WHERE PATIENTEN_ID = ${changePatientForm.changePatientId.value};
    COMMIT;
    END;
    `);

});

// Change Patient Entlassungsdatum
changePatientEntlassungsdatumForm = document.getElementById('changePatientEntlassungForm');
changePatientEntlassungsdatumForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(changePatientEntlassungsdatumForm.newPatientenentlassungsdatum.value);
    executeSqlCommand(`
    BEGIN
    UPDATE "MIPM"."PATIENT" SET ENTLASSUNGS_DATUM = TO_DATE('${changePatientEntlassungsdatumForm.newPatientenentlassungsdatum.value} 00:00:00', 'YYYY-MM-DD HH24:MI:SS') 
    WHERE PATIENTEN_ID = ${changePatientEntlassungsdatumForm.changePatientEntlassungId.value};
    COMMIT;
    END;
    `);

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
    

    let startzeit = addOperationForm.operationStartzeit.value;
    startzeit = startzeit.split('T');
    startzeit = startzeit[1].replace(':', '.');

    let endzeit = addOperationForm.operationEndzeit.value;
    endzeit = endzeit.split('T');
    endzeit = endzeit[1].replace(':', '.');

    let result = null;
    console.log(addOperationForm.operationKrankenhaus.value);
    if (addOperationForm.operationKrankenhaus.value == "1"){
        // Ermittelt den Operationssaal, der zu einer bestimmten Zeitspanne frei ist, im richtigen Krankenhaus (des Patienten) liegt und genug Kapazität hat
        result = await executeSqlCommand(`
        SELECT OS.OPERATIONSSAAL_ID
        FROM OPERATIONSSAAL OS
        JOIN STATION S ON S.STATIONS_ID = OS.STATIONS_ID
        JOIN PATIENT P ON P.KRANKENHAUS_ID = S.KRANKENHAUS_ID
        LEFT JOIN OPERATION OP ON OS.OPERATIONSSAAL_ID = OP.OPERATIONSSAAL_ID
        WHERE OS.OEFFNUNGSZEIT <= ${startzeit}
            AND OS.SCHLIESSUNGSZEIT >= ${endzeit}
            AND (OP.STARTZEIT IS NULL OR (OP.ENDZEIT <= TO_DATE('${addOperationForm.operationStartzeit.value}', 'YYYY-MM-DD"T"HH24:MI:SS') OR OP.STARTZEIT >= TO_DATE('${addOperationForm.operationEndzeit.value}', 'YYYY-MM-DD"T"HH24:MI:SS')))
            AND os.personenkapazitaet >= ${addOperationForm.operationPersonenanzahl.value}
        `
        );
    }
    else {
        result = await executeSqlCommand(`
        SELECT OS.OPERATIONSSAAL_ID
        FROM OPERATIONSSAAL OS
        JOIN STATION S ON S.STATIONS_ID = OS.STATIONS_ID
        JOIN PATIENT P ON P.KRANKENHAUS_ID = S.KRANKENHAUS_ID
        LEFT JOIN OPERATION OP ON OS.OPERATIONSSAAL_ID = OP.OPERATIONSSAAL_ID
        WHERE OS.OEFFNUNGSZEIT <= ${startzeit}
            AND OS.SCHLIESSUNGSZEIT >= ${endzeit}
            AND P.PATIENTEN_ID = ${patientId}
            AND (OP.STARTZEIT IS NULL OR (OP.ENDZEIT <= TO_DATE('${addOperationForm.operationStartzeit.value}', 'YYYY-MM-DD"T"HH24:MI:SS') OR OP.STARTZEIT >= TO_DATE('${addOperationForm.operationEndzeit.value}', 'YYYY-MM-DD"T"HH24:MI:SS')))
            AND os.personenkapazitaet >= ${addOperationForm.operationPersonenanzahl.value}
        `
        );
    }

    const operationssaal_id = result[0].OPERATIONSSAAL_ID;
    console.log(operationssaal_id);


    const response = await fetch('/sql/operation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            operationssaal_id: operationssaal_id,
            bezeichnung: `${addOperationForm.operationBezeichnung.value}`,
            info: `${addOperationForm.operationInfo.value}`,
            endzeit: `${addOperationForm.operationEndzeit.value}`,
            fachrichtung: `${addOperationForm.operationFachrichtung.value}`,
            startzeit: `${addOperationForm.operationStartzeit.value}`,
        }),
    });

    var behandlungs_id = await response.json();
    behandlungs_id = behandlungs_id.behandlungsId;
    
    executeSqlCommand(
    `
    BEGIN
    INSERT INTO "MIPM"."OPERATION_DIAGNOSE" (BEHANDLUNGS_ID, DIAGNOSE_ID) VALUES (${behandlungs_id}, ${addOperationForm.operationDiagnoseId.value});
    COMMIT;
    END;
    ` 
    );

    let passender_Arzt = null;
    console.log(addOperationForm.operationKrankenhaus.value);
    if (addOperationForm.operationKrankenhaus.value === "1"){
        passender_Arzt = await executeSqlCommand(
            `
            SELECT DISTINCT A.MITARBEITER_NR
            FROM ARZT A
            JOIN STATION S ON A.KRANKENHAUS_ID = S.KRANKENHAUS_ID
            JOIN PATIENT P ON P.KRANKENHAUS_ID = S.KRANKENHAUS_ID
            LEFT JOIN ARZT_OPERATION AO ON A.MITARBEITER_NR = AO.MITARBEITER_NR
            LEFT JOIN OPERATION OP ON AO.BEHANDLUNGS_ID = OP.BEHANDLUNGS_ID 
            AND  (OP.STARTZEIT BETWEEN TO_DATE('${addOperationForm.operationStartzeit.value}', 'YYYY-MM-DD"T"HH24:MI:SS') AND TO_DATE('${addOperationForm.operationEndzeit.value}', 'YYYY-MM-DD"T"HH24:MI:SS') 
            OR OP.ENDZEIT BETWEEN TO_DATE('${addOperationForm.operationStartzeit.value}', 'YYYY-MM-DD"T"HH24:MI:SS') AND TO_DATE('${addOperationForm.operationEndzeit.value}', 'YYYY-MM-DD"T"HH24:MI:SS'))
            WHERE A.ARBEITSBEGINN <= ${startzeit}
                AND A.FACHRICHTUNG = '${addOperationForm.operationFachrichtung.value}'
                AND A.ARBEITSENDE >= ${endzeit}
                AND AO.MITARBEITER_NR IS NULL
            `
        );
    }
    else {
        passender_Arzt = await executeSqlCommand(
            `
            SELECT DISTINCT A.MITARBEITER_NR
            FROM ARZT A
            JOIN STATION S ON A.KRANKENHAUS_ID = S.KRANKENHAUS_ID
            JOIN PATIENT P ON P.KRANKENHAUS_ID = S.KRANKENHAUS_ID
            LEFT JOIN ARZT_OPERATION AO ON A.MITARBEITER_NR = AO.MITARBEITER_NR
            LEFT JOIN OPERATION OP ON AO.BEHANDLUNGS_ID = OP.BEHANDLUNGS_ID 
            AND  (OP.STARTZEIT BETWEEN TO_DATE('${addOperationForm.operationStartzeit.value}', 'YYYY-MM-DD"T"HH24:MI:SS') AND TO_DATE('${addOperationForm.operationEndzeit.value}', 'YYYY-MM-DD"T"HH24:MI:SS') 
            OR OP.ENDZEIT BETWEEN TO_DATE('${addOperationForm.operationStartzeit.value}', 'YYYY-MM-DD"T"HH24:MI:SS') AND TO_DATE('${addOperationForm.operationEndzeit.value}', 'YYYY-MM-DD"T"HH24:MI:SS'))
            WHERE A.ARBEITSBEGINN <= ${startzeit}
                AND A.FACHRICHTUNG = '${addOperationForm.operationFachrichtung.value}'
                AND A.ARBEITSENDE >= ${endzeit}
                AND P.PATIENTEN_ID = ${patientId}
                AND AO.MITARBEITER_NR IS NULL
            `
        );
    }


    const mitarbeiter_nr = passender_Arzt[0].MITARBEITER_NR;

    console.log("MitarbeiterNr", mitarbeiter_nr);

    executeSqlCommand(
        `
        BEGIN
        INSERT INTO "MIPM"."ARZT_OPERATION" (BEHANDLUNGS_ID, MITARBEITER_NR) VALUES (${behandlungs_id}, ${mitarbeiter_nr});
        COMMIT;
        END;
        ` 
        );

        addOperationForm.reset();
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
        WHEN D.STATUS = 1 THEN 'Problem not solved'
    END AS Diagnosestatus,
    LISTAGG(DISTINCT O.BEHANDLUNGS_ID, ', ') WITHIN GROUP (ORDER BY O.BEHANDLUNGS_ID) AS OPERATIONEN,
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

// // Switch to personnel Details
// showDetailsForm = document.getElementById('personalAuswahlform');
// showDetailsForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     personnelId = showDetailsForm.choosePersonnelId.value;



//     // createPersonnelDetailsTable();
// });


// Versicherung und Rechnung
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
    var query = `SELECT RECHNUNGS_NR, PATIENTEN_ID, BETRIEBSNUMMER, BETRAG, ZUZAHLUNG, SUBSTR(AUSSTELLUNGS_DATUM ,0,8) AS AUSSTELLUNGSDATUM, SUBSTR(FAELLIGKEITS_DATUM ,0,8) AS FÄLLIGKEITSDATUM, STATUS FROM RECHNUNG`;

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

/* HTML zu Versicherung und Rechnung

                        <form action="" id="versicherung-form-add">
                            <div>
                                <input type="text" id="betriebsnummer" name="betriebsnummer" placeholder="Betriebsnummer" required>
                            </div>
                            <div>
                                <input type="text" id="versicherungsname" name="versicherungsname" placeholder="Versicherungsname" required>
                            </div>
                            <button type="submit" class="btn">Add Versicherung</button>
                        </form>

                        <form action="" id="versicherung-form-add-patient">
                            <div>
                                <input type="text" id="patientenid" name="patientenid" placeholder="Patienten_ID" required>
                            </div>
                            <div>
                                <input type="text" id="betriebsnummer" name="betriebsnummer" placeholder="Betriebsnummer" required>
                            </div>
                            <div>
                                <input type="text" id="versicherungsnummer" name="versicherungsnummer" placeholder="Versicherungsnummer" required>
                            </div>
                            <button type="submit" class="btn">Add Versicherung to Patient</button>
                        </form>

                        <form action="" id="versicherung-form-remove">
                            <div>
                                <input type="text" id="patientenid" name="patientenid" placeholder="Patienten_ID" required>
                            </div>
                            <div>
                                <input type="text" id="betriebsnummer" name="betriebsnummer" placeholder="Betriebsnummer" required>
                            </div>
                            <button type="submit" class="btn">Remove Versicherung</button>
                        </form>

                        <form action="" id="versicherung-form-update">
                            <div>
                                <input type="text" id="betriebsnummer" name="betriebsnummer" placeholder="Betriebsnummer" required>
                            </div>
                            <div>
                                <input type="text" id="versicherungsname" name="versicherungsname" placeholder="neuer Versicherungsname" required>
                            </div>
                            <button type="submit" class="btn">Update Versicherung</button>
                        </form>

                        <form action="" id="versicherung-form-read">
                            <div>
                                <input type="text" id="patientenid" name="patientenid" placeholder="Patienten_ID">
                            </div>
                            <div>
                                <input type="text" id="betriebsnummer" name="betriebsnummer" placeholder="Betriebsnummer">
                            </div>
                            <div>
                                <input type="text" id="versicherungsname" name="versicherungsname" placeholder="Versicherungsname">
                            </div>
                            <button type="submit" class="btn">Search Versicherung</button>
                        </form>

                        <form action="" id="versicherung-form-del">
                            <div>
                                <input type="text" id="betriebsnummer" name="betriebsnummer" placeholder="Betriebsnummer" required>
                            </div>
                            <button type="submit" class="btn">Delete Versicherung</button>
                        </form>

                        <form action="" id="rechnung-form-add">
                            <div>
                                <input type="text" id="patientenid" name="patientenid" placeholder="Patienten_ID" required>
                            </div>
                            <div>
                                <input type="text" id="betriebsnummer" name="betriebsnummer" placeholder="Betriebsnummer" required>
                            </div>
                            <div>
                                <input type="text" id="betrag" name="betrag" placeholder="Betrag" required>
                            </div>
                            <div>
                                <input type="text" id="zuzahlung" name="zuzahlung" placeholder="Zuzahlung" required>
                            </div>
                            <div>
                                <input type="text" id="ausstellungs_datum" name="ausstellungs_datum" placeholder="Ausstellungsdatum" required>
                            </div>
                            <div>
                                <input type="text" id="faelligkeits_datum" name="faelligkeits_datum" placeholder="Fälligkeitsdatum" required>
                            </div>
                            <button type="submit" class="btn">Add Rechnung</button>
                        </form>

                        <form action="" id="rechnung-form-update">
                            <div>
                                <input type="text" id="rechnungsnr" name="rechnungsnr" placeholder="Rechnungs_Nr" required>
                            </div>
                            <div>
                                <input type="text" id="patientenid" name="patientenid" placeholder="Patienten_ID">
                            </div>
                            <div>
                                <input type="text" id="betriebsnummer" name="betriebsnummer" placeholder="Betriebsnummer">
                            </div>
                            <div>
                                <input type="text" id="betrag" name="betrag" placeholder="Betrag">
                            </div>
                            <div>
                                <input type="text" id="zuzahlung" name="zuzahlung" placeholder="Zuzahlung">
                            </div>
                            <div>
                                <input type="text" id="ausstellungs_datum" name="ausstellungs_datum" placeholder="Ausstellungsdatum">
                            </div>
                            <div>
                                <input type="text" id="faelligkeits_datum" name="faelligkeits_datum" placeholder="Fälligkeitsdatum">
                            </div>
                            <div>
                                <input type="text" id="status" name="status" placeholder="Status">
                            </div>
                            <button type="submit" class="btn">Update Rechnung</button>
                        </form>

                        <form action="" id="rechnung-form-read">
                            <div>
                                <input type="text" id="rechnungsnr" name="rechnungsnr" placeholder="Rechnung_Nr">
                            </div>
                            <div>
                                <input type="text" id="patientenid" name="patientenid" placeholder="Patienten_ID">
                            </div>
                            <div>
                                <input type="text" id="betriebsnummer" name="betriebsnummer" placeholder="Betriebsnummer">
                            </div>
                            <div>
                                <input type="text" id="betrag" name="betrag" placeholder="Betrag">
                            </div>
                            <div>
                                <input type="text" id="zuzahlung" name="zuzahlung" placeholder="Zuzahlung">
                            </div>
                            <div>
                                <input type="text" id="ausstellungs_datum" name="ausstellungs_datum" placeholder="Ausstellungsdatum">
                            </div>
                            <div>
                                <input type="text" id="faelligkeits_datum" name="faelligkeits_datum" placeholder="Fälligkeitsdatum">
                            </div>
                            <button type="submit" class="btn">Search Rechnung</button>
                        </form>

                        <form action="" id="rechnung-form-del">
                            <div>
                                <input type="text" id="rechnungsnr" name="rechnungsnr" placeholder="Rechnungsnr" required>
                            </div>
                            <button type="submit" class="btn">Delete Rechnung</button>
                        </form>

                        <table id="Patient-table">
                            <thead></thead>
                            <tbody></tbody>
                        </table>

                        <table id="Versicherung-table">
                            <thead></thead>
                            <tbody></tbody>
                        </table>

                        <table id="Rechnung-table">
                            <thead></thead>
                            <tbody></tbody>
                        </table>

*/

init();
