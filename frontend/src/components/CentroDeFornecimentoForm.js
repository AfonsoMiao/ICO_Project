import React from 'react';
import {Col, Form, ListGroup} from 'react-bootstrap';
import { MdControlPoint } from 'react-icons/md'
import {Navbar, Button} from 'react-bootstrap';


class CentroDeFornecimentoForm extends React.Component {


    /* onFormChange_longitude = async (event, index) => {
        this.props.handleCentroDeFornecimento_longitude(index, event.target.value)
    }

    onFormChange_latitude = async (event, index) => {
        this.props.handleCentroDeFornecimento_latitude(index, event.target.value)
    } */

    onFormChange_city = async (event, index) => {
        this.props.handleCentroDeFornecimento_city(index, event.target.value)
    }

    removeForm = async(index) => {
        this.props.removeCentroDeFornecimento(index)
    }

    render() {
        let centroDeFornecimento_render = [];
        let scrollableStyle = (this.props.list.length >= 3) ? {overflowY: "scroll", height: "30vh"} : null
        for(const [index, value] of this.props.list.entries()) {
            let object_index = value.index;
            let style = (index != (this.props.list.length-1)) ? {borderBottom: "none"} : null
            centroDeFornecimento_render.push(
            <ListGroup.Item key={object_index} style={style}>
                <Form>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formFornecimentoCidade">
                            <Form.Label>Cidade</Form.Label>
                            <Form.Control placeholder="Cidade" onChange={(e) => this.onFormChange_city(e, object_index)}/>
                        </Form.Group>
                       {/*  <Form.Group as={Col} controlId="formFornecimentoLongitude">
                            <Form.Label>Longitude</Form.Label>
                            <Form.Control placeholder="Longitude" onChange={(e) => this.onFormChange_longitude(e, object_index)}/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formFornecimentoLatitude">
                            <Form.Label>Latitude</Form.Label>
                            <Form.Control placeholder="Latitude" onChange={(e) => this.onFormChange_latitude(e, object_index)}/>
                        </Form.Group> */}
                        <Button onClick={(e) => this.removeForm(object_index)}>Delete</Button>
                    </Form.Row>
                </Form>
            </ListGroup.Item> 
            )
          }
        return(
            <div style={{margin: "10px"}}>
                <h1>Centro de Fornecimento</h1>
                <div style={scrollableStyle}>
                    {centroDeFornecimento_render}
                </div>
                    
                <br></br>
            </div>
        );
    }
}

export default CentroDeFornecimentoForm;