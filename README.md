# On-chain Decentralized Order Book and Limit Order Matching Engine on Binance Smart Chain Testnet

Contract Address : ```0x271DBCFBF2247EE08C1Fb4387a4c80A80Efd7E4f```

Contract GUI: https://hungry-lamport-a311e5.netlify.app/

Demo Video: https://drive.google.com/file/d/1SByQjndW3YwZNgGLWQ0eYV6bqU7tocCB/view?usp=sharing

Demo Slides: https://docs.google.com/presentation/d/1VzVS301IJ8Kdu5OTT_9NelQzBLyyq2jFfA6UgVBTXRU/edit?usp=sharing

This contract is a simplified and heavily modified version of Maker On-Chain OTC-Market for ERC-20 compatible tokens available [here.](https://github.com/daifoundation/maker-otc). Orderbooks for buy/sell markets are implemented as two double-linked sorted lists. Match Engine tries to match any new offer with existing offers. If there is no match, the new offer is added to the orderbook. At any point in time, the liquidity of the exchange is directly proportional to number of existing offers in the buy/sell markets.

I submitted a version of this project for the Encode club hackathon last month [here.](https://github.com/encoderafat/binancedex). Since then I have worked on the contract and streamlined it further. The GUI has also been modified to manage user's contracts (cancel contracts etc.) and it should now be more stable and more responsive.

## Backend

Contracts are compiled and migrated using Truffle.

  ### Test
  ```truffle test```
  
  ### Migrate to BSC Testnet
  
  Store Metamask mnemonic in a file called .secret in the truffle folder.
  
  ```truffle migrate --network testnet```
  

## Frontend

### Install

### `yarn`

### Start Local server

### `yarn start`

## Matching Engine Function Calls

Create Trade Offer : Exchange Token1 (Sell) for Token2 (Buy).

```tradeOffer(address _tokenAddress1, uint _quantity1, address _tokenAddress2, uint _quantity2) returns (uint _id)```

Cancel Offer.

```cancelOffer(uint _id) ```

Create a Token Pair if it doesn't already exist. In this contract users can't add a new token but they can add new pairs for the existing tokens.

```createTokenPair(address _tokenAddress1, address _tokenAddress2) ```

Get number of offers on the book for a given trading pair

```getOfferSize(address sellAddress, address buyAddress) public view returns (uint)```

Get the best offer on the book for a given trading pair

```getBestOffer(address sellAddress, address buyAddress) public view returns (uint)```

Navigate through the sorted Order book for a given pair

```
getNextOffer(uint id) public view returns(uint)
getPrevOffer(uint id) public view returns(uint)
```


## Matching Engine Algorithm

Let `tSellQuantity` be the amount taker is selling.
Let `tBuyQuantity` is the amount taker is buying.

Let `mSellQuantity` be the amount maker is selling.
Let `mBuyQuantity` is the amount maker is buying.

Check if `(tSellQuantity/tBuyQuantity >= mBuyQuantity/mSellQuantity)` is true. If true, internal function `buy(uint id, uint quantity) ` is called to execute transaction where `quantity` is `min(mSellQuantity,tBuyQuantity)`. `tSellQuantity` and `tBuyQuantity` are updated next. The loop exits if either of these values become zero, otherwise the next iteration is done.


## Contract Interactor GUI Requirements

[Link to the App.](https://hungry-lamport-a311e5.netlify.app/)

1. Metamask [Download Link](https://metamask.io/)

2. Connect Metamask To Binance Smart Chain Testnet

```Network Name: Smart Chain - Testnet

New RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/

New RPC URL 2 (if needed) : https://data-seed-prebsc-1-s2.binance.org:8545/

ChainID: 97

Symbol: BNB

Block Explorer URL: https://testnet.bscscan.com
```

3. Get some test BNB from [the faucet.](https://testnet.binance.org/faucet-smart)

4. Get test Tokens from the faucet (Click Faucet on the menu) and start testing the contract.
