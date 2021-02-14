import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import exchange from '../contracts/Dex.json';
import { EXCHANGEADD } from '../assets/Exchange';
import ERC20 from '../contracts/erc20.json';

import { Grid, Input, Button, Form, Label } from 'semantic-ui-react';

const UNIT = 1000000000000000000;
const exchangeAddress = EXCHANGEADD.address;

const BuySell = ({tradingPairs,tradingPairID}) => {
    const [buyFormState, setBuyFormState] = useState({buyAmount: 0, buyPrice: 0});
    const [sellFormState, setSellFormState] = useState({sellAmount: 0, sellPrice: 0});
    const [sellTotal,setSellTotal] = useState(0);
    const [buyTotal,setBuyTotal] = useState(0);
    const [firstToken,setFirstToken] = useState('');
    const [firstAddress,setFirstAddress] = useState('');
    const [secondToken,setSecondToken] = useState('');
    const [secondAddress,setSecondAddress] = useState('');
    const [disableBuy,setDisableBuy] = useState(true);
    const [disableSell,setDisableSell] = useState(true);
    const [disableBuyAllowance,setDisableBuyAllowance] = useState(false);
    const [disableSellAllowance,setDisableSellAllowance] = useState(false);

    const onBuyChange = (e,data) => {
        setBuyFormState(prev => ({ ...prev, [data.state]: data.value }));
    }

    const {buyAmount,buyPrice} = buyFormState;

    const onSellChange = (e,data) => {
        setSellFormState(prev => ({ ...prev, [data.state]: data.value }));
    }

    const {sellAmount,sellPrice} = sellFormState;

    const buyAllowance = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        if (buyPrice <= 0 || buyAmount <= 0) {
            alert('Please Input legitimate Price and Amount values');
            return;
        }

        console.log(buyTotal);

        let allowance = buyTotal*UNIT;
        let tokenAddress = secondAddress;
        console.log(allowance);
        console.log(tokenAddress);
        console.log(secondToken);

        const erc20Contract = new ethers.Contract(secondAddress, ERC20, provider);
        console.log(erc20Contract);
        const erc20Signed = erc20Contract.connect(signer);
        console.log(erc20Signed);

        const success = await erc20Signed.approve(exchangeAddress,allowance.toString());
        console.log(success);

        setDisableBuyAllowance(true);
        setDisableBuy(false);
    }

    const buyOrder = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        if (buyPrice <= 0 || buyAmount <= 0) {
            alert('Please Input legitimate Price and Amount values');
            return;
        }

        console.log(buyAmount);
        console.log(buyPrice);

        const dexContract = new ethers.Contract(exchangeAddress, exchange.abi, provider);
        const dexSigned = dexContract.connect(signer);

        let amount1 = buyTotal * UNIT;
        let amount2 = buyAmount * UNIT;

        let txTrade = await dexSigned.tradeOffer(secondAddress,amount1.toString(),firstAddress,amount2.toString());

        console.log(txTrade);

        setDisableBuy(true);
        setDisableBuyAllowance(false);
    }

    useEffect(() => {
        let temp = buyAmount * buyPrice;
        setBuyTotal(temp);
    },[buyAmount,buyPrice]);

    useEffect(() => {
        let temp = sellAmount * sellPrice;
        setSellTotal(temp);
    },[sellAmount,sellPrice]);

    const sellAllowance = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        if (sellPrice <= 0 || sellAmount <= 0) {
            alert('Please Input legitimate Price and Amount values');
            return;
        }

        let allowance = sellAmount*UNIT;
        let tokenAddress = firstAddress;
        console.log(allowance);
        console.log(tokenAddress);
        console.log(firstToken);

        const erc20Contract = new ethers.Contract(firstAddress, ERC20, provider);
        console.log(erc20Contract);
        const erc20Signed = erc20Contract.connect(signer);
        console.log(erc20Signed);

        const success = await erc20Signed.approve(exchangeAddress,allowance.toString());
        console.log(success);

        setDisableSellAllowance(true);
        setDisableSell(false);
    }

    const sellOrder = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        console.log(sellAmount);
        console.log(sellPrice);

        if (sellPrice <= 0 || sellAmount <= 0) {
            alert('Please Input legitimate Price and Amount values');
            return;
        }

        const dexContract = new ethers.Contract(exchangeAddress, exchange.abi, provider);
        const dexSigned = dexContract.connect(signer);

        let amount1 = sellAmount * UNIT;
        let amount2 = sellTotal * UNIT;

        let txTrade = await dexSigned.tradeOffer(firstAddress,amount1.toString(),secondAddress,amount2.toString());

        console.log(txTrade);

        setDisableSell(true);
        setDisableSellAllowance(false);
    }

    useEffect(() => {
        setFirstToken(tradingPairs[tradingPairID-1].tokenSymbol1);
        setSecondToken(tradingPairs[tradingPairID-1].tokenSymbol2);
        setFirstAddress(tradingPairs[tradingPairID-1].tokenAddress1);
        setSecondAddress(tradingPairs[tradingPairID-1].tokenAddress2);
    },[tradingPairs,tradingPairID]);

    return (
        <>
            <Grid.Column>
                <h4>Buy {firstToken}</h4>
                <Form>
                    <Form.Field>
                        <Input
                         fluid 
                         label={`Price (${secondToken})`}
                         type='number'
                         step='any'
                         min='0'
                         state='buyPrice'
                         onChange={onBuyChange}
                         />
                    </Form.Field>
                    <Form.Field>
                        <Input
                         fluid 
                         label={`Amount (${firstToken})`}
                         type='number'
                         step='any'
                         min='0'
                         state='buyAmount'
                         onChange={onBuyChange}
                         />
                    </Form.Field>
                    <Form.Field>
                        <Label size='large'>
                            {`Total (${secondToken})`}
                        </Label>
                        <Label size='large' basic>
                            {buyTotal}
                        </Label>
                    </Form.Field>
                    <Form.Field>
                        <Button primary onClick={async () => buyAllowance()} disabled={disableBuyAllowance}>ALLOW SPEND</Button>
                        <Button primary onClick={async () => buyOrder()} disabled={disableBuy}>BUY {firstToken}</Button>
                    </Form.Field>
                </Form>
            </Grid.Column>
            <Grid.Column>
            <h4>Sell {firstToken}</h4>
                <Form>
                    <Form.Field>
                        <Input
                         fluid 
                         label={`Price (${secondToken})`}
                         type='number'
                         step='any'
                         min='0'
                         state='sellPrice'
                         onChange={onSellChange}
                         />
                    </Form.Field>
                    <Form.Field>
                        <Input
                         fluid 
                         label={`Amount (${firstToken})`}
                         type='number'
                         step='any'
                         min='0'
                         state='sellAmount'
                         onChange={onSellChange}
                         />
                    </Form.Field>
                    <Form.Field>
                    <Label size='large'>
                    {`Total (${secondToken})`}
                    </Label>
                    <Label size='large' basic>
                        {sellTotal}
                    </Label>
                    </Form.Field>
                    <Form.Field>
                    <Button primary onClick={async () => sellAllowance()} disabled={disableSellAllowance}>ALLOW SPEND</Button>
                        <Button primary onClick={async () => sellOrder()} disabled={disableSell}>SELL {firstToken}</Button>
                    </Form.Field>
                </Form>
            </Grid.Column>
        </>
    )
}

export default BuySell;