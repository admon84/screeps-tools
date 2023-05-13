import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Navbar';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { BuildingPlanner } from './components/building-planner/building-planner';
import { CreepDesigner } from './components/creep-designer/creep-designer';
import './App.scss';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="building-planner" element={<BuildingPlanner />} />
        <Route path="creep-designer" element={<CreepDesigner />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div className="screeps-tools">
      <Navbar className="header">
        <Navbar.Brand href="/">
          <img src="/assets/logo.png" className="logo" alt="Screeps Tools" />
        </Navbar.Brand>
        <Nav className="me-auto">
          <Link to="/building-planner">Building Planner</Link>
          <Link to="/creep-designer">Creep Designer</Link>
        </Nav>
        <div className="d-flex">
          <a href="https://github.com/admon84/screeps-tools" target="_blank" rel="noreferrer">
            View Source
          </a>
        </div>
      </Navbar>
      <Outlet />
    </div>
  );
}

function Home() {
  const cardStyles = { color: '#ccc', backgroundColor: '#222', border: 'none', margin: '1rem 0' };
  return (
    <Container className="home">
      <Row>
        <Col sm={6}>
          <Card body style={cardStyles}>
            <Card.Title>Building Planner</Card.Title>
            <Card.Text>Plan your next room layout with the Building Planner for Screeps.</Card.Text>
            <Link to="/building-planner">
              <Button>Plan Room</Button>
            </Link>
          </Card>
        </Col>
        <Col sm={6}>
          <Card body style={cardStyles}>
            <Card.Title>Creep Designer</Card.Title>
            <Card.Text>Evaluate the potential of your creeps with the Creep Designer.</Card.Text>
            <Link to="/creep-designer">
              <Button>Design Creep</Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
