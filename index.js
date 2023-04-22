const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const moment = require("moment");
const csvtojson = require('csvtojson');
const fs = require("fs");
const path = require("path");
const port = 3000;
app.use(express.static("mainsite"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.listen(port, () =>{console.log(`Server naslouchá na portu ${port}`);});
const urlencodedParser = bodyParser.urlencoded({extended: false});
app.post('/savedata', urlencodedParser, (req, res) =>{
    let date = moment().format('DD-MM-YYYY');
    let str = `"${req.body.ukol}","${req.body.predmet}","${date}","${req.body.odevzdani}"\n`;
    fs.appendFile(path.join(__dirname, 'zaznam/ukoly.csv'), str, function(err) {
        if(err) {
            console.error(err);
            returnres.status(400).json({success: false,message: "Nastala chyba během ukládání souboru"
            });
        }
    });
    res.redirect(301, '/');});
    app.get("/zaznam", (req, res) => {
        csvtojson({ headers: ['ukol', 'predmet', 'zadani', 'odevzdani'] })
          .fromFile(path.join(__dirname, 'zaznam/ukoly.csv'))
          .then(data => {
            data.sort((a, b) => new Date(a.odevzdani) - new Date(b.odevzdani));
            res.render('index', { nadpis: "Seznam úkolů", ukoly: data });
          })
          .catch(err => {
            res.render('error', { nadpis: "Chyba v aplikaci", chyba: err });
          });
      });