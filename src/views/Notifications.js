import React from "react";
import NotificationAlert from "react-notification-alert";
import {
  Alert,
  Button,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function Notifications() {
  const [showModal, setShowModal] = React.useState(false);
  const notificationAlertRef = React.useRef(null);

  const notify = (place, message, type) => {
    var options = {
      place: place,
      message: (
        <div>
          <div>{message}</div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Container fluid>
        <Card>
          <Card.Header>
            <Card.Title as="h4">Notificaciones</Card.Title>
            <p className="card-category">Notificaciones de aceptación o rechazo de reportes y notificaciones del administrador.</p>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md="6">
                <h5>
                  <small>Notificaciones de Usuario</small>
                </h5>
                <Alert variant="success">
                  <span>Tu reporte ha sido aceptado.</span>
                </Alert>
                <Alert variant="danger">
                  <span>Tu reporte ha sido rechazado.</span>
                </Alert>
              </Col>
              <Col md="6">
                <h5>
                  <small>Notificaciones del Administrador</small>
                </h5>
                <Alert variant="info">
                  <span>Nuevo reporte recibido.</span>
                </Alert>
                <Alert variant="warning">
                  <span>Revisión pendiente de reportes.</span>
                </Alert>
              </Col>
            </Row>
            <Row>
              <Col md="12" className="text-center">
                <Button
                  variant="primary"
                  onClick={() => notify("tr", "Notificación de prueba", "info")}
                >
                  Mostrar Notificación de Prueba
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Notifications;
