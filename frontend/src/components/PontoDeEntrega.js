import React from 'react';
import {Col, Form, ListGroup} from 'react-bootstrap';
import { MdControlPoint } from 'react-icons/md'
import {Navbar, Button} from 'react-bootstrap';

/**
 * Carga
 * Prioridade
 */
class PontoDeEntrega extends React.Component {


    /* onFormChange_longitude = async (event, index) => {
        this.props.handlePontoDeEntrega_longitude(index, event.target.value)
    }

    onFormChange_latitude = async (event, index) => {
        this.props.handlePontoDeEntrega_latitude(index, event.target.value)
    } */

    onFormChange_city = async (event, index) => {
        this.props.handlePontoDeEntrega_city(index, event.target.value)
    }

    onFormChange_carga = async (event, index) => {
        this.props.handlePontoDeEntrega_carga(index, event.target.value)
    }

    onFormChange_prioridade = async (event, index) => {
        this.props.handlePontoDeEntrega_prioridade(index, event.target.value)
    }

    removeForm = async(index) => {
        this.props.removePontoDeEntrega(index)
    }

    render() {
        let pontoDeEntrega_render = [];
        let scrollableStyle = (this.props.list.length >= 3) ? {overflowY: "scroll", height: "30vh"} : null
        //console.log("scrollableStyle: ", scrollableStyle)
        for(const [index, value] of this.props.list.entries()) {
            let object_index = value.index;
            let style = (index != (this.props.list.length-1)) ? {borderBottom: "none"} : null
            pontoDeEntrega_render.push(
            <ListGroup.Item key={object_index} style={style}>
                <Form>
                    <Form.Row>
                       {/*  <Form.Group as={Col} controlId="formEntregaLongitude">
                            <Form.Label>Longitude</Form.Label>
                            <Form.Control placeholder="Longitude" onChange={(e) => this.onFormChange_longitude(e, object_index)}/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formEntregaLatitude">
                            <Form.Label>Latitude</Form.Label>
                            <Form.Control placeholder="Latitude" onChange={(e) => this.onFormChange_latitude(e, object_index)}/>
                        </Form.Group> */}
                        <Form.Group as={Col} controlId="formEntregaCity">
                            <Form.Label>Cidade</Form.Label>
                            <Form.Control placeholder="Cidade" onChange={(e) => this.onFormChange_city(e, object_index)}/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formEntregaCarga">
                            <Form.Label>Carga</Form.Label>
                            <Form.Control placeholder="Carga" onChange={(e) => this.onFormChange_carga(e, object_index)}/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formEntregaPrioridade">
                            <Form.Label>Prioridade</Form.Label>
                            <Form.Control placeholder="Prioridade" onChange={(e) => this.onFormChange_prioridade(e, object_index)}/>
                        </Form.Group>
                        <div as={Col}>
                            <Button onClick={(e) => this.removeForm(object_index)}>Delete</Button>
                        </div>
                    </Form.Row>
                </Form>
            </ListGroup.Item> 
            )
          }
        return(
            <div style={{margin: "10px"}}>
                <h1>Ponto De Entrega</h1>
                <div style={scrollableStyle}>
                    {pontoDeEntrega_render}
                </div>
                    
                <br></br>
            </div>
        );
    }
}

export default PontoDeEntrega;