import React, { Component } from "react";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Header from "./components/Header";

import "./App.css";

const TOKEN =
  "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiIyIiwiZXhwIjoxNTAzMjcwMTE1fQ.aXv9OV79QSz2VXBEqZpL95M1Pzjpy3Nv8V1fPZo_5R6_jg6VR05MRvDOsDEBu-ou10ntgjHGkQ55SDCgInB7FA";
const URL = "https://m1ndoce0cl.execute-api.eu-west-1.amazonaws.com/v1";

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Header token={TOKEN} url={URL} />
      </MuiThemeProvider>
    );
  }
}

export default App;
