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
      currentColor: "#333333",
    };
  }

  getCurrentColor = () => {
    console.log("dsaads");
  };

  changeColor = (e) => {

    var color = e.target.value;
    color = color.substr(1);
    socket.emit("changeColor", color);
    this.getCurrentColor();

  }

  componentDidMount() {
    this.getCurrentColor();
  }

  render() {
    return (
      <div>
        <input type="color" onChange={this.changeColor}></input>
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
    socket.emit("getCurrentSliderValue", (callbackData) => {      
      this.setState({ sliderValue: callbackData });
      this.convertSliderValue(callbackData);
    });

    socket.on("returnSliderDataFromMCU", (data) => {
      this.convertSliderValue(data);
    });
  }

  convertSliderValue = (slidVal) => {
      this.setState({ sliderValue: slidVal });
  }

  componentDidMount() {
    this.getCurrentSliderValue();
  }

  updateSlider = (e) => {

    e.preventDefault();
    socket.emit("changeSlider", {sliderValue: e.target.value} ); //Update ljusstyrkan på ardiono
    this.getCurrentSliderValue(); //Updatera värden på alla sockets

  }

  render() {
    return (
      <div>
        <h1>{this.state.sliderValue}</h1>
        <input type="range" min="20" max="255"  value={this.state.sliderValue} id="myRange" onChange={this.updateSlider}/>
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
        <ToggleLedButton />
        <Slider />
        <ChangeColor />
        <ul>
          <li>
            <button>Rave</button>
            <button>Rainbow</button>
            <button>Static</button>
          </li>
        </ul>
      </div>
    );
  }
}

export default App;
