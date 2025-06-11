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

const app = express();
const HTTP_PORT = 3000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

const SitesDB = require("./modules/sitesDB.js");
const db = new SitesDB();

app.get("/", (req, res) => {
  res.json({
    message: "API Listening",
    term: "Summer 2025",
    student: "Yevhen Chernytskyi",
  });
});

app.post("/api/sites", (req, res) => {
  db.addNewSite(req.body)
    .then((site) => res.status(201).json(site))
    .catch((err) => res.status(500).json({ message: err.message }));
});

app.get("/api/sites", (req, res) => {
  const { page, perPage, name, region, provinceOrTerritoryName } = req.query;

  db.getAllSites(page, perPage, name, region, provinceOrTerritoryName)
    .then((sites) => res.json(sites))
    .catch((err) => res.status(500).json({ message: err.message }));
});

app.get("/api/sites/:id", (req, res) => {
  db.getSiteById(req.params.id)
    .then((site) => {
      if (site) res.json(site);
      else res.status(404).json({ message: "Site not found" });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

app.put("/api/sites/:id", (req, res) => {
  db.updateSiteById(req.body, req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(500).json({ message: err.message }));
});

app.delete("/api/sites/:id", (req, res) => {
  db.deleteSiteById(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(500).json({ message: err.message }));
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
