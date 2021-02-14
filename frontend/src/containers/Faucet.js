import React from 'react';
import { ethers } from "ethers";
import { Button, Grid } from 'semantic-ui-react';
import faucet from '../contracts/Faucet.json';
import Toolbar from '../components/Toolbar';

const Faucet = () => {
    const faucetAddress = '0x0c5ed53cAa685707A15B377e8c8c7b83A56247F7';
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //console.log(signer);

    const handleClick = async () => {
        //console.log(faucet);
        const contract = new ethers.Contract(faucetAddress, faucet.abi, provider);
        const contractWithSigner = contract.connect(signer);
        let txWithdraw = await contractWithSigner.withdraw();
        console.log(txWithdraw);
    }

    return (
        <>
        <Toolbar />
        <Grid>
            <Grid.Row centered>
                <h3>Send Test Tokens to the Connected Metamask Account on Binance Smart Chain. This Transaction will cost you some gas.</h3>
            </Grid.Row>
            <Grid.Row centered>
                <Button primary onClick={async () => handleClick()}>Get Tokens</Button>
            </Grid.Row>
        </Grid>
        </>
        
    )
}

export default Faucet;