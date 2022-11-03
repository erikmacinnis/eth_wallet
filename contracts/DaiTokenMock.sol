// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DaiTokenMock is ERC20{
    constructor() ERC20("Dai Token", "DAI"){}

    function issueTokens(address receiver, uint256 amount) public{
        _mint(receiver, amount);
    }
}