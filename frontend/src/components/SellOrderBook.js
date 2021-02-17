import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import exchange from '../contracts/Dex.json';
import { EXCHANGEADD } from '../assets/Exchange';
import { Table } from 'semantic-ui-react';
import BigNumber from 'bignumber.js';

const UNIT = 1000000000000000000;
const exchangeAddress = EXCHANGEADD.address;


const SellOrderBook = ({firstToken,firstAddress,secondToken,secondAddress}) => {
    const [orderSize,setOrderSize] = useState(0);
    const [orders,setOrders] = useState([]);

    const orderState = (offerId,sell,buy) => {
        let price = buy.dividedBy(sell).toNumber();
        let amount = sell.dividedBy(UNIT).toNumber();
        let total = buy.dividedBy(UNIT).toNumber();

        setOrders(orders => [...orders, {
            id: offerId,
            price: price,
            amount: amount,
            total: total,
        }]);
    }

    useEffect(() => {
        const getOrderList = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(exchangeAddress, exchange.abi, provider);

            if (firstAddress && secondAddress) {
                let offerSize = await contract.getOfferSize(firstAddress,secondAddress);
                setOrderSize(offerSize.toNumber());
            }
        } 

        getOrderList();
    },[firstToken,firstAddress,secondToken,secondAddress]);

    useEffect(() => {
        const getOrders = async () => {
            if (orderSize > 0) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = new ethers.Contract(exchangeAddress, exchange.abi, provider);

                setOrders([]);
    
                let offerId = (await contract.getBestOffer(firstAddress,secondAddress)).toNumber();
                let offers = await contract.getOfferPerId(offerId);

                let sell = new BigNumber(offers[1].toString());
                let buy = new BigNumber(offers[3].toString());

                orderState(offerId,sell,buy);


                for (let i = 1; i < orderSize; ++i) {
                    let offId1;

                    if (i === 1) {
                        offId1 = offerId;
                    }
                    offId1 = (await contract.getPrevOffer(offId1)).toNumber();
                    offers = await contract.getOfferPerId(offId1);

                    sell = new BigNumber(offers[1].toString());
                    buy = new BigNumber(offers[3].toString());

                    orderState(offerId,sell,buy);
                }
            } else {
                setOrders([]);
            }
        }

        getOrders();
    },[orderSize]);

    return (
        <Table celled padded>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell textAlign='center'>{`Price (${secondToken})`}</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>{`Amount (${firstToken})`}</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>{`Total (${secondToken})`}</Table.HeaderCell>
                </Table.Row>                
            </Table.Header>
            <Table.Body>
                {orders.map(order => {
                    return (
                        <Table.Row key={order.id}>
                            <Table.Cell textAlign='center'>{order.price}</Table.Cell>
                            <Table.Cell textAlign='center'>{order.amount}</Table.Cell>
                            <Table.Cell textAlign='center'>{order.total}</Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table>
    )
}

export default SellOrderBook;