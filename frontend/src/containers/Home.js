import React, { useState, useEffect } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { ethers } from "ethers";
import { useWeb3React } from '@web3-react/core';
import { injectedConnector } from '../web3/connectors';
import exchange from '../contracts/Dex.json';
import { EXCHANGEADD } from '../assets/Exchange';

import { Balance, TokenList} from '../components/WalletConnector';
import Toolbar from '../components/Toolbar';
import BuySell from '../components/BuySell';
import BuyOrderBook from '../components/BuyOrderBook';
import SellOrderBook from '../components/SellOrderBook';
import PairSelect from '../components/PairSelect';
import Front from '../components/Front';

const Home = () => {
  const [tradingPairs,setTradingPairs] = useState([]);
  const [tradingPairID,setTradingPairID] = useState(1);
  const [numPairs,setNumPairs] = useState(0);
  const [loaded,setLoaded] = useState(false);
  const [firstToken,setFirstToken] = useState('');
  const [firstAddress,setFirstAddress] = useState('');
  const [secondToken,setSecondToken] = useState('');
  const [secondAddress,setSecondAddress] = useState('');

  const { chainId, account, activate, active } = useWeb3React();

  const onButtonClick = () => {
    activate(injectedConnector);
  }

  //console.log(tradingPairs);

  useEffect( () => {
    const getList = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const exchangeAddress = EXCHANGEADD.address;
        //const signer = provider.getSigner();
        const contract = new ethers.Contract(exchangeAddress, exchange.abi, provider);
        let id = (await contract.getTotalPairs()).toNumber();
        let ntoks = 2 *id;
        setNumPairs(ntoks);
        setTradingPairs([]);
        for(let i = 1; i <= id; ++i) {
            let pairInfo = await contract.getPairInfo(i);
            //console.log(pairInfo);
            await setTradingPairs(tradingPairs => [...tradingPairs,{
                id: i,
                tokenAddress1: pairInfo[0].toString(),
                tokenSymbol1: pairInfo[1].toString(),
                tokenAddress2: pairInfo[2].toString(),
                tokenSymbol2: pairInfo[3].toString(),
            }]);
        }

        setLoaded(true);
    }

    if (active) {
      getList();
    }
    
  },[active])

  useEffect(() => {
    if (loaded && tradingPairID > 0) {
      setFirstToken(tradingPairs[tradingPairID-1].tokenSymbol1);
      setSecondToken(tradingPairs[tradingPairID-1].tokenSymbol2);
      setFirstAddress(tradingPairs[tradingPairID-1].tokenAddress1);
      setSecondAddress(tradingPairs[tradingPairID-1].tokenAddress2);
    }
  },[tradingPairs,tradingPairID,loaded]);

  const Wallet = () => {
    return (
      <div>
        <h4>USER ACCOUNT</h4>
        {active ? (
          <div>
            <div>ChainId: {chainId}</div>
            <div>Account: {account}</div>   
          </div>
        ) : (
          <Button primary onClick={onButtonClick}>
            Connect To MetaMask
          </Button>
        )}
        {active && 
        <>
          <Balance />
          <TokenList chainId={chainId} />
        </>
        }
      </div>
    )
  }

  const setPairID = (e,d) => {
    e.preventDefault();
    setTradingPairID(d.value);
  }

  if (active && loaded) {
    return (
      <>
      <Toolbar />
      <Grid divided='vertically'>
        <PairSelect tradingPairs={tradingPairs} setPairID={setPairID} />
        <Grid.Row columns={3}>
          <Grid.Column>
            <Wallet /> 
          </Grid.Column>
          <BuySell tradingPairs={tradingPairs} tradingPairID={tradingPairID} />
        </Grid.Row>
  
        <Grid.Row columns={2}>
          <Grid.Column>
            <h4>SELL ORDERBOOK</h4>
            <SellOrderBook 
            firstToken={firstToken}
            secondToken={secondToken}
            firstAddress={firstAddress}
            secondAddress={secondAddress} />
          </Grid.Column>
          <Grid.Column>
            <h4>BUY ORDERBOOK</h4>
            <BuyOrderBook 
            firstToken={firstToken}
            secondToken={secondToken}
            firstAddress={firstAddress}
            secondAddress={secondAddress} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      </>
      
    )
  } else {
    return (
      <div>
        <Front onButtonClick={onButtonClick} />
      </div>
    )
  }
  
}

export default Home;