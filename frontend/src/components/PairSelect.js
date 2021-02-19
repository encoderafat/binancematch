import React, { useState, useEffect } from 'react';
import { Grid, Dropdown, Label } from 'semantic-ui-react';

const PairSelect = ({tradingPairs,setPairID}) => {
    const [options,setOptions] = useState([]);

    useEffect(() => {
        const tDropdown = () => {
            setOptions([]);
            tradingPairs.map(tradingPair => setOptions(options => [...options,{
                text: `${tradingPair.tokenSymbol1}/${tradingPair.tokenSymbol2}`,
                id : tradingPair.id,
                value : tradingPair.id,
            }]));
        }

        tDropdown();
    },[tradingPairs])

    console.log(tradingPairs);

    return (
        <Grid.Row centered style={{padding: '10px'}}>
            <Label color='blue'>
                SELECT PAIR
            </Label>
            <Dropdown placeholder=' Default RTK/STOK' options={options} onChange={setPairID} search selection/>
            
        </Grid.Row>
    )
}

export default PairSelect;