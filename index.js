// express und http Module importieren. Sie sind dazu da, die HTML-Dateien
// aus dem Ordner "public" zu veröffentlichen.
var express = require('express');
var app = express();
var server = require('http').createServer(app);
const oracledb = require('oracledb');
var port = 3000;

// Mit diesem Kommando starten wir den Webserver.
server.listen(port, function () {
// Wir geben einen Hinweis aus, dass der Webserer läuft.
console.log('Webserver läuft und hört auf Port %d', port);
});

// app.listen(port, function(){
//   console.log("App läuft");
// })
// Hier teilen wir express mit, dass die öffentlichen HTML-Dateien
// im Ordner "public" zu finden sind.
app.use(express.static(__dirname + '/public'));

app.use(express.json());

app.get('/', (req, res) => {
  res.send("t");
})

// app.get('/api/hello', (req,res) => {
//     res.send("Hello");
// })




oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

app.get('/api/test', (req, res) => {
  const responseData = {message: 'Hello from the server!' };
  res.json(responseData);
});

app.post('/test', (req, res) => {
  console.log(req.body.sql_command);
  try {
    const connection =  oracledb.getConnection({
      user: 'mipm',
      password: 'orcPW2023',
      connectString: 'rs03-db-inf-min.ad.fh-bielefeld.de:1521/orcl.rs03-db-inf-min.ad.fh-bielefeld.de'
    });
    
    const result =  connection.execute(
      req.body.sql_command
    );
    
  
    connection.close();

    res.json(result.rows);
  


  } catch (error) {
    console.error('Fehler bei der Datenbankabfrage:', error);
  }
  
  res.json({message: "lol"})
});

app.post('/api/sql',  async (req, res) => {
  var result;
  try {
    const connection =  await oracledb.getConnection({
      user: 'mipm',
      password: 'orcPW2023',
      connectString: 'rs03-db-inf-min.ad.fh-bielefeld.de:1521/orcl.rs03-db-inf-min.ad.fh-bielefeld.de'
    });


    
    result = await connection.execute(
      req.body.sql_command
    );



    //console.log(req.body.sql_command);
    
    res.json(result.rows);
  
    await connection.close();

  } catch (error) {
    console.error('Fehler bei der Datenbankabfrage:', error);
    res.json(result.rows);
  }
});

app.post('/sql/therapie', async (req, res) => {
  try {

      const connection =  await oracledb.getConnection({
        user: 'mipm',
        password: 'orcPW2023',
        connectString: 'rs03-db-inf-min.ad.fh-bielefeld.de:1521/orcl.rs03-db-inf-min.ad.fh-bielefeld.de'
      });
  

      const sql = `INSERT INTO THERAPIE (bezeichnung, info, startzeitpunkt, berechtigungsstufe, endzeitpunkt) 
                   VALUES (:bezeichnung, :info, TO_DATE(:startzeitpunkt, 'YYYY-MM-DD HH24:MI:SS'), :berechtigungsstufe, TO_DATE(:endzeitpunkt, 'YYYY-MM-DD HH24:MI:SS')) 
                   RETURNING behandlungs_id INTO :behandlungsId`;

      const bindParams = {
          bezeichnung: req.body.bezeichnung,
          info: req.body.info,
          startzeitpunkt: req.body.startzeitpunkt,
          berechtigungsstufe: req.body.berechtigungsstufe,
          endzeitpunkt: req.body.endzeitpunkt,
          behandlungsId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      };

      console.log(sql, bindParams);
      const result = await connection.execute(sql, bindParams, { autoCommit: true });


      await connection.close();

      res.json({ behandlungsId: result.outBinds.behandlungsId[0] });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/sql/operation', async (req, res) => {
  try {

      const connection =  await oracledb.getConnection({
        user: 'mipm',
        password: 'orcPW2023',
        connectString: 'rs03-db-inf-min.ad.fh-bielefeld.de:1521/orcl.rs03-db-inf-min.ad.fh-bielefeld.de'
      });
  

      const sql = `INSERT INTO OPERATION (operationssaal_id, bezeichnung, info, endzeit, fachrichtung, startzeit) 
                   VALUES (:bezeichnung, :info, TO_DATE(:startzeitpunkt, 'YYYY-MM-DD HH24:MI:SS'), :berechtigungsstufe, TO_DATE(:endzeitpunkt, 'YYYY-MM-DD HH24:MI:SS')) 
                   RETURNING behandlungs_id INTO :behandlungsId`;

      const bindParams = {
          operationssaal_id: req.body.operationssaal_id,
          bezeichnung: req.body.bezeichnung,
          info: req.body.info,
          berechtigungsstufe: req.body.berechtigungsstufe,
          endzeitpunkt: req.body.endzeitpunkt,
          behandlungsId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      };

      console.log(sql, bindParams);
      const result = await connection.execute(sql, bindParams, { autoCommit: true });


      await connection.close();

      res.json({ behandlungsId: result.outBinds.behandlungsId[0] });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


app.get('/api/arzt', async (req, res) => {
    try {
      const connection = await oracledb.getConnection({
        user: 'mipm',
        password: 'orcPW2023',
        connectString: 'rs03-db-inf-min.ad.fh-bielefeld.de:1521/orcl.rs03-db-inf-min.ad.fh-bielefeld.de'
      });
      
      const result = await connection.execute(
        `SELECT *
         FROM ARZT
         FETCH FIRST 10 ROWS ONLY`
      );
      
    
      await connection.close();

      res.json(result.rows);
    
  
  
    } catch (error) {
      console.error('Fehler bei der Datenbankabfrage:', error);
    }
  }
)



// Fertig. Wir haben unseren ersten, eigenen Webserver programmiert :-)