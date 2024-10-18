import express from "express";
import sql from "mssql";

const app = express();
const port = 3000;
// SQL Server configuration
const config = {
  user: "pruebas", // Database username
  password: "12345",
  server: "localhost", // Server IP address
  database: "sissatest", // Database name
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", `*`);

  // Request methods
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pasar a la siguiente capa de middleware
  next();
});

// Definir una ruta para hacer fetch a SQL Server
app.get("/", async (request, response) => {
  try {
    await sql.connect(config);
    const result = await sql.query(
      "SELECT * FROM Alumnos where Nombres='Juan'"
    );
    // console.dir(result.recordset);
    response.send(result.recordset[0]);
    // console.log("SISAS");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
});

// Coneccion a sql server
sql.connect(config, (err) => {
  if (err) {
    throw err;
  }
  console.log("Connection Successful!");
});

// Start server on port 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
