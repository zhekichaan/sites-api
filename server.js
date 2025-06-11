/********************************************************************************
 * WEB422 – Assignment 1
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Yevhen Chernytskyi Student ID: 166613232 Date: May 16 2025
 *
 * Published URL on Vercel: https://sites-api-nine.vercel.app/
 *
 ********************************************************************************/

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const SitesDB = require("./modules/sitesDB.js");

const app = express();
const HTTP_PORT = 3000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_CONN_STRING);

const db = new SitesDB();

app.post("/api/sites", (req, res) => {
  db.addNewSite(req.body)
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      res.status(400).send("Unable to add a new site: ", err);
    });
});

app.get("/api/sites", (req, res) => {
  db.getAllSites(
    req.query.page,
    req.query.perPage,
    req.query.name ? req.query.name : "",
    req.query.region ? req.query.region : "",
    req.query.provinceOrTerritoryName ? req.query.provinceOrTerritoryName : ""
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

app.get("/api/sites/:id", (req, res) => {
  db.getSiteById(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

app.put("/api/sites/:id", (req, res) => {
  db.updateSiteById(req.body, req.params.id)
    .then((data) => {
      res.send("Updated successfuly.");
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.delete("/api/sites/:id", (req, res) => {
  db.deleteSiteById(req.params.id)
    .then()
    .catch((err) => res.status(400).send(err));
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
