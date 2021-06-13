import React from 'react';
import './App.css';
import { MdControlPoint } from 'react-icons/md'
import {Navbar, Button} from 'react-bootstrap';
import CentroDeFornecimentoForm from "./components/CentroDeFornecimentoForm";
import PontoDeEntrega from "./components/PontoDeEntrega";
import Optimizer from "./components/Optimizer";
import NavBarPage from "./components/NavbarPage";
import Vehicle from "./components/Vehicle";
import axios from "axios";
import { citiesData } from "./resources/cities";


class App extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        numberOfCentroDeFornecimento: 1,
        numberOfPontoDeEntrega: 4,
        numberOfVehicles:3,
        list_centroDeFornecimento: [{
          index: 0,
          city: "Lisboa",
          longitude: "-9.1604",
          latitude: "38.7452",
        }],
        list_pontoDeEntrega: [{
          index: 0,
          city: "Porto",
          longitude: "-8.6108",
          latitude: "41.1495",
          carga: "20"
        },
        {
          index: 1,
          city: "Braga",
          longitude: "-8.4167",
          latitude: "41.5333",
          carga: "10"
        },
        {
          index: 2,
          city: "Torres Vedras",
          longitude: "-9.2667",
          latitude: "39.0833",
          carga: "30"
        },
        {
          index: 3,
          city: "Setubal",
          longitude: "-8.8926",
          latitude: "38.5243",
          carga: "5"
        }
        ],
        list_veiculo: [{
          index: 0,
          capacidade: 100,
          custo: 1.5
        },
        {
          index: 1,
          capacidade: 100,
          custo: 0.5
        },
        {
          index: 2,
          capacidade: 100,
          custo: 0.3
        }
        ],
        /* list_veiculo: [], */
        list_toOptimize: [0,0,0,0],
        solution: "",
        showSolution: false,
        showImage: false,
        image_path: null,
      }

      /* this.addCentroDeFornecimento = this.addCentroDeFornecimento.bind(this); */
      this.addPontoDeEntrega = this.addPontoDeEntrega.bind(this);
    }


    async componentDidMount() {
      //fetch data do ficheiro json para depois procurar por long/lat
      console.log(citiesData)
    }

    ////////////////////////////////////////////
    ////// CENTRO DE FORNECIMENTO FUNCTIONS ////
    ////////////////////////////////////////////

    // Vamos utilizar apenas 1 centro de fornecimento
    /* addCentroDeFornecimento = async(event) => {
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
    } */

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

    /* handleCentroDeFornecimento_city = (index, city_parameter) => {
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
    }  */
    

    /* removeCentroDeFornecimento = (index) => {
      const numberOfCentroDeFornecimento = this.state.numberOfCentroDeFornecimento - 1;
      let list_centroDeFornecimento = this.state.list_centroDeFornecimento.filter((cf) => cf.index !== index);
      this.setState({numberOfCentroDeFornecimento, list_centroDeFornecimento})
    } */


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

   /*  handlePontoDeEntrega_city = (index, city_parameter) => {
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
    } */

    handlePontoDeEntrega_carga = (index, carga) => {
      let list_pontoDeEntrega = [...this.state.list_pontoDeEntrega];
      let pontoDeEntrega = {...list_pontoDeEntrega[index]}
      pontoDeEntrega.carga = carga;
      list_pontoDeEntrega[index] = pontoDeEntrega;
      this.setState({list_pontoDeEntrega});
    }

    removePontoDeEntrega = (index) => {
      const numberOfPontoDeEntrega = this.state.numberOfPontoDeEntrega - 1;
      let list_pontoDeEntrega = this.state.list_pontoDeEntrega.filter((pe) => pe.index !== index);
      let newList = []
      for(let i = 0; i < numberOfPontoDeEntrega; i++) {
        console.log(list_pontoDeEntrega[i])
        newList.push({
          index: i,
          city: list_pontoDeEntrega[i].city,
          longitude: list_pontoDeEntrega[i].longitude,
          latitude: list_pontoDeEntrega[i].latitude,
          carga: list_pontoDeEntrega[i].carga
        })
      }
      console.log(newList)
      this.setState({numberOfPontoDeEntrega: numberOfPontoDeEntrega, list_pontoDeEntrega: newList})
    }

    ////////////////////////////////////////////
    /////////    VEHICLE FUNCTIONS   ///////////
    ////////////////////////////////////////////
    addVehicle = async(event) => {
      event.preventDefault();
      console.log("Adicionar novo veiculo")
      const new_index = this.state.numberOfVehicles+1;
      const vehicle = {
        index: this.state.numberOfVehicles,
        capacidade: "",
        custo: ""
      }
      const new_list = this.state.list_veiculo.concat(vehicle);
      this.setState({
        numberOfVehicles: new_index,
        list_veiculo: new_list
      });
    }

    handleVeiculo_capacidade = (index, capacidade) => {
      let list_veiculo = [...this.state.list_veiculo];
      let vehicle = {...list_veiculo[index]}
      vehicle.capacidade = capacidade;
      list_veiculo[index] = vehicle;
      this.setState({list_veiculo});
    }

    handleVeiculo_custo = (index, custo) => {
      let list_veiculo = [...this.state.list_veiculo];
      let vehicle = {...list_veiculo[index]}
      vehicle.custo = custo;
      list_veiculo[index] = vehicle;
      this.setState({list_veiculo});
    }

    removeVehicle = (index) => {
      const numberOfVehicles = this.state.numberOfVehicles - 1;
      let list_veiculo = this.state.list_veiculo.filter((pe) => pe.index !== index);
      console.log("List veiculo:", list_veiculo)
      let newList = []
      for(let i = 0; i < numberOfVehicles; i++) {
        console.log(i)
        newList.push({
          index: i,
          capacidade: list_veiculo[i].capacidade,
          custo: list_veiculo[i].custo
        })
      }
      console.log(newList)
      this.setState({numberOfVehicles: numberOfVehicles, list_veiculo: newList})
    }

    ////////////////////////////////////////////
    /////////    OPTIMIZER FUNCTIONS     ///////
    ////////////////////////////////////////////

    //handle what to optimize
    handleOptimizer = (option) => {
      let index = 0;
      console.log("Option: ", option)
      switch(option) {
        case 'Minimizar distância':
          index = 0;
          break;
        case 'Minimizar custo':
          index = 1;
          break;
        case 'Minimizar tempo':
          index = 2;
          break;
        case 'Minimizar veículos':
          index = 3;
          break;
        default:
          alert.error("Error while selecting option")
      }
      let list_toOptimize = [...this.state.list_toOptimize];
      list_toOptimize[index] = (list_toOptimize[index] == 0) ? 1 : 0;
      this.setState({list_toOptimize})
    }


    ////////////////////////////////////////////
    /////////     OTHER FUNCTIONS        ///////
    ////////////////////////////////////////////

    
    showConsole = () => {
      console.log(this.state)
    }

    otimize = async (event) => {
      const options = this.state.list_toOptimize.filter((flag) => flag == 1)
      if(options.length == 0) {
        alert("Selecione 1 otimização")
      } else if (this.state.list_veiculo == 0) {
        alert("Introduza 1 veículo")
      }else {
        const final_json = this.create_final_json();
        console.log("final json: ", final_json)
        if(Object.keys(final_json).length === 0) {
          alert("Capacidade ultrapassada")
          return ;
        }
        //console.log(final_json)
        const response = await axios.post("/processor/", final_json);
        console.log("Received: ", response["data"])
        const solution_json = JSON.parse(response["data"])
        console.log("SOLUTION JSON: ", solution_json)
        this.setState({solution: solution_json, showSolution: true})
      }
    }

    create_final_json = () => {
      let array_json = [];
      let vehicle_json = [];
      let i = 0;
      let total_demand = 0;
      let total_car_demand = 0;
      this.state.list_centroDeFornecimento.forEach(element => {
        array_json.push({
          "node": i,
          "city": element.city,
          "latitude": element.latitude,
          "longitude": element.longitude,
          "demand": "0",
          "depot": "true"
        });
        i++;
      });

      this.state.list_pontoDeEntrega.forEach(element => {
        total_demand += parseInt(element.carga)
        array_json.push({
          "node": i,
          "city": element.city,
          "latitude": element.latitude,
          "longitude": element.longitude,
          "demand": element.carga,
          "depot": "false"
        });
        i++;
      });

      i = 0;
      this.state.list_veiculo.forEach(element => {
        total_car_demand += parseInt(element.capacidade)
        vehicle_json.push({
          "id": i,
          "capacity": element.capacidade,
          "cost": element.custo
        });
        i++;
      });
      console.log(total_demand)
      console.log(total_car_demand)

      if (total_demand > total_car_demand) {  
        return {};
      }
      let final_json = {};
      /* final_json["index"] = index_json; */
      final_json["data_vehicles"] = vehicle_json
      final_json["data_nodes"] = array_json
      final_json["optimization"] = this.state.list_toOptimize
      //console.log("Final JSON: ", final_json)
      return final_json
    }

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
      let render = [];
      // Teste para ir buscar a imagem à pasta images
      /* if(this.state.showImage == true) {
        render = <img src={this.state.image_path.default} />
      } */
      if(this.state.showSolution == true) {
        const solution = this.state.solution
        console.log(solution["solutions"])
        const show_optimal_solution = solution["solutions"].length >= 3 ? true : false;
        for(let i = 0; i < solution["solutions"].length; i++) {
          console.log(i)
          if(show_optimal_solution == true && i == (solution["solutions"].length-1)) {
            render.push(<h4 style={{marginTop: "10px"}}>Solução {i} (Equilibrada)</h4>)
          } else {
            render.push(<h4 style={{marginTop: "10px"}}>Solução {i}</h4>)
          }
          for(let k = 0; k < solution["solutions"][i]["route"].length; k++) {
            let car_id = solution["solutions"][i]["route"][k]["vehicle"]
            let car_route = solution["solutions"][i]["route"][k]["sub_route"].toString()
            render.push(
              <div>
                <div><strong>Veículo {car_id}:</strong> {car_route}</div>
              </div>
            )
          }
        } 
      }
        /* for(const [index, value] of solution["solutions"]) {
          for(const [index2, value2] of solution["solutions"][index]["route"]) {
            let car_vehicle = solution["solutions"][index]["route"][index2]["vehicle"]
            let car_route = solution["solutions"][index]["route"][index2]["sub_route"]
            render.push(
              <div>
                <h4>Vehicle {car_vehicle}</h4>
                <div>Route: {car_route}</div>
              </div>
            )
          }
        } */
        /* render = <div>{JSON.stringify(this.state.solution)}</div> */
      //}
      return (
        <div>
              <NavBarPage />
              <CentroDeFornecimentoForm 
                list={this.state.list_centroDeFornecimento}
                handleCentroDeFornecimento_longitude={this.handleCentroDeFornecimento_longitude.bind(this)}
                handleCentroDeFornecimento_latitude={this.handleCentroDeFornecimento_latitude.bind(this)}
                /* handleCentroDeFornecimento_city={this.handleCentroDeFornecimento_city.bind(this)}
                removeCentroDeFornecimento={this.removeCentroDeFornecimento.bind(this)} */
              />
              {/* <Button onClick={this.addCentroDeFornecimento}><MdControlPoint /></Button> */}
              <br></br>
              <PontoDeEntrega
                list={this.state.list_pontoDeEntrega}
                handlePontoDeEntrega_longitude={this.handlePontoDeEntrega_longitude.bind(this)}
                handlePontoDeEntrega_latitude={this.handlePontoDeEntrega_latitude.bind(this)}
                /* handlePontoDeEntrega_city={this.handlePontoDeEntrega_city.bind(this)} */
                handlePontoDeEntrega_carga={this.handlePontoDeEntrega_carga}
                handlePontoDeEntrega_prioridade={this.handlePontoDeEntrega_prioridade}
                removePontoDeEntrega={this.removePontoDeEntrega.bind(this)}
              />
              <Button style={{marginLeft: "10px"}} onClick={this.addPontoDeEntrega}><MdControlPoint /></Button>
              <br></br>
              <Vehicle
                list={this.state.list_veiculo}
                handleVehicle_capacity={this.handleVeiculo_capacidade.bind(this)}
                handleVehicle_cost={this.handleVeiculo_custo.bind(this)}
                removeVehicle={this.removeVehicle.bind(this)}
              />
              <br></br>
              <Button style={{marginLeft: "10px"}} onClick={this.addVehicle}><MdControlPoint /></Button>
              <Optimizer 
                handleOptimizer={this.handleOptimizer.bind(this)}
              />
              <br></br>{/* <br></br> */}
              {/* <Button style={{margin: "10px"}} onClick={this.showConsole}>Show State</Button> */}
              {/* <br></br> */}
              {/* <Button onClick={this.create_final_json}>Create JSON</Button>
              <br></br> */}
              <Button style={{marginLeft: "10px"}} onClick={this.otimize}>Otimizar</Button>
              <br></br>
              {/* <Button onClick={this.testing}>Test API</Button>
              <Button onClick={this.showImage}>Show Image</Button> */}
              {/* <img src={"static/image.png"} /> */}
              <div style={{margin: "10px"}}>
                {render}
              </div>

        </div>
      );
  }
  
}

export default App;
