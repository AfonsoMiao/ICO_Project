import React from 'react';
import {Form} from 'react-bootstrap';


class Optimizer extends React.Component {



    render() {
        return(
            <div style={{margin: "10px"}}>
                <h1>Otimização</h1>
                <Form>
                    <Form.Check type={"checkbox"} label="option 1" />
                    <Form.Check type={"checkbox"} label="option 2" />
                </Form>
            </div>
        );
    }


}

export default Optimizer;