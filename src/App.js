import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from './components/Header';

import './App.css';


const TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiIyIiwiZXhwIjoxNTAwNTA5NDM0fQ.KJ0tIKMrO4gm48OmkhlOiAdVl_6ECVsygxEhC2UkWCpCduDui6o4EDkpUwpjcsC2Hg9jpFszSRHdVZycvjiHpg"
const URL = "https://m1ndoce0cl.execute-api.eu-west-1.amazonaws.com/v1"

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Header token={TOKEN} url={URL} />
      </MuiThemeProvider>
    )
  }
}

export default App;
