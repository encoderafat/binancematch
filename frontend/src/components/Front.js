import React from 'react';
import { Container, Button, Segment} from 'semantic-ui-react';

const Front = ({onButtonClick}) => {
    return (
        <Container textAlign="center">
            <h2>Requirements For Using This App</h2>
            <p>1. Metamask <a href="https://metamask.io/">Download Link</a></p>
            <p>2. Connect Metamask To Binance Smart Chain Testnet</p>
            <Segment>
                <p><b>Network Name:</b> Smart Chain - Testnet</p>
                <p><b>New RPC URL:</b> https://data-seed-prebsc-1-s1.binance.org:8545/</p>
                <p><b>ChainID:</b> 97</p>
                <p><b>Symbol:</b> BNB</p>
                <p><b>Block Explorer URL:</b> https://testnet.bscscan.com</p>
            </Segment>
            <p><a href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain">
                Full Instructions
                </a></p>
            <p>3. Get some test BNB from <a href="https://testnet.binance.org/faucet-smart">the faucet.</a></p>
            <p></p>
            <Button primary onClick={onButtonClick}>
                Connect To MetaMask
            </Button>
        </Container>
        )
}

export default Front;