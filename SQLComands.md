# Die wichtigsten SQL-Befehle - kurz erklärt

### Anzeige der Diagnosen-, sowie Therapien und Operationen eines Patienten

```sql 
`
SELECT 
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
```
- Anzeige von Diagnose_Id, Mitarbeiter_Nr (Wer hat die Diagnose gestellt?), Nach- und Vorname des diagnostizierenden Arztes, ein Diagnosedatum, Beschreibung der Diagnosel, ob die Beschwerden gelöst sind oder nicht, sowie Auflistung der zugehörigen Therapien und Behandlungen 
- JOIN von Arzt anhand der Diganose_Id
- LEFT JOINS von Operation_Diagnose, Operation, Therapie_Diagnose und Therapie (LEFT JOINS, damit auch Diagnosen angezeigt werden, die noch keine Behandlung oder Diagnose erhalten haben)
- WHERE-Klausel sorgt dafür, dass nur die Diagnosen des ausgewählten Patienten angezeigt werden 

### Anzeigen der Stationen
```sql
SELECT 
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

```
- Anzeige von Krankenhausname, Stationsname und Stations-ID, der umgewandelten Notfallstation (1 => Ja, 0 => nein)
- Krankenhaus wird mithilfe der Krankenhaus_ID gejoined
- Sortierung nach einem bestimmten Attribut (über Form)


### Anzeigen der Raumdetails, nach Raumart insbs. für den Patientenraum
```sql
 `SELECT p.patientenraum_id,
            p.bettkapazitaet,
            p.bettkapazitaet - COUNT(pa.patienten_id) AS Freie_Betten
            FROM PATIENTENRAUM p
            LEFT JOIN PATIENT pa ON p.patientenraum_id = pa.patientenraum_id
            WHERE p.stations_id = ${showStationForm.chooseStationId.value}
            GROUP BY
            p.patientenraum_id, p.bettkapazitaet
            `
```
- Anzeige von Patientenraum_Id, Bettkapazität und Anzahl der freien Betten
- Freie Betten wird mithilfe der Bettkapazität und den Patienten, die in dem Raum liegen berechnet (COUNT) -> dazu LEFT JOIN von Patient mithilfe der Patientenraum_Id


### Anzeigen von Therapien, die bei Patienten durchgeführt werden, welche in einem ausgewählten Raum liegen
```sql
        SELECT
            TD.BEHANDLUNGS_ID,
            TD.DIAGNOSE_ID,
            T.BEZEICHNUNG,
            T.INFO,
            SUBSTR(T.STARTZEITPUNKT ,0,8) AS STARTZEITPUNKT,
            SUBSTR(T.ENDZEITPUNKT, 0, 8) AS ENDZEITPUNKT,
            P.NAME,
            PR.PATIENTENRAUM_ID
        FROM THERAPIE_DIAGNOSE TD
        JOIN THERAPIE T ON TD.BEHANDLUNGS_ID = T.BEHANDLUNGS_ID
        JOIN DIAGNOSE D ON TD.DIAGNOSE_ID = D.DIAGNOSE_ID
        JOIN PATIENT P ON D.PATIENTEN_ID = P.PATIENTEN_ID
        JOIN PATIENTENRAUM PR ON P.PATIENTENRAUM_ID = PR.PATIENTENRAUM_ID
        WHERE PR.PATIENTENRAUM_ID = ${showRoomDetailsForm.kalenderchooseRaumId.value}
        `
```
- Anzeige der Behandlungs- und Diagnose_Id, der Bezeichnung, Info, Start- und Enddatum der Therapie, sowie des Namens des Patienten und der Patientenraum_Id
- JOIN über Therapie_Diagnose über Therapie -> Diagnose -> Patient -> Patientenraum anhand der jeweiligen Foreign-Keys
- Auswahl der Patientenraum-Id in der WHERE-Klausel

