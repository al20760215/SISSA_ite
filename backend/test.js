import sql from "mssql";

const config = {
  user: "pruebas", // Database username
  password: "1234",
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

export const getAlumno = (async () => {
  try {
    await sql.connect(config);
    const result = await sql.query(
      "SELECT * FROM Alumnos where Nombres='Juan'"
    );
    console.dir(result.recordset);
    console.log("SISAS");
    return result.recordset[0];
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
})();
