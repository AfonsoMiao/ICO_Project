import React from 'react';
import {Col, Form, ListGroup} from 'react-bootstrap';

class CentroDeFornecimento extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            index: this.props.index,
            longitude: this.props.longitude,
            latitude: this.props.latitude,
            doStyle: this.props.doStyle,
        }
    }

    render() {
        console.log("Should style: ", this.state.doStyle)
        return(
            <ListGroup.Item key={this.state.index} style={this.state.doStyle ? {borderBottom: "none"} : null}>
                <Form>
                    <Form.Row>
                    <Form.Group as={Col} controlId="formFornecimentoLongitude">
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control placeholder="Longitude" value={this.state.longitude}/>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formFornecimentoLatitude">
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control placeholder="Latitude" value={this.state.latitude}/>
                    </Form.Group>
                    </Form.Row>
                </Form>
          </ListGroup.Item>
        );
    }
}

export default CentroDeFornecimento;