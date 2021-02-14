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

    useEffect(() => {
        const getOrderList = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(exchangeAddress, exchange.abi, provider);
            console.log(firstToken,firstAddress,secondToken,secondAddress);

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
                console.log(orderSize);

                setOrders([]);
    
                let offerId = (await contract.getBestOffer(firstAddress,secondAddress)).toNumber();
                let offers = await contract.getOfferPerId(offerId);

                let sell = new BigNumber(offers[1].toString());
                let buy = new BigNumber(offers[3].toString());

                let price = buy.dividedBy(sell).toNumber();
                let amount = sell.dividedBy(UNIT).toNumber();
                let total = buy.dividedBy(UNIT).toNumber();

                console.log(price,amount,total);

                setOrders(orders => [...orders, {
                    id: offerId,
                    price: price,
                    amount: amount,
                    total: total,
                }]);

                for (let i = 1; i < orderSize; ++i) {
                    offerId = (await contract.getPrevOffer(offerId)).toNumber();
                    offers = await contract.getOfferPerId(offerId);

                    sell = new BigNumber(offers[1].toString());
                    buy = new BigNumber(offers[3].toString());

                    price = buy.dividedBy(sell).toNumber();
                    amount = sell.dividedBy(UNIT).toNumber();
                    total = buy.dividedBy(UNIT).toNumber();

                    setOrders(orders => [...orders, {
                        id: offerId,
                        price: price,
                        amount: amount,
                        total: total,
                    }]);
                }
            } else {
                setOrders([]);
            }
        }

        getOrders();
    },[orderSize,firstAddress,secondAddress]);

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