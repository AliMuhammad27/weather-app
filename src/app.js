const express = require("express");
const path = require("path");
const hbs = require("hbs");
const geoCode = require("./utils/geocode");
const foreCast = require("./utils/forecast");

//Define paths for express config
const localDirectory = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
const app = express();

//set up handlebar engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to setup
app.use(express.static(localDirectory));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Ali Muhammad",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Ali Muhammad",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    msg: "contact us on helpedu.io",
    title: "Help",
    name: "Ali Muhammad",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please provide an Address",
    });
  }
  geoCode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        res.send({ error });
      }
      foreCast(latitude, longitude, (error, forecastData) => {
        if (error) {
          res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          Address: req.query.address,
        });
      });
    }
  );
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404 Page",
    name: "Ali Muhammad",
    errMsg: "Help Page not found",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404 Page",
    name: "Ali Muhammad",
    errMsg: "Page Not found",
  });
});

app.listen(3000, () => {
  console.log("Server is on port 3000");
});
