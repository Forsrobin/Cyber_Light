import React from 'react';
import logo from './logo.svg';
import './App.css';


import SocketIOClient from 'socket.io-client';
const socket = SocketIOClient();


function toggleOnOff(e) {
  e.preventDefault();
  socket.emit("toggleOnOff");
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 50,
    };
  }


  componentDidMount() {
    
  }

  updateSlider = (e) => {
    this.setState({ sliderValue: e.target.value });
    socket.emit("changeSlider", {sliderValue: e.target.value} );
  }
 

  render() {
    return (
      <div className="App">
        <h1>{this.state.sliderValue}</h1>
        <button onClick={toggleOnOff}>Toggle</button>
        <input type="range" min="1" max="255"  id="myRange" onChange={this.updateSlider}/>
      </div>
    );
  }
}

export default App;
