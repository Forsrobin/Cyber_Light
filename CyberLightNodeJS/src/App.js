import React, {Component} from 'react';
import './App.css';
import { CirclePicker    } from 'react-color';

import SocketIOClient from 'socket.io-client';

const socket = SocketIOClient();




class Color extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColor: "#ffffff",
    };
  }


  //When dragging color slider
  changeColor = (colorInput) => {

    var color = colorInput.hex;
    color = color.substr(1);

    var data = {
      color,
    }

    socket.emit("useFunctionFromClient", {type: "set", deviceSocketId: this.props.socketId, clientSocketId: socket.id, function:"color", data });
    this.updateInputColor(0);

  }

  //Ask the device what the current color is 
  updateInputColor = (iniBool) => {
    socket.emit("useFunctionFromClient", {type: "get", iniBool, deviceSocketId: this.props.socketId, clientSocketId: socket.id, function:"color" });
  }

  //Ask what color and start the listener for color updates
  componentDidMount() {
    this.updateInputColor(1);

    socket.on("colorPushDataToClients", (data) => {      
      this.setState({ currentColor: data["data"]["hex_color"] });
    });
  }

  render() {
    return (
      <div style={{ width: "100%", display: "inline-flex"}}>
        <CirclePicker color={this.state.currentColor} width="294px" colors={
        [
        "#A800FF", "#60019D" , "#0000FF", "#00FF00", "#FFEF00", "#FF7F00", "#FF0000", 
        "#FFFFFF", "#FFFFDB", "#FFFFC3", "#FEFFAE", "#FEFFA5", "#efd288", "#e0ba69"
        ]
        }  onChange={this.changeColor} />
      </div>
    )
  }
}


class ToggleLedButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onOffButtonBoolean: "1",
      onOffButtonText: "",
    };
  }

  convertButtonValue = (onOffButtonBoolean) => {
    if (onOffButtonBoolean === "1") {
      this.setState({ onOffButtonText: 'On' });
    } else if(onOffButtonBoolean === "0") {
      this.setState({ onOffButtonText: 'Off' });
    }
  }

  toggleOnOff = () => {

    socket.emit("useFunctionFromClient", {type: "set", deviceSocketId: this.props.socketId, clientSocketId: socket.id, function:"switchOnOff"});
    this.updateSwitchOnOff(1);

  }

  updateSwitchOnOff = (iniBool) => {
    socket.emit("useFunctionFromClient", {type: "get", iniBool, deviceSocketId: this.props.socketId, clientSocketId: socket.id, function:"switchOnOff" });
  }

  componentDidMount() {

    this.updateSwitchOnOff(1);

    socket.on("switchOnOffPushDataToClients", (data) => {
      this.setState({ onOffButtonBoolean: data["data"]["newState"] });
      this.convertButtonValue(data["data"]["newState"]);
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.toggleOnOff}>{this.state.onOffButtonText}</button>
      </div>
    )
  }
}

class Brightness extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brightness: "",
    };

  }

  changeBrightness = (iniBool) => {
    socket.emit("useFunctionFromClient", {type: "get", iniBool, deviceSocketId: this.props.socketId, clientSocketId: socket.id, function:"brightness" });
  }

  updateBrightness = (e) => {

    e.preventDefault();
    this.setState({brightness: e.target.value})
    var data = { brightnessValue: e.target.value,}

    socket.emit("useFunctionFromClient", {type: "set", deviceSocketId: this.props.socketId, clientSocketId: socket.id, function:"brightness", data});

    //Efter jag har updaterat så ska jag ändra för alla andra förutom mig själv
    this.changeBrightness(0);

  }

  componentDidMount() {

    this.changeBrightness(1);

    socket.on("brightnessPushDataToClients", (data) => {      
      this.setState({ brightness: data["data"]["brightness_value"] });
    });

  }

  render() {
    return (
      <div>
        <input type="range" min="20" max="255" value={this.state.brightness} id="myRange" onChange={this.updateBrightness}/>
      </div>
    );
  }
}

class Modes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  staticColor = () => {

    var data = {};
    socket.emit("useFunctionFromClient", {type: "set", deviceSocketId: this.props.socketId, clientSocketId: socket.id, function:"staticColor", data});

  }

  theaterChase = () => {

    var data = {speed: 50};
    socket.emit("useFunctionFromClient", {type: "set", deviceSocketId: this.props.socketId, clientSocketId: socket.id, function:"theaterChase", data});

  }

  startRainbow = () => {
    
    var data = {speed: 10};
    socket.emit("useFunctionFromClient", {type: "set", deviceSocketId: this.props.socketId, clientSocketId: socket.id, function:"rainbow", data});

  }

  raveMode = () => {
    
    var data = {speed: 10};
    socket.emit("useFunctionFromClient", {type: "set", deviceSocketId: this.props.socketId, clientSocketId: socket.id, function:"raveMode", data});

  }


  render() {

    //Kolla alla olika produkter och ge ut rätt modes till dem
    // [1] = Led Strip (Vanlig)
    // [2] =  Audio Reactive Led Strip (Har suport för att synka till ljud)


      return (
        <div className="modesWrapper">
              <button onClick={this.startRave}>Rave</button>
              <button onClick={this.startRainbow}>Rainbow</button>
              <button onClick={this.raveMode}>Strobe</button>
              {/* <button onClick={this.theaterChase}>TheaterChase</button> */}
              <button onClick={this.staticColor}>Static</button>
        </div>
      );
  }
}


class DeviceFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <div className="deviceFragment">
        <h2 className="title">{this.props.deviceObject.name}</h2>
        <p className="ip">{this.props.deviceObject.ip}</p>
        <div className="controllButtons">
          <ToggleLedButton socketId={this.props.deviceObject.socketId} />
          <Brightness socketId={this.props.deviceObject.socketId} />
          <Modes socketId={this.props.deviceObject.socketId} />
          <Color socketId={this.props.deviceObject.socketId} />


        </div>
      </div>
    );
  }
}



class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: []
    };
  }

  componentDidMount() {
    socket.emit("getConnectedDevices", (callbackData) => {
      console.log("Updated");
      this.setState({devices: callbackData});
    });

    socket.on("pushDevicesToAllClients", (data) => {
      console.log("Updated");
      this.setState({devices: data});
    });
  }

  render() {
    return (
      <div className="wrapperDevices">
          {this.state.devices.map((device, idx) => {
            return (<DeviceFragment key={idx} deviceObject={device} />)
          })}
      </div>
    );
  }
}





class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentDidMount() {
    socket.on('storeClientInfoGet', (callback) => {
      socket.emit("storeClientInfo");
  });
  }

  render() {
    return (
      <div className="App">
        <DeviceList />

      
      </div>
    );
  }
}

export default App;
