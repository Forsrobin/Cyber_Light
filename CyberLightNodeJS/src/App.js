import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';


import SocketIOClient from 'socket.io-client';
const socket = SocketIOClient();



class ToggleLedButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onOffButtonBoolean: 0,
      onOffButtonText: 0,
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



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 50,
    };
  }

  updateSlider = (e) => {
    this.setState({ sliderValue: e.target.value });
    socket.emit("changeSlider", {sliderValue: e.target.value} );
  }
 

  render() {
    return (
      <div className="App">
        <h1>{this.state.sliderValue}</h1>
        <ToggleLedButton />
        <input type="range" min="1" max="255"  id="myRange" onChange={this.updateSlider}/>
      </div>
    );
  }
}

export default App;
