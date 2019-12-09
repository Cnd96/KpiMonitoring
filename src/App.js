import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import HomePage from '../src/Pages/HomePage/HomePage';
import LoginPage from '../src/Pages/LoginPage/LoginPage';

import Screen from '../src/Pages/Screen/ScreenDashBoard';
const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

class App extends Component {

  render() {
    return (
      <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
            <Route path="/nervecenter/screenDashBoard/:plantId" name="Screen" render={props => <Screen {...props}/>} />
            <Route path="/nervecenter/home" name="Home" render={props => <HomePage {...props}/>} />
            <Route path="/" name="Login" render={props => <LoginPage {...props}/>} />
            </Switch>
          </React.Suspense>
      </HashRouter>
    );
  }
}
export default App;
