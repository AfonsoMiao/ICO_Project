import logo from './logo.svg';
import TESTE from './images/TESTE.png'
import React from 'react';
import './App.css';
import { MdControlPoint } from 'react-icons/md'
import {Navbar, Button} from 'react-bootstrap';
import CentroDeFornecimento from "./components/CentroDeFornecimento";
import CentroDeFornecimentoForm from "./components/CentroDeFornecimentoForm";
import PontoDeEntrega from "./components/PontoDeEntrega";
import Optimizer from "./components/Optimizer";
import NavBarPage from "./components/NavbarPage";
import axios from "axios";
import image from "./images/TESTE.png";

/**
 * Não usar o numberOf... para me guiar como index 
 */

class App extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        numberOfCentroDeFornecimento: 1,
        numberOfPontoDeEntrega: 1,
        list_centroDeFornecimento: [{
          index: 0,
          longitude: "",
          latitude: "",
        }],
        list_pontoDeEntrega: [{
          index: 0,
          longitude: "",
          latitude: "",
          carga: "",
          prioridade: ""
        }],
        numberOfVeiculo: 1,
        list_veiculo: [{
          index: 0,

        }],
        list_toOptimize: [],
        showImage: false,
        image_path: null,
      }

      this.addCentroDeFornecimento = this.addCentroDeFornecimento.bind(this);
      this.addPontoDeEntrega = this.addPontoDeEntrega.bind(this);
    }

    ////////////////////////////////////////////
    ////// CENTRO DE FORNECIMENTO FUNCTIONS ////
    ////////////////////////////////////////////

    addCentroDeFornecimento = async(event) => {
      event.preventDefault();
      console.log("Adicionar novo centro de fornecimento")
      const new_index = this.state.numberOfCentroDeFornecimento+1;
      const centroDeFornecimento = {
        index: this.state.numberOfCentroDeFornecimento,
        longitude: "",
        latitude: ""
      }
      const new_list = this.state.list_centroDeFornecimento.concat(centroDeFornecimento);
      this.setState({
        numberOfCentroDeFornecimento: new_index,
        list_centroDeFornecimento: new_list
      });
    }

    handleCentroDeFornecimento_longitude = (index, longitude) => {
      let list_centroDeFornecimento = [...this.state.list_centroDeFornecimento];
      let centroDeFornecimento = {...list_centroDeFornecimento[index]}
      centroDeFornecimento.longitude = longitude;
      list_centroDeFornecimento[index] = centroDeFornecimento;
      this.setState({list_centroDeFornecimento});
    } 

    handleCentroDeFornecimento_latitude = (index, latitude) => {
      let list_centroDeFornecimento = [...this.state.list_centroDeFornecimento];
      let centroDeFornecimento = {...list_centroDeFornecimento[index]}
      centroDeFornecimento.latitude = latitude;
      list_centroDeFornecimento[index] = centroDeFornecimento;
      this.setState({list_centroDeFornecimento});
    }
    

    removeCentroDeFornecimento = (index) => {
      const numberOfCentroDeFornecimento = this.state.numberOfCentroDeFornecimento - 1;
      let list_centroDeFornecimento = this.state.list_centroDeFornecimento.filter((cf) => cf.index !== index);
      this.setState({numberOfCentroDeFornecimento, list_centroDeFornecimento})
    }


    ////////////////////////////////////////////
    ///////// PONTO DE ENTREGA FUNCTIONS ///////
    ////////////////////////////////////////////

    addPontoDeEntrega = async(event) => {
      event.preventDefault();
      console.log("Adicionar novo ponto de entrega")
      const new_index = this.state.numberOfPontoDeEntrega+1;
      const pontoDeEntrega = {
        index: this.state.numberOfPontoDeEntrega,
        longitude: "",
        latitude: "",
        carga: "",
        prioridade: ""
      }
      const new_list = this.state.list_pontoDeEntrega.concat(pontoDeEntrega);
      this.setState({
        numberOfPontoDeEntrega: new_index,
        list_pontoDeEntrega: new_list
      });
    }

    handlePontoDeEntrega_longitude = (index, longitude) => {
      let list_pontoDeEntrega = [...this.state.list_pontoDeEntrega];
      let pontoDeEntrega = {...list_pontoDeEntrega[index]}
      pontoDeEntrega.longitude = longitude;
      list_pontoDeEntrega[index] = pontoDeEntrega;
      this.setState({list_pontoDeEntrega});
    } 

    handlePontoDeEntrega_latitude = (index, latitude) => {
      let list_pontoDeEntrega = [...this.state.list_pontoDeEntrega];
      let pontoDeEntrega = {...list_pontoDeEntrega[index]}
      pontoDeEntrega.latitude = latitude;
      list_pontoDeEntrega[index] = pontoDeEntrega;
      this.setState({list_pontoDeEntrega});
    }

    handlePontoDeEntrega_carga = (index, carga) => {
      let list_pontoDeEntrega = [...this.state.list_pontoDeEntrega];
      let pontoDeEntrega = {...list_pontoDeEntrega[index]}
      pontoDeEntrega.carga = carga;
      list_pontoDeEntrega[index] = pontoDeEntrega;
      this.setState({list_pontoDeEntrega});
    }
    
    handlePontoDeEntrega_prioridade = (index, prioridade) => {
      let list_pontoDeEntrega = [...this.state.list_pontoDeEntrega];
      let pontoDeEntrega = {...list_pontoDeEntrega[index]}
      pontoDeEntrega.prioridade = prioridade;
      list_pontoDeEntrega[index] = pontoDeEntrega;
      this.setState({list_pontoDeEntrega});
    }

    removePontoDeEntrega = (index) => {
      const numberOfPontoDeEntrega = this.state.numberOfPontoDeEntrega - 1;
      let list_pontoDeEntrega = this.state.list_pontoDeEntrega.filter((pe) => pe.index !== index);
      this.setState({numberOfPontoDeEntrega, list_pontoDeEntrega})
    }

    /**
     * Ir buscar todos os valores que existem e chamar a função do jmetal através do django
     */
   /*  optimizeAlgorithm = () => {
      
    } */

    
    showConsole = () => {
      console.log(image)
    }

    testing = async (event) => {
      const response = await axios.get("/processor/")
      console.log(response)
    }
    /**
     * 
     * Teste para ir buscar a imagem à pasta images
     */
    showImage = async(event) => {
      event.preventDefault();
      const image = require('./images/TESTE.png');
      this.setState({showImage: true, image_path: image});
    }

    render() {
      let render;
      // Teste para ir buscar a imagem à pasta images
      if(this.state.showImage == true) {
        render = <img src={this.state.image_path.default} />
      }
      return (
        <div>
              <NavBarPage />
              <CentroDeFornecimentoForm 
                list={this.state.list_centroDeFornecimento}
                handleCentroDeFornecimento_longitude={this.handleCentroDeFornecimento_longitude.bind(this)}
                handleCentroDeFornecimento_latitude={this.handleCentroDeFornecimento_latitude.bind(this)}
                removeCentroDeFornecimento={this.removeCentroDeFornecimento.bind(this)}
              />
              <Button onClick={this.addCentroDeFornecimento}><MdControlPoint /></Button>
              <br></br>
              <PontoDeEntrega
                list={this.state.list_pontoDeEntrega}
                handlePontoDeEntrega_longitude={this.handleCentroDeFornecimento_longitude.bind(this)}
                handlePontoDeEntrega_latitude={this.handleCentroDeFornecimento_latitude.bind(this)}
                handlePontoDeEntrega_carga={this.handlePontoDeEntrega_carga}
                handlePontoDeEntrega_prioridade={this.handlePontoDeEntrega_prioridade}
                removePontoDeEntrega={this.removeCentroDeFornecimento.bind(this)}
              />
              <Button onClick={this.addPontoDeEntrega}><MdControlPoint /></Button>
              <br></br>
              <Optimizer />
              <br></br><br></br>
              <Button onClick={this.showConsole}>Show State</Button>
              <br></br>
              <Button onClick={this.testing}>Test API</Button>
              <Button onClick={this.showImage}>Show Image</Button>
              {/* <img src={"static/image.png"} /> */}
              {render}
        </div>
      );
  }
  
}

export default App;