### Anzeigen der Übersichtstabelle der Patienten
```sql 
`
        SELECT PATIENT.PATIENTEN_ID, 
        K.NAME AS KRANKENHAUSNAME, 
        S.STATIONS_NAME || '-' || PATIENT.PATIENTENRAUM_ID AS PATIENTENRAUM, 
        PATIENT.NAME, 
        SUBSTR(AUFNAHME_DATUM ,0,8) AS AUFNAHMEDATUM, 
        SUBSTR(ENTLASSUNGS_DATUM ,0,8) AS ENTLASSUNGSDATUM, 
        GESCHLECHT,
        SUBSTR(GEBURTSDATUM ,0,8) AS GEBURTSDATUM, 
        BLUTGRUPPE
        FROM "MIPM"."PATIENT"
        JOIN "MIPM"."KRANKENHAUS" K ON PATIENT.KRANKENHAUS_ID = K.KRANKENHAUS_ID
        JOIN "MIPM"."PATIENTENRAUM" PR ON PATIENT.PATIENTENRAUM_ID = PR.PATIENTENRAUM_ID
        JOIN "MIPM"."STATION" S ON PR.STATIONS_ID = S.STATIONS_ID
        `
```
- Anzeige von Patienten_Id, Krankenhausname, Konkatenation aus Stationsname und Raumnummer, dem Namen des Patienten, dem angepassten Aufnahme- und Entlassungsdatum, seinem Geschlecht, dem Geburtsdatum und der Blutgruppe
- JOINS von Krankenhaus, Patientenraum und Station anhand der jeweiligen Foreign-Keys

### Hinzufügen von Therapien zu einem Patienten (mehrere SQL-Statements)

1. Auswahl von passenden Krankenpflegern (anhand der Parameter)
```sql
        `
        SELECT KP.MITARBEITER_NR
        FROM KRANKENPFLEGER KP
        JOIN PATIENT P ON kp.krankenhaus_id = ${krankenhaus_id}
        WHERE berechtigungen >= ${addTherapieForm.therapieBerechtigung.value}
        AND p.patienten_id = ${patientId}
        ORDER BY DBMS_RANDOM.RANDOM
        FETCH FIRST ${addTherapieForm.therapieAnzahlPersonal.value} ROWS ONLY`
```
- Ausgabe von x zufälligen Mitarbeiter_Nr (ORDER BY DBMB_RANDOM.RANDOM, FETCH FIRST ... ROWS ONLY), anhand der passenden Berechtigungsstufe. Außerdem soll der Pfleger im selben Krankenhaus, wie der Patient arbeiten
- JOIN von Patient anhand der Krankenhaus_Id

2. Einfügen der Therapie in die Datenbank, inkl. Zurücklieferung der erstellten Behandlungs_Id
```javascript
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
```

- POST an den Server -> Ausführung des SQL-Queries, Zurücklieferung der Behandlungs_Id 
<br> Wie funktioniert das?
<br> Serverseite:
```
app.post('/sql/operation', async (req, res) => {
  try {

      const connection =  await oracledb.getConnection({
        user: 'mipm',
        password: 'orcPW2023',
        connectString: 'rs03-db-inf-min.ad.fh-bielefeld.de:1521/orcl.rs03-db-inf-min.ad.fh-bielefeld.de'
      });
  

      const sql = `INSERT INTO OPERATION (operationssaal_id, bezeichnung, info, endzeit, fachrichtung, startzeit) 
                   VALUES (:operationssaal_id, :bezeichnung, :info, TO_DATE(:endzeitpunkt, 'YYYY-MM-DD"T"HH24:MI'), :fachrichtung, TO_DATE(:startzeitpunkt, 'YYYY-MM-DD"T"HH24:MI')) 
                   RETURNING behandlungs_id INTO :behandlungsId`;

      const bindParams = {
          operationssaal_id: req.body.operationssaal_id,
          bezeichnung: req.body.bezeichnung,
          info: req.body.info,
          fachrichtung: req.body.fachrichtung,
          endzeitpunkt: req.body.endzeit,
          startzeitpunkt: req.body.startzeit,
          behandlungsId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      };

      const result = await connection.execute(sql, bindParams, { autoCommit: true });


      await connection.close();

      res.json({ behandlungsId: result.outBinds.behandlungsId[0] });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

```
- Definition des Output-Parameters "behandlungsId" -> dieser wird nach Ausführung des SQL-Statements von der Datenbank zurückgeliefert, wir leiten ihn dann an den Client weiter

3. Eintragen der MitarbeiterIDs und BehandlungsIds in Zwischentabelle KRANKENPFLEGER_THERAPIE
4. Eintragen der BehandlungsId und der DiagnoseId in Zwischentabelle THERAPIE_DIAGNOSE

