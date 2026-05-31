import { Card, Col, Container, Row } from "react-bootstrap";

const AuthLayout = ({
  title,
  subtitle,
  colSize = { md: 9, lg: 7, xl: 5 },
  children,
}) => (
  <div
    className="flex items-center min-h-screen"
    style={{ background: "var(--bg-2)" }}
  >
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col {...colSize}>
          {(title || subtitle) && (
            <div className="text-center mb-5">
              {title && <h1 className="page-title">{title}</h1>}
              {subtitle && <p className="page-subtitle mt-1">{subtitle}</p>}
            </div>
          )}
          <Card className="border-0 premium-panel auth-card">
            <Card.Body className="p-4 p-md-5">{children}</Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
);

export default AuthLayout;
