import React from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import './Login.css'; // Asegúrate de crear este archivo CSS para los estilos personalizados

function Login() {
  return (
    <div className="login-background">
      <Container fluid>
        <Row className="justify-content-center">
          <Col md="6" lg="4">
            <Card className="login-card">
              <Card.Body>
                <Card.Title className="text-center">SISTEMA INTEGRAL DE SERVICIO SOCIAL ALBATROS</Card.Title>
                <Card.Subtitle className="mb-4 text-center">Instituto Tecnológico de Ensenada 2024</Card.Subtitle>
                <Form>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control type="text" placeholder="Ingrese su usuario" />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Ingrese su contraseña" />
                  </Form.Group>

                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Recuérdame" />
                  </Form.Group>

                  <Button variant="primary" type="submit" block>
                    Ingresar
                  </Button>
                  <Button variant="secondary" type="button" block className="mt-2">
                    Registrar
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
