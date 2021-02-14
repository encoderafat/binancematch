import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Button, Grid, Table, Dropdown } from 'semantic-ui-react';
import exchange from '../contracts/Dex.json';
import { EXCHANGEADD } from '../assets/Exchange';
import {TOKENS} from '../assets/Tokens';
import Toolbar from '../components/Toolbar';

const exchangeAddress = EXCHANGEADD.address;

const Pairs = () => {
    const [tokenPairs,setTokenPairs] = useState([]);
    const [numPairs,setNumPairs] = useState(0);
    const [options,setOptions] = useState([]);
    const [firstToken,setFirstToken] = useState('');
    const [secondToken,setSecondToken] = useState('');

    console.log(options);
    console.log(tokenPairs);

    useEffect( () => {
        const tokensDropdown = () => {
            console.log(TOKENS.length);
            setOptions([]);
            TOKENS.map(token => setOptions(options => [...options,{
                text: token.symbol,
                id : token.address,
                value : token.address,
            }]));
        }
        tokensDropdown();
    },[]);

    useEffect( () => {
        const getList = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            //const signer = provider.getSigner();
            const contract = new ethers.Contract(exchangeAddress, exchange.abi, provider);
            let id = (await contract.getTotalPairs()).toNumber();
            setNumPairs(id);
            setTokenPairs([]);
            for(let i = 1; i <= id; ++i) {
                let pairInfo = await contract.getPairInfo(i);
                //console.log(pairInfo);
                setTokenPairs(tokenPairs => [...tokenPairs,{
                    id: i,
                    tokenAddress1: pairInfo[0].toString(),
                    tokenSymbol1: pairInfo[1].toString(),
                    tokenAddress2: pairInfo[2].toString(),
                    tokenSymbol2: pairInfo[3].toString(),
                }]);
            }
        }
        getList();
    },[])

    const firstDropdown = (e,d) => {
        e.preventDefault();
        setFirstToken(d.value);
    }

    const secondDropdown = (e,d) => {
        e.preventDefault();
        setSecondToken(d.value);
    }

    const createPair = async () => {
        if (firstToken === '' || secondToken === '') {
            alert("Please Select Both Tokens");
            return;
        }

        if (firstToken === secondToken) {
            alert("Please Select Two Different Tokens");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(exchangeAddress, exchange.abi, provider);
        const connectedContract = contract.connect(signer);
        connectedContract.createTokenPair(firstToken,secondToken);
    }

    return (
        <>
        <Toolbar />
        <Grid>
            <Grid.Row centered>
                <h2>Available Token Pairs</h2>
            </Grid.Row>
            <Grid.Row centered>
                <Table celled padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell textAlign='center'>Pair ID</Table.HeaderCell>
                            <Table.HeaderCell textAlign='center'>Token 1</Table.HeaderCell>
                            <Table.HeaderCell textAlign='center'>Token 2</Table.HeaderCell>
                        </Table.Row>                
                    </Table.Header>
                    <Table.Body>
                        {tokenPairs.map(tokenPair => {
                            return (
                                <Table.Row key={tokenPair.id}>
                                    <Table.Cell textAlign='center'>{tokenPair.id}</Table.Cell>
                                    <Table.Cell textAlign='center'>{tokenPair.tokenSymbol1}</Table.Cell>
                                    <Table.Cell textAlign='center'>{tokenPair.tokenSymbol2}</Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </Grid.Row>
            <Grid.Row centered>
                <h2>Create Additional Pairs</h2>
            </Grid.Row>
            <Grid.Row centered columns={3}>
                <Grid.Column textAlign='center'>
                    <Dropdown placeholder='Token 1' options={options} onChange={firstDropdown} search selection/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row centered columns={3}>
                <Grid.Column textAlign='center'>
                    <Dropdown placeholder='Token 2' options={options} onChange={secondDropdown} search selection/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row centered columns={3}>
                <Grid.Column textAlign='center'>
                    <Button primary onClick={createPair}>Create Pair</Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        </>
    )
}

export default Pairs;