import { Navbar, Container, Nav } from "react-bootstrap";
import HeaderBg from '../assets/images/header-bg.svg';

function Header() {
    return (
        <Navbar collapseOnSelect expand="lg" style={{ backgroundImage: `url(${HeaderBg})`, backgroundPosition: 'center' }}>
            <Container>
                <Nav className="mx-auto">
                    <Navbar.Brand className="fw-bold fs-3 mb-4">Market Maker</Navbar.Brand>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Header;