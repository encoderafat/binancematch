import React from 'react';
import {Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';


const Toolbar = () => {
    return (
        <Menu inverted>
        <Menu.Item as={ Link }
          name='DEX'
          to="/"
        />
        <Menu.Item as={ Link }
          name='Tokens'
          to="/Tokens"
        />
        <Menu.Item as={ Link }
          name='Pairs'
          to="/Pairs"
        />
        <Menu.Item as={ Link }
          name='Faucet'
          to="/Faucet"
        />
        <Menu.Item as={ Link }
          name='Orders'
          to="/Orders"
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='BSC TESTNET DEX'
          />
        </Menu.Menu>
      </Menu>
    )
}

export default Toolbar;