### Hinzufügen einer Operation zu einem Patienten mit automatischer Auswahl von passendem Operationssaal und Arzt

1. Ermitteln eines Operationssaals, der im selben Krankenhaus, wie der Patient liegt, die passenden Öffnungszeiten hat und in dem zur Zeit der Operation keine andere Operation geplant ist

```sql
        `
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
```
- Anzeige von Operationssaal_Id 
- JOIN von Station, Patient und Operation anhand der passenden Keys
- WHERE-Klausel überprüft die Öffnungszeiten des Operationssaals, sowie die Zeiten der Operationen. Außerdem wird geprüft, ob der Operationssaal ausreichend groß ist. 

2. Hinzufügen der Operation in die Datenbank -> Identisch zum Hinzufügen von Therapien

3. Auswahl eines passenden Arztes (mit passender Fachrichtung und Arbeitszeiten)

```sql 
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

```
- Anzeige einer Mitarbeiter_Nr 
- JOIN von Station, Patient
- LEFT JOIN von ARZT_OPERATION und OPERATION (damit auch leere Elemente angezeigt werden) -> Zusätzliche Bedingung: Operationen, die zwischen dem Start- und Endzeitpunkt einer Operation stattfinden
- WHERE-Klausel filtert nach Arbeitsbeginn- und -ende des Arztes, sowie seiner Fachrichtung und ob die MITARBEITER_Nr in den Operationen Null ist

4. Einfügen der ermittelten Mitarbeiter_Nr und der Behandlungs_Id in die Zwischentabelle ARZT_OPERATION

### Hinzufügen einer Versicherung

```sql
        BEGIN
        INSERT INTO VERSICHERUNG (BETRIEBSNUMMER, VERSICHERUNGSNAME)
        VALUES (
        '${versicherungForm.betriebsnummer.value}',
        '${versicherungForm.versicherungsname.value}');
        COMMIT;
        END;
```

- Fügt eine Versicherung mit der angegebenen Betriebsnummer und dem angegebenen Versicherungsnamen hinzu.

### Zuodnung eines Patienten zu einer Versicherung

```sql
        BEGIN
        INSERT INTO PATIENT_VERSICHERUNG (PATIENTEN_ID, BETRIEBSNUMMER,VERSICHERUNGSNUMMER)
        VALUES (
        '${patientversicherungForm.patientenid.value}',
        '${patientversicherungForm.betriebsnummer.value}',
        '${patientversicherungForm.versicherungsnummer.value}');
        COMMIT;
        END;
```

- Weist einem Patienten anhand seiner ID eine Versicherung anhand der Betriebsnummer zu, und gibt dabei die Versicherungsnummer an.

### Erstellen einer Rechnung

```sql
        BEGIN
        INSERT INTO RECHNUNG (PATIENTEN_ID, BETRIEBSNUMMER, BETRAG, ZUZAHLUNG, AUSSTELLUNGS_DATUM, FAELLIGKEITS_DATUM, STATUS)
        VALUES (
        '${rechnungForm.patientenid.value}',
        '${rechnungForm.betriebsnummer.value}',
        '${rechnungForm.betrag.value}',
        '${rechnungForm.zuzahlung.value}',
        '${rechnungForm.ausstellungs_datum.value}',
        '${rechnungForm.faelligkeits_datum.value}',
        0);
        COMMIT;
        END;
```

- Erstellt eine Rechnung:
    - an den Patienten mit der ausgewählten Id
    - an die Versicherung der angegebenen Betriebsnummer
    - mit dem angegebenen Betrag
    - mit der angegebenen Zuzahlung
    - mit dem angegebenen Ausstellungsdatum
    - mit dem angegebenen Fälligkeitsdatum
    - die nicht beglichen ist (0)

### Löschen einer Versicherung von einem Patienten

```sql
        BEGIN
        DELETE FROM PATIENT_VERSICHERUNG
        WHERE PATIENTEN_ID = '${versicherungremove.patientenid.value}'
        AND BETRIEBSNUMMER = '${versicherungremove.betriebsnummer.value}';
        COMMIT;
        END;
