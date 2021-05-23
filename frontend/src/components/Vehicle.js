import React from 'react';
import {Col, Form, ListGroup} from 'react-bootstrap';
import { MdControlPoint } from 'react-icons/md'
import {Navbar, Button} from 'react-bootstrap';


class Vehicle extends React.Component {


    onFormChange_capacity = async (event, index) => {
        console.log("Index: ", index)
        this.props.handleVehicle_capacity(index, event.target.value)
    }

    onFormChange_cost = async (event, index) => {
        this.props.handleVehicle_cost(index, event.target.value)
    }

    removeVehicle = async(index) => {
        this.props.removeVehicle(index)
    }

    render() {
        let vehicle_render = [];
        let scrollableStyle = (this.props.list.length >= 3) ? {overflowY: "scroll", height: "30vh", border: "solid lightgray", borderWidth: "thin"} : {border: "solid lightgray", borderWidth: "thin"}

        for(const [index, value] of this.props.list.entries()) {
            let object_index = value.index;
            let capacity = value.capacidade;
            let cost = value.custo;
            let style = (index != (this.props.list.length-1)) ? {borderBottom: "none"} : null
            vehicle_render.push(
            <ListGroup.Item key={object_index} style={style}>
                <Form>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formVehicleCapacity">
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control placeholder="Capacity" value={capacity} onChange={(e) => this.onFormChange_capacity(e, object_index)}/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formVehicleCost">
                            <Form.Label>Cost</Form.Label>
                            <Form.Control placeholder="Cost" value={cost} onChange={(e) => this.onFormChange_cost(e, object_index)}/>
                        </Form.Group>
                        <div style={{marginTop: "32px"}}>
                            <Button onClick={(e) => this.removeVehicle(object_index)}>Delete</Button>
                        </div>
                    </Form.Row>
                </Form>
            </ListGroup.Item> 
            )
          }
        return(
            <div style={{margin: "10px"}}>
                <h1>Veiculo</h1>
                <div style={scrollableStyle}>
                    {vehicle_render}
                </div>
                <br></br>
            </div>
        );
    }
}

export default Vehicle;