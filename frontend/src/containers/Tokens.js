import React from 'react';
import {  Table } from "semantic-ui-react";
import {TOKENS} from '../assets/Tokens';
import Toolbar from '../components/Toolbar';

const Tokens = () => {

    return (
        <>
        <Toolbar />
        <Table basic celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell textAlign='center'>Name</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Symbol</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Supply</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Address</Table.HeaderCell>
                </Table.Row>                
            </Table.Header>
            <Table.Body>
                {TOKENS.map(token => {
                    return (
                        <Table.Row key={token.address}>
                            <Table.Cell textAlign='center'>{token.name}</Table.Cell>
                            <Table.Cell textAlign='center'>{token.symbol}</Table.Cell>
                            <Table.Cell textAlign='center'>{token.supply}</Table.Cell>
                            <Table.Cell textAlign='center'>{token.address}</Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table>
        </>
    )
}

export default Tokens;