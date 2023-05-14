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
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div className="screeps-tools">
      <Navbar className="header">
        <Navbar.Brand href="/">
          <img src={process.env.PUBLIC_URL + '/img/logo.png'} className="logo" alt="Screeps Tools" />
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
            <Card.Text>
              Introducing the Building Planner, a powerful utility that empowers you to craft the ultimate base layout
              for any room in Screeps.
            </Card.Text>
            <Link to="/building-planner">
              <Button>View Building Planner</Button>
            </Link>
          </Card>
        </Col>
        <Col sm={6}>
          <Card body style={cardStyles}>
            <Card.Title>Creep Designer</Card.Title>
            <Card.Text>
              Try the Creep Designer, a stat calculator used to create and customize creeps for any role in your Screeps
              empire.
            </Card.Text>
            <Link to="/creep-designer">
              <Button>View Creep Designer</Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
