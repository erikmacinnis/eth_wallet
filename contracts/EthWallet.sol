// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EthWallet {
    address payable public owner;

    // IERC20[] tokens;

    constructor() {
        owner = payable(msg.sender);
    }

    receive() external payable {}

    modifier onlyOwner {
      require(msg.sender == owner, "Caller is not the owner");
      _;
   }

//    function sendEther() public payable {}

//    function addToken(address tokenAddr) onlyOwner external {
//         tokens.push(tokenAddr);
//    }

    // function withdraw(uint _amount) onlyOwner external  {
    //     payable(msg.sender).transfer(_amount);
    // }

    function getBalanceEther() onlyOwner external view returns(uint) {
        return address(this).balance;
    }

    function getBalanceToken(address tokenAddr) onlyOwner external view returns(uint) {
        return IERC20(tokenAddr).balanceOf(address(this));
    }

    function transferEther(uint _amount, address payable receiverAddr) onlyOwner external {
        payable(receiverAddr).transfer(_amount);
    }

    function transferToken(uint _amount, address payable receiverAddr, address tokenAddr) onlyOwner external {
        IERC20(tokenAddr).transfer(payable(receiverAddr), _amount);
    } 
    
}