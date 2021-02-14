// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 < 0.8.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Faucet is Ownable {
    using SafeMath for uint;

    struct Token {
        string tokenName;
        string tokenSymbol;
        uint16 tokenIndex;
        address tokenAddress;
        uint tokenBalance;
    }

    mapping (uint16 => Token) tokens;
    uint16 tokenIndex;
    mapping (address => bool) tokenList;
    mapping (address => uint16) tokenIndexList;

    event TokenAdded(address _tokenAddress, string _tokenName, string _tokenSymbol, uint _timeStamp);
    event TokenDeposited(address _from, address _tokenAddress, uint _amount, uint _timeStamp);
    event TokenWithdrawn(address _to, uint _amount, uint _timeStamp);

    function addToken(address _tokenAddress, string memory _tokenName, string memory _tokenSymbol) public onlyOwner {
        require(tokenList[_tokenAddress] == false, "Token Already Exists");

        tokenList[_tokenAddress] = true;
        tokenIndex++;
        tokens[tokenIndex].tokenAddress = _tokenAddress;
        tokens[tokenIndex].tokenName = _tokenName;
        tokens[tokenIndex].tokenSymbol = _tokenSymbol;
        tokens[tokenIndex].tokenIndex = tokenIndex;
        tokens[tokenIndex].tokenBalance = 0;
        tokenIndexList[_tokenAddress] = tokenIndex;
        emit TokenAdded(_tokenAddress,_tokenName,_tokenSymbol,now);
    }

    function depositToken(address _tokenAddress, uint _amount) public {
        require(tokenList[_tokenAddress] == true,"No token with this contract address exists.");
        uint16 tokenSymbolIndex = tokenIndexList[_tokenAddress];
        require(tokens[tokenSymbolIndex].tokenAddress != address(0),"Address 0");

        IERC20 thisToken = IERC20(tokens[tokenSymbolIndex].tokenAddress);

        require(thisToken.transferFrom(msg.sender, address(this), _amount) == true,"Token Deposit Failed");
        tokens[tokenSymbolIndex].tokenBalance = tokens[tokenSymbolIndex].tokenBalance.add(_amount);
        emit TokenDeposited(msg.sender,_tokenAddress,_amount,now);
    }

    function getTokenBalance(address _tokenAddress) public view returns (uint) {
        require(tokenList[_tokenAddress] == true,"No token with this contract address exists.");
        uint16 tokenSymbolIndex = tokenIndexList[_tokenAddress];

        return tokens[tokenSymbolIndex].tokenBalance;
    }

    function withdraw() public {
        uint _amount = 1000000000000000000000;
        for(uint16 i = 1; i <= tokenIndex;++i) {
            IERC20 thisToken = IERC20(tokens[i].tokenAddress);
            uint tempVal = tokens[i].tokenBalance.sub(_amount);
            require(tempVal >= 0,"The address token balance cannot go below zero.");

            tokens[i].tokenBalance = tempVal;
            require(thisToken.transfer(msg.sender, _amount) == true,"Token Withdrawal Failed");
        }
        emit TokenWithdrawn(msg.sender,_amount,now);
    }
}