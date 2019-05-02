import React, { Component } from "react";

import "./App.css";
import axios from "axios";
class App extends Component {
  constructor() {
    super();
    this.state = {
      feetTraveled: 0,
      milesTraveled: 0,
      mouseClicks: 0,
      itemsCopied: 0,
      itemsCut: 0,
      itemsPasted: 0,
      screenPPI: 1692
    };
  }
  componentWillMount() {
    axios
      .get("http://localhost:31415/loaded")
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  componentDidMount() {
    this.timer = setInterval(() => this.getMovies(), 2000);
  }
  async getMovies() {
    axios
      .get("http://localhost:31415")
      .then(response => {
        this.setState({
          feetTraveled: response.data.feetTraveled,
          milesTraveled: response.data.milesTraveled,
          mouseClicks: response.data.mouseClicks,
          itemsCopied: response.data.itemsCopied,
          itemsCut: response.data.itemsCut,
          itemsPasted: response.data.itemsPasted
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  handleChange(event) {
    this.setState({ screenPPI: event.target.value }, () => {
      axios
        .post("http://localhost:31415/ppi", {
          body: {
            screenPPI: this.state.screenPPI
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="section-container">
            <div className="section-container-content">
              <p className="number">{this.state.milesTraveled}</p>
              <p>Miles Traveled</p>
            </div>
          </div>
          <div className="section-container">
            <div className="section-container-content">
              <p className="number">{this.state.feetTraveled}'</p>
              <p>Feet Traveled</p>
            </div>
          </div>
          <div className="section-container">
            <div className="section-container-content">
              <p className="number">{this.state.mouseClicks}</p>
              <p>Mouse Clicks</p>
            </div>
          </div>
          <hr />
          <div className="section-container">
            <div className="section-container-content">
              <p className="number">{this.state.itemsCopied}</p>
              <p>Items Copied</p>
            </div>
          </div>
          <div className="section-container">
            <div className="section-container-content">
              <p className="number">{this.state.itemsCut}</p>
              <p>Items Cut</p>
            </div>
          </div>
          <div className="section-container">
            <div className="section-container-content">
              <p className="number">{this.state.itemsPasted}</p>
              <p>Items Pasted</p>
            </div>
          </div>
          <div className="PPI-form">
            <div className="form-container">
              <span>Enter Your Screen's PPI:</span>
              <form>
                <input
                  type="number"
                  defaultValue="141"
                  onChange={this.handleChange.bind(this)}
                />
              </form>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
