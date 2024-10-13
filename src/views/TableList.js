import React from "react";

// react-bootstrap components
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

function TableList() {
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Reportes pendientes</Card.Title>
                <p className="card-category">
                  Tabla de estado de reportes
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Nombre</th>
                      <th className="border-0">Matrícula</th>
                      <th className="border-0">Reporte bimestral #</th>
                      <th className="border-0">Carrera</th>
                      <th className="border-0">Estatus</th>
                      <th className="border-0">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Fabian Ortega</td>
                      <td>20760215</td>
                      <td>3</td>
                      <td>Ingeniería en Sistemas Computacionales</td>
                      <td>En Revisión</td>
                      <td>
                        <Button variant="info" size="sm">
                          <i className="fas fa-eye"></i>
                        </Button>
                        <Button variant="success" size="sm" className="ml-2">
                          <i className="fas fa-check"></i>
                        </Button>
                        <Button variant="danger" size="sm" className="ml-2">
                          <i className="fas fa-times"></i>
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Reportes pendientes</Card.Title>
                <p className="card-category">
                  Tabla de estado de reportes
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Nombre</th>
                      <th className="border-0">Matrícula</th>
                      <th className="border-0">Reporte bimestral #</th>
                      <th className="border-0">Carrera</th>
                      <th className="border-0">Estatus</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Roberto A. Vergara D. </td>
                      <td>20760215</td>
                      <td>2</td>
                      <td>Ingeniería en Sistemas Computacionales</td>
                      <td>Rechazado</td>
                    </tr>
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

export default TableList;
