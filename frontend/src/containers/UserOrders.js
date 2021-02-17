import React, {useState, useEffect} from 'react';
import { ethers, BigNumber } from "ethers";
import { useWeb3React } from '@web3-react/core';
import exchange from '../contracts/Dex.json';
import { EXCHANGEADD } from '../assets/Exchange';
import Toolbar from '../components/Toolbar';
import { Table, Dropdown, Grid, Button } from 'semantic-ui-react';


const exchangeAddress = EXCHANGEADD.address;

const UserOrders = () => {
    const [orderType,setOrderType] = useState(0);
    const [orders,setOrders] = useState([]);
    const [tableHeading,setTableHeading] = useState('Outstanding Orders');
    const [cancellable, setCancellable] = useState(true);
    const { chainId, account, activate, active } = useWeb3React();

    const options = [
        {text: "Outstanding Orders", value: 0},
        {text: "Fulfilled Orders", value: 1},
        {text: "Cancelled Orders", value: 2},
    ]

    const cancelOrder = async (e) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const dexContract = new ethers.Contract(exchangeAddress, exchange.abi, provider);
        const dexSigned = dexContract.connect(signer);

        let success = await dexSigned.cancelOffer(BigNumber.from(e));
    }

    useEffect( () => {

        const getAddedOrders = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const dexContract = new ethers.Contract(exchangeAddress, exchange.abi, provider);

            let order;
            let queryOrders;

            if (orderType === 0) {
                order = dexContract.filters.OrderAddedToMarketEscrow(null,account);
                let queryOrders1 = await dexContract.queryFilter(order);
                let fulfilledOrder = dexContract.filters.OrderFulFilled(null,account);
                let fulfilledQuery = await dexContract.queryFilter(fulfilledOrder);
                let cancelledOrder = dexContract.filters.OrderCancelled(null,account);
                let cancelledQuery = await dexContract.queryFilter(cancelledOrder);

                let qArray = queryOrders1.map(q => {
                    return (
                        q.args[0].toString())
                });
                let fArray = fulfilledQuery.map(q => {
                    return (
                        q.args[0].toString())
                });
                let cArray = cancelledQuery.map(q => {
                    return (
                        q.args[0].toString())
                });
                qArray = qArray.filter(item => !fArray.includes(item));
                qArray = qArray.filter(item => !cArray.includes(item));
                queryOrders = queryOrders1.filter(item => qArray.includes(item.args[0].toString()));
                setTableHeading('Outstanding Orders');
                setCancellable(true);
            } else if (orderType === 1) {
                order = dexContract.filters.OrderFulFilled(null,account);
                queryOrders = await dexContract.queryFilter(order);
                setTableHeading('Fulfilled Orders');
                setCancellable(false);
            } else if (orderType === 2) {
                order = dexContract.filters.OrderCancelled(null,account);
                queryOrders = await dexContract.queryFilter(order);
                setTableHeading('Cancelled Orders');
                setCancellable(false);
            } else {
                console.log("unknown value");
                return;
            }
            

            setOrders([]);

            queryOrders.map(queryOrder => {
                return (
                    setOrders(orders => [...orders, {
                        id: queryOrder.args[0].toString(),
                        sell: queryOrder.args[2].toString(),
                        buy: queryOrder.args[3].toString(),
                        sellAmount: queryOrder.args[4].toString(),
                        buyAmount: queryOrder.args[5].toString(),
                    }]));
            });

    
        }

        getAddedOrders();
    },[orderType,account])

    const selectOrderType = (e,d) => {
        e.preventDefault();
        setOrderType(d.value);
    }

    
    return (
        <>
        <Toolbar />
        <Grid>
            <Grid.Row>
                <Dropdown placeholder="Manage Orders" options={options} onChange={selectOrderType} fluid search selection/>
            </Grid.Row>
            <Grid.Row>
                <h2 style={{textAlign: "center"}}>{tableHeading}</h2>
            </Grid.Row>
            <Grid.Row centered>
                <Table celled padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell textAlign='center'>ID</Table.HeaderCell>
                            <Table.HeaderCell textAlign='center'>Token 1</Table.HeaderCell>
                            <Table.HeaderCell textAlign='center'>Token 2</Table.HeaderCell>
                            <Table.HeaderCell textAlign='center'>Sell Amount</Table.HeaderCell>
                            <Table.HeaderCell textAlign='center'>Buy Amount</Table.HeaderCell>
                            <Table.HeaderCell textAlign='center'>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {orders ? orders.map(order => {
                            return (
                                <Table.Row key={order.id}>
                                    <Table.Cell textAlign='center'>{order.id}</Table.Cell>
                                    <Table.Cell textAlign='center'>{order.sell}</Table.Cell>
                                    <Table.Cell textAlign='center'>{order.buy}</Table.Cell>
                                    <Table.Cell textAlign='center'>{order.sellAmount}</Table.Cell>
                                    <Table.Cell textAlign='center'>{order.buyAmount}</Table.Cell>
                                    {cancellable ? <Table.HeaderCell textAlign='center'>
                                        <Button primary onClick={async () => {await cancelOrder(order.id)}}>Cancel</Button>
                                        </Table.HeaderCell>
                                    : <Table.HeaderCell textAlign='center'>NONE</Table.HeaderCell>}
                                </Table.Row>
                            )
                        }) : <div></div>}
                    </Table.Body>
                </Table>
            </Grid.Row>
        </Grid>
        </>
       
    )
}

export default UserOrders;