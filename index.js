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
    
  
    await connection.close();

  } catch (error) {
    console.error('Fehler bei der Datenbankabfrage:', error);
  }
  res.json(result.rows);
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