const mongoose = require("mongoose");
const siteSchema = require("./siteSchema");

module.exports = class SitesDB {
  constructor() {
    this.Site = db.model("site", siteSchema);
  }
  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(connectionString);
      db.once("error", (err) => {
        reject(err);
      });
      db.once("open", () => {
        this.Site = db.model("site", siteSchema);
        resolve();
      });
    });
  }

  async addNewSite(data) {
    const newSite = new this.Site(data);
    await newSite.save();
    return newSite;
  }

  getAllSites(page, perPage, name, region, provinceOrTerritoryName) {
    let findBy = {};
    if (region) {
      findBy = {
        "provinceOrTerritory.region": { $regex: region, $options: "i" },
      };
    } else if (provinceOrTerritoryName) {
      findBy = {
        "provinceOrTerritory.name": {
          $regex: provinceOrTerritoryName,
          $options: "i",
        },
      };
    } else if (name) {
      findBy = { siteName: { $regex: name, $options: "i" } };
    }
    if (+page && +perPage) {
      return this.Site.find(findBy)
        .sort({ siteName: 1 })
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .exec();
    }
    return Promise.reject(
      new Error("page and perPage query parameters must be valid numbers")
    );
  }
  getSiteById(id) {
    return this.Site.findById(id).exec();
  }
  updateSiteById(data, id) {
    return this.Site.updateOne({ _id: id }, { $set: data }).exec();
  }
  deleteSiteById(id) {
    return this.Site.deleteOne({ _id: id }).exec();
  }
};
