import React from 'react';
import './App.css';
import { MdControlPoint } from 'react-icons/md'
import {Navbar, Button} from 'react-bootstrap';
import CentroDeFornecimentoForm from "./components/CentroDeFornecimentoForm";
import PontoDeEntrega from "./components/PontoDeEntrega";
import Optimizer from "./components/Optimizer";
import NavBarPage from "./components/NavbarPage";
import axios from "axios";
import image from "./images/TESTE.png"; //Não vou precisar
import { citiesData } from "./resources/cities";

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
          city: "",
          longitude: "",
          latitude: "",
        }],
        list_pontoDeEntrega: [{
          index: 0,
          city: "",
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
        solution: "",
        showSolution: false,
        showImage: false,
        image_path: null,
      }

      this.addCentroDeFornecimento = this.addCentroDeFornecimento.bind(this);
      this.addPontoDeEntrega = this.addPontoDeEntrega.bind(this);
    }


    async componentDidMount() {
      //fetch data do ficheiro json para depois procurar por long/lat
      console.log(citiesData)
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
        city: "",
        longitude: "",
        latitude: ""
      }
      const new_list = this.state.list_centroDeFornecimento.concat(centroDeFornecimento);
      this.setState({
        numberOfCentroDeFornecimento: new_index,
        list_centroDeFornecimento: new_list
      });
    }

    /* handleCentroDeFornecimento_longitude = (index, longitude) => {
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
    } */

    handleCentroDeFornecimento_city = (index, city_parameter) => {
      let list_centroDeFornecimento = [...this.state.list_centroDeFornecimento];
      let centroDeFornecimento = {...list_centroDeFornecimento[index]}
      let city = city_parameter.toLowerCase()
      let index_city = citiesData["index"][city]
      centroDeFornecimento.city = city
      if(index_city != undefined) {
        centroDeFornecimento.latitude = citiesData["data"][index_city].lat;
        centroDeFornecimento.longitude = citiesData["data"][index_city].lng;
      }
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
        city: "",
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

    /* handlePontoDeEntrega_longitude = (index, longitude) => {
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
    } */

    handlePontoDeEntrega_city = (index, city_parameter) => {
      let list_pontoDeEntrega = [...this.state.list_pontoDeEntrega];
      let pontoDeEntrega = {...list_pontoDeEntrega[index]}
      let city = city_parameter.toLowerCase();
      let index_city = citiesData["index"][city]
      console.log("Ponto de entrega: ", index_city)
      pontoDeEntrega.city = city
      if(index_city != undefined) {
        pontoDeEntrega.latitude = citiesData["data"][index_city].lat;
        pontoDeEntrega.longitude = citiesData["data"][index_city].lng;
      }
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
      console.log(this.state)
    }

    otimize = async (event) => {
      const final_json = this.create_final_json();
      const response = await axios.post("/processor/", final_json);
      console.log(response)
      this.setState({solution: JSON.stringify(response["data"]), showSolution: true})
    }

    create_final_json = () => {
      let array_json = [];
      let index_json = {};
      let i = 1;

      this.state.list_centroDeFornecimento.forEach(element => {
        array_json.push({
          "node": i,
          "city": element.city,
          "latitude": element.latitude,
          "longitude": element.longitude,
          "depot": "true"
        });
        i++;
      });

      this.state.list_pontoDeEntrega.forEach(element => {
        array_json.push({
          "node": i,
          "city": element.city,
          "latitude": element.latitude,
          "longitude": element.longitude,
          "depot": "false"
        });
        i++;
      });
      console.log(array_json)
      array_json.forEach(element => {
        let new_index = {}
        new_index[element.node] = element.city
        index_json = Object.assign(new_index, index_json);
      });
    
      let final_json = {};
      final_json["index"] = index_json;
      final_json["data"] = array_json
      console.log("Final JSON: ", final_json)
      return final_json
    }


    /* create_final_json = async(event) => {
      let array_json = [];
      let index_json = {};
      let i = 0;

      this.state.list_centroDeFornecimento.forEach(element => {
        array_json.push({
          "node": i,
          "city": element.city,
          "latitude": element.latitude,
          "longitude": element.longitude,
          "depot": "true"
        });
        i++;
      });

      this.state.list_pontoDeEntrega.forEach(element => {
        array_json.push({
          "node": i,
          "city": element.city,
          "latitude": element.latitude,
          "longitude": element.longitude,
          "depot": "false"
        });
        i++;
      });
      console.log(array_json)
      array_json.forEach(element => {
        let new_index = {}
        new_index[element.node] = element.city
        index_json = Object.assign(new_index, index_json);
      });
    
      let final_json = {};
      final_json["index"] = index_json;
      final_json["data"] = array_json
      console.log("Final JSON: ", final_json)
      return final_json
    } */
    

    //Talvez não seja necessário
    /**
     * 
     * Teste para ir buscar a imagem à pasta images
     */
/*     showImage = async(event) => {
      event.preventDefault();
      const image = require('./images/TESTE.png');
      this.setState({showImage: true, image_path: image});
    }
 */
    render() {
      let render;
      // Teste para ir buscar a imagem à pasta images
      /* if(this.state.showImage == true) {
        render = <img src={this.state.image_path.default} />
      } */
      if(this.state.showSolution == true) {
        render = <div>{JSON.stringify(this.state.solution)}</div>
      }
      return (
        <div>
              <NavBarPage />
              <CentroDeFornecimentoForm 
                list={this.state.list_centroDeFornecimento}
                /* handleCentroDeFornecimento_longitude={this.handleCentroDeFornecimento_longitude.bind(this)}
                handleCentroDeFornecimento_latitude={this.handleCentroDeFornecimento_latitude.bind(this)} */
                handleCentroDeFornecimento_city={this.handleCentroDeFornecimento_city.bind(this)}
                removeCentroDeFornecimento={this.removeCentroDeFornecimento.bind(this)}
              />
              <Button onClick={this.addCentroDeFornecimento}><MdControlPoint /></Button>
              <br></br>
              <PontoDeEntrega
                list={this.state.list_pontoDeEntrega}
                /* handlePontoDeEntrega_longitude={this.handlePontoDeEntrega_longitude.bind(this)}
                handlePontoDeEntrega_latitude={this.handlePontoDeEntrega_latitude.bind(this)} */
                handlePontoDeEntrega_city={this.handlePontoDeEntrega_city.bind(this)}
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
              {/* <Button onClick={this.create_final_json}>Create JSON</Button>
              <br></br> */}
              <Button onClick={this.otimize}>Otimizar</Button>
              <br></br>
              {/* <Button onClick={this.testing}>Test API</Button>
              <Button onClick={this.showImage}>Show Image</Button> */}
              {/* <img src={"static/image.png"} /> */}
              {render}
        </div>
      );
  }
  
}

export default App;