```

- Löscht die Zuordnung eines Patienten zu einer Versicherung, bei der die ID des Patienten und die Betriebsnummer der Versicherung übereinstimmen.

### Löschen einer Versicherung

```sql
        BEGIN
        DELETE FROM VERSICHERUNG WHERE BETRIEBSNUMMER = '${versicherungdelete.betriebsnummer.value}';
        COMMIT;
        END;
```

- Löscht die Versicherung mit der angegebenen Betriebsnummer.

### Löschen einer Rechnung

```sql
        BEGIN
        DELETE FROM RECHNUNG WHERE RECHNUNGS_NR = '${rechnungdelete.rechnungsnr.value}';
        COMMIT;
        END;
```

- Löscht die Rechnung mit der angegebenen Rechnungsnummer.

### Ändern einer Versicherung

```sql
        BEGIN
        UPDATE VERSICHERUNG
        SET VERSICHERUNGSNAME = '${versicherungupdate.versicherungsname.value}'
        WHERE BETRIEBSNUMMER = '${versicherungupdate.betriebsnummer.value}';
        COMMIT;
        END;
```

- Ändert den Namen der Versicherung mit der angegebenen Betriebsnummer.

### Ändern einer Rechnung

```sql
        BEGIN
        UPDATE RECHNUNG
        SET PATIENTEN_ID = '${rechnungupdate.patientenid.value}',
        BETRIEBSNUMMER = '${rechnungupdate.betriebsnummer.value}',
        BETRAG = '${rechnungupdate.betrag.value}',
        ZUZAHLUNG = '${rechnungupdate.zuzahlung.value}',
        AUSSTELLUNGS_DATUM = '${rechnungupdate.ausstellungs_datum.value}',
        FAELLIGKEITS_DATUM = '${rechnungupdate.faelligkeits_datum.value}',
        STATUS = '${rechnungupdate.status.value}'
        WHERE RECHNUNGS_NR = '${rechnungupdate.rechnungsnr.value}';
        COMMIT;
        END;
```

- Ändert die Werte in einer Rechnung, die über die Rechnungsnummer angegeben wurde.
- Hinweis: in unserer JavaScript-Implementierung wird die Query so angepasst, dass nur die Spalten geändert werden, die auch ausgewählt wurden, indem sie Zeileweise zusammengebaut wird.

### Auswählen der Versicherungen

```sql
        SELECT * FROM VERSICHERUNG
        WHERE VERSICHERUNG.BETRIEBSNUMMER = '${versicherungCreateTable.betriebsnummer.value}'
        AND VERSICHERUNG.VERSICHERUNGSNAME LIKE '${versicherungCreateTable.versicherungsname.value}'
        ORDER BY VERSICHERUNG.BETRIEBSNUMMER ASC;
```

- Wählt alle Versicherungen aus:
    - deren Betreibsnummern der Angabe entsprechen
    - deren Namen der Auswahl ähneln, mithilfe der 'LIKE' Operation
    - und ordnet diese aufsteigend nach ihren Betriebsnummern
- Hinweis: die Query wird wie beim Ändern einer Rechnung erstellt.

### Auswählen aller Versicherungen eines Patenten

```sql
        SELECT PATIENT_VERSICHERUNG.PATIENTEN_ID, PATIENT_VERSICHERUNG.BETRIEBSNUMMER, PATIENT_VERSICHERUNG.VERSICHERUNGSNUMMER
        FROM VERSICHERUNG
        INNER JOIN PATIENT_VERSICHERUNG
        ON VERSICHERUNG.BETRIEBSNUMMER = PATIENT_VERSICHERUNG.BETRIEBSNUMMER
        WHERE PATIENT_VERSICHERUNG.PATIENTEN_ID = '${versicherungCreateTable.patientenid.value}'
        AND VERSICHERUNG.BETRIEBSNUMMER = '${versicherungCreateTable.betriebsnummer.value}'
        AND VERSICHERUNG.VERSICHERUNGSNAME LIKE '${versicherungCreateTable.versicherungsname.value}'
        ORDER BY VERSICHERUNG.BETRIEBSNUMMER ASC;
