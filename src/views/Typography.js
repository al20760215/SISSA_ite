import React from "react";

// Importación de componentes de react-bootstrap
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function ApprovedReports() {
  return (
    <>
      {/* Contenedor principal con diseño fluido */}
      <Container fluid>
        <Row>
          <Col md="12">
            {/* Tarjeta con tabla de constancias aprobadas */}
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Constancias de Reportes Aprobados</Card.Title>
                {/* Subtítulo de la tarjeta */}
                <p className="card-category">
                  Lista de reportes que han sido aprobados
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                {/* Tabla con efecto hover y rayas */}
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      {/* Encabezados de la tabla */}
                      <th className="border-0">ID</th>
                      <th className="border-0">Nombre</th>
                      <th className="border-0">Matrícula</th>
                      <th className="border-0">Reporte bimestral #</th>
                      <th className="border-0">Carrera</th>
                      <th className="border-0">Fecha de Aprobación</th>
                      <th className="border-0">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      {/* Identificador único del primer registro */}
                      <td>Fabian Ortega</td>
                      {/* Nombre del estudiante */}
                      <td>20760215</td>
                      {/* Matrícula del estudiante */}
                      <td>3</td>
                      {/* Número de reporte bimestral */}
                      <td>Ingeniería en Sistemas Computacionales</td>
                      {/* Carrera del estudiante */}
                      <td>2024-07-15</td>
                      {/* Fecha de aprobación del reporte */}
                      <td>
                        {/* Botón para descargar constancia */}
                        <Button variant="primary" size="sm">
                          <i className="fas fa-download"></i> Descargar
                        </Button>
                      </td>
                    </tr>
                    {/* Puedes agregar más filas de datos aquí */}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ApprovedReports;
