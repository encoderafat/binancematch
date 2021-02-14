import React from 'react'; 
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Home from './containers/Home';
import Faucet from './containers/Faucet';
import Pairs from './containers/Pairs';
import Tokens from './containers/Tokens';
import UserOrders from './containers/UserOrders';

function getLibrary(provider, connector) {
  return new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
}

function App() {

  return (
    <Router>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Switch>
          <Route path="/Tokens">
            <Tokens />
          </Route>
          <Route path="/Pairs">
            <Pairs />
          </Route>
          <Route path="/Faucet">
            <Faucet />
          </Route>
          <Route path="/Orders">
            <UserOrders />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Web3ReactProvider>
    </Router>
  );
}

export default App;
