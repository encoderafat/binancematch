import React,{useState} from 'react';
import {Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';


const Toolbar = () => {
    const [activeItem,setActiveItem] = useState('DEX');

    const menuClick = (e,{name}) => {
        setActiveItem(name);
        //console.log(e);
    }
    return (
        <Menu pointing secondary>
        <Menu.Item as={ Link }
          name='DEX'
          active={activeItem === 'DEX'}
          onClick={menuClick}
          to="/"
        />
        <Menu.Item as={ Link }
          name='Tokens'
          active={activeItem === 'Tokens'}
          onClick={menuClick}
          to="/Tokens"
        />
        <Menu.Item as={ Link }
          name='Pairs'
          active={activeItem === 'Pairs'}
          onClick={menuClick}
          to="/Pairs"
        />
        <Menu.Item as={ Link }
          name='Faucet'
          active={activeItem === 'Faucet'}
          onClick={menuClick}
          to="/Faucet"
        />
        <Menu.Item as={ Link }
          name='Orders'
          active={activeItem === 'Orders'}
          onClick={menuClick}
          to="/Orders"
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='DEX TESTBED'
            active={activeItem === 'DEX TESTBED'}
            onClick={menuClick}
          />
        </Menu.Menu>
      </Menu>
    )
}

export default Toolbar;