```

- Wählt alle Versicherungen aus:
    - denen der Angegebene Patient zugehört
    - deren Betreibsnummern der Angabe entsprechen
    - deren Namen der Auswahl ähneln, mithilfe der 'LIKE' Operation
    - und ordnet diese aufsteigend nach ihren Betriebsnummern
- Der 'INNER JOIN' wird ausgeführt, um die Patienten mit ihren Versicherungen in Verbindung zu bringen
- Hinweis: die Query wird wie beim Ändern einer Rechnung erstellt.

### Auswählen von Rechnungen

```sql
        SELECT
            RECHNUNGS_NR,
            PATIENTEN_ID,
            BETRIEBSNUMMER,
            BETRAG,
            ZUZAHLUNG,
            SUBSTR(AUSSTELLUNGS_DATUM ,0,8) AS AUSSTELLUNGSDATUM,
            SUBSTR(FAELLIGKEITS_DATUM ,0,8) AS FÄLLIGKEITSDATUM,
            STATUS
        FROM
            RECHNUNG
        WHERE
            RECHNUNGS_NR = '${rechnungCreateTable.rechnungsnr.value}'
        AND
            PATIENTEN_ID = '${rechnungCreateTable.patientenid.value}'
        AND
            BETRIEBSNUMMER = '${rechnungCreateTable.betriebsnummer.value}'
        AND
            BETRAG = '${rechnungCreateTable.betrag.value}'
        AND
            ZUZAHLUNG = '${rechnungCreateTable.zuzahlung.value}'
        AND
            TRUNC(AUSSTELLUNGS_DATUM) = TO_DATE('${rechnungCreateTable.ausstellungs_datum.value}','DD-MM-YYYY')
        AND
            TRUNC(FAELLIGKEITS_DATUM) = TO_DATE('${rechnungCreateTable.faelligkeits_datum.value}','DD-MM-YYYY')
        ORDER BY
            PATIENTEN_ID ASC
```

- Wählt alle Rechnungen aus, deren Werte den Angeben entsprechen.
- Zeigt von den Daten nur Tag, Monat und Jahr an, über die 'SUBSTR()' Funktion
- Bezieht beim Suchen nur Tag, Monat und Jahr ein, über die 'TRUNC()' Funktion
- Die letzte Bedingung in der WHERE-Klausel kann durch Eingabe des Wertes 'fällig' durch folgendes ersetzt werden, um alle noch nicht beglichenen Rechnungen zu filtern. Dabei wird das Fälligkeitsdatum (ohne Uhrzeit) mit dem aktuellen Datum (ohne Uhrzeit) verglichen.

```sql
        TRUNC(FAELLIGKEITS_DATUM) < TRUNC(SYSDATE) AND STATUS = 0
```

- Bei der Eingabe von zwei Werten pro Spalte wird '=' dur 'BETWEEN' ersetzt, um ganze Bereiche abzusuchen, wie im folgenden SQL-Befehl dargestellt.
- Sortiert die Ausgabe aufsteigend nach der Patienten-ID.
- Wird das Schlüsselwort 'sum' als Rechnungsnummer angegeben, wird der Befehl um eine Gruppenfunktion ergänzt, die pro Patient alle seine Rechnungen aufaddiert.

```sql
        SELECT
            PATIENTEN_ID,
            SUM(BETRAG) + SUM(ZUZAHLUNG) AS GESAMTBETRAG
        FROM
            RECHNUNG
        WHERE
            RECHNUNGS_NR BETWEEN '${[val1]}' AND '${[val2]}'
        AND
            PATIENTEN_ID BETWEEN '${[val1]}' AND '${[val2]}'
        AND
            BETRIEBSNUMMER = BETWEEN '${[val1]}' AND '${[val2]}'
        AND
            BETRAG = BETWEEN '${[val1]}' AND '${[val2]}'
        AND
            ZUZAHLUNG = BETWEEN '${[val1]}' AND '${[val2]}'
        AND
            TRUNC(AUSSTELLUNGS_DATUM) BETWEEN TO_DATE('${[val1]}','DD-MM-YYYY')
            AND TO_DATE('${[val2]}','DD-MM-YYYY')
        AND
            TRUNC(FAELLIGKEITS_DATUM) BETWEEN TO_DATE('${[val1]}','DD-MM-YYYY')
            AND TO_DATE('${[val2]}','DD-MM-YYYY')
        GROUP BY
            PATIENTEN_ID
        ORDER BY
            PATIENTEN_ID ASC;
```

- Hinweis: die Query wird wie beim Ändern einer Rechnung erstellt.
