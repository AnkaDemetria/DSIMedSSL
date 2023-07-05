const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
// const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
const port = process.env.PORT || 3004;


/* GENERER UN CERTIFICAT SSL AUTO SIGNé
On crée les constantes pour le serveur HTTPS*/
const fs = require('fs');
const path = require('path');
const https = require('https');
  
/* On récupère notre clé privée et notre certificat ( dans le dossier certificate) */
const key = fs.readFileSync(path.join(__dirname, 'certificate', 'server.key'));
const cert = fs.readFileSync(path.join(__dirname, 'certificate', 'server.cert'));
 
const options = { key, cert };
 
/* Puis on crée notre serveur HTTPS */
https.createServer(options, app).listen(8080, () => {
  console.log('App is running ! Go to https://localhost:8080');
});

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json())
// app.use(cookieParser())

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  port: 3306,
  database: "dsimed",
});

module.exports = { app, port, db };
