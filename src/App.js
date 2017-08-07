import React, { Component } from "react";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Header from "./components/Header";

import "./App.css";

const TOKEN =
  "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiIyIiwiZXhwIjoxNTA0NTM1OTMzfQ.SnYX9xBGhsT5VhsNlhI6mI-fJd6QduJVOj7AiNUyQgf3ROhFoJt_nFcs945OeReL7JvEETSnjRb4Z-llARIuBw";
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
