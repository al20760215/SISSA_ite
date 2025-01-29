const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/solicitudes", (req, res) => {
  const data = req.body;

  // Append data to a JSON file
  fs.readFile(
    "./backend/prueba temporal/dummySolicitudes.json",
    (err, fileData) => {
      if (err) {
        return res.status(500).send("Error reading file\n" + err.message);
      }
      const json = JSON.parse(fileData);
      json.push(data);

      fs.writeFile(
        "./backend/prueba temporal/dummySolicitudes.json",
        JSON.stringify(json, null, 2),
        (err) => {
          if (err) {
            return res.status(500).send("Error writing file");
          }
          res.status(200).send("Data saved successfully");
        }
      );
    }
  );
});

app.get("/solicitudes", (req, res) => {
  fs.readFile(
    "./backend/prueba temporal/dummySolicitudes.json",
    (err, fileData) => {
      if (err) {
        return res.status(500).send("Error reading file\n" + err.message);
      }
      const json = JSON.parse(fileData);
      return res.status(200).send(json);
    }
  );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
