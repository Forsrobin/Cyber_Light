import React, {Component} from 'react';
import './App.css';
import { HuePicker    } from 'react-color';

import SocketIOClient from 'socket.io-client';

const socket = SocketIOClient();

class ChangeColor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColor: "#ffffff",
    };
  }

  changeColor = (color) => {

    var color = color.hex;
    color = color.substr(1);

    var data = {
      function: "changeColor",
      dataObject: {
        color: color.hex,
      }
    }

    socket.emit("useFunctionFromClient", data);
    this.updateInputColor();

  }

  setColor = (data) => {
    this.setState({ currentColor: data });
  }

  updateInputColor = () => {

    socket.emit("getColorArduinoCall");

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
        <HuePicker color={this.state.currentColor} onChange={this.changeColor} />
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

   
  }


  componentDidMount() {
    this.getCurrentButtonValue();

    socket.on("serverToClientButton", (data) => {
      this.convertButtonValue(data);
    });
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
    socket.emit("getCurrentSliderValue");
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
      <div className="modesWrapper">
            <button>Rave</button>
            <button>Rainbow</button>
            <button>Static</button>
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
          <Slider socketId={this.props.deviceObject.socketId} />
          <Modes socketId={this.props.deviceObject.socketId} />
          <ChangeColor socketId={this.props.deviceObject.socketId} />
          
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

  render() {
    return (
      <div className="App">
        <DeviceList />

      
      </div>
    );
  }
}

export default App;
