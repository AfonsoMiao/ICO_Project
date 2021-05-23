import React from 'react';
import {Form} from 'react-bootstrap';


class Optimizer extends React.Component {

    onSelect = async (event) => {
        this.props.handleOptimizer(event.target.value)
    }

    render() {
        return(
            <div style={{margin: "10px"}}>
                <h1>Otimização</h1>
                <Form>
                    <Form.Check onChange={this.onSelect.bind(this)} type={"checkbox"} label="Minimizar distância" value="Minimizar distância"/>
                    <Form.Check onChange={this.onSelect.bind(this)} type={"checkbox"} label="Minimizar tempo" value="Minimizar tempo"/>
                    <Form.Check onChange={this.onSelect.bind(this)} type={"checkbox"} label="Minimizar veículos" value="Minimizar veículos"/>
                </Form>
            </div>
        );
    }


}

export default Optimizer;