import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';


import SocketIOClient from 'socket.io-client';
import { log } from 'util';
const socket = SocketIOClient();

class ChangeColor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColor: "#aaaaaa",
    };
  }

  changeColor = (e) => {

    var color = e.target.value;
    color = color.substr(1);

    socket.emit("changeColor", color);
    this.updateInputColor();

  }

  setColor = (data) => {
    this.setState({ currentColor: data });
  }

  updateInputColor = () => {

    socket.emit("getColorArduinoCall", (callbackData) => {
      console.log("Hello");
      this.setState({ currentColor: callbackData });
      this.setColor(callbackData);
    });

    socket.on("returnColorData", (data) => {
      this.setColor(data);
    });

  }

  componentDidMount() {
    this.updateInputColor();
  }

  render() {
    return (
      <div>
        <input type="color" value={this.state.currentColor} onChange={this.changeColor}></input>
      </div>
    )
  }
}


class ToggleLedButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onOffButtonBoolean: 0,
      onOffButtonText: "",
    };
  }


  convertButtonValue = (onOffButtonBoolean) => {
      if (onOffButtonBoolean === 1) {
        this.setState({ onOffButtonText: 'On' });
      } else {
        this.setState({ onOffButtonText: 'Off' });
      }
  }

  getCurrentButtonValue = () => {
 
    
    socket.emit("getCurrentButtonValue");

    socket.on("returnDataFromDevice", (data) => {
      this.convertButtonValue(data);
    });
  }


  componentDidMount() {
    this.getCurrentButtonValue();
  }

  toggleOnOff = (e) => {
    e.preventDefault();
    
    socket.emit("clientToServerButton");
    this.getCurrentButtonValue();

  }

  render() {
    return (
      <div>
        <button onClick={this.toggleOnOff}>{this.state.onOffButtonText}</button>
      </div>
    )
  }
}

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue : "",
    };
  }

  getCurrentSliderValue = () => {
    socket.emit("startUp", (callbackData) => {      
      this.setState({ sliderValue: callbackData });
    });
  }

  

  componentDidMount() {
    this.getCurrentSliderValue();  

    socket.on("serverToClientsSlider", (data) => {
      this.setState({ sliderValue: data });
    });
  }

  updateSlider = (e) => {

    e.preventDefault();
    socket.emit("clientToServerSlider", {sliderValue: e.target.value} ); //Update ljusstyrkan på Arduino
    this.setState({sliderValue: e.target.value})
  }

  render() {
    return (
      <div>
        <h3>{this.state.sliderValue}</h3>
        <input type="range" min="20" max="255" value={this.state.sliderValue} id="myRange" onChange={this.updateSlider}/>
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

  render() {
    return (
      <div>
            <button>Rave</button>
            <button>Rainbow</button>
            <button>Static</button>
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


class DeviceFragment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <div className="deviceFragment">
        <h2>{this.props.deviceObject.name}</h2>
        <h4>{this.props.deviceObject.ip}</h4>
        <div className="controllButtons">
          <ToggleLedButton socketId={this.props.deviceObject.socketId} />
          <Slider socketId={this.props.deviceObject.socketId} />
          <ChangeColor socketId={this.props.deviceObject.socketId} />
          <Modes socketId={this.props.deviceObject.socketId} />
        </div>
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

  render() {
    return (
      <div className="App">
        <DeviceList />

      
      </div>
    );
  }
}

export default App;
