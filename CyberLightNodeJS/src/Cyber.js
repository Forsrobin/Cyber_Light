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
      onOffButtonText: "Searching...",
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
    socket.emit("getCurrentButtonValue", (callbackData) => {      
      this.setState({ onOffButtonBoolean: callbackData });
      this.convertButtonValue(callbackData);
    });

    socket.on("returnDataFromMCU", (data) => {
      this.convertButtonValue(data);
    });
  }


  componentDidMount() {
    this.getCurrentButtonValue();
  }

  toggleOnOff = (e) => {
    e.preventDefault();
    
    socket.emit("toggleOnOff");
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
    this.getCurrentSliderValue(); //OnMount kör funktionen 

    socket.on("serverToClients", (data) => {
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


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <div className="App">
        
      <div className="wrapper">
        <h1>Cyber </h1>
        <h2>Light</h2>
        <svg height={320} width={400} className="logo-triangle">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: 'rgb(50,50,50)', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: 'black', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          <filter id="dropshadow" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation={3} />
            <feOffset dx={2} dy={2} result="offsetblur" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <polygon points="0,0 400,0 200,300" stroke="#36e2f8" strokeWidth={3} />
        </svg>
        <div className="grid" />
        <ToggleLedButton />
        <Slider />
        <ChangeColor />
        <Modes />
      </div>

      
      </div>
    );
  }
}

export default App;
