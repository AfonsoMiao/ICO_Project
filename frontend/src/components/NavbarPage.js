import React from 'react';
import {Navbar} from 'react-bootstrap';


export default class NavBarPage extends React.Component {

    render() {
        return(
            <Navbar bg="light" expand="lg">
                  <Navbar.Brand>Vehicle Routing Problem</Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
            </Navbar>
        );
    }
}