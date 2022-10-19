// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DaiTokenMock is ERC20{
    constructor() ERC20("Dai Token", "DAI"){}

    function issueToken(address receiver, uint256 amount) public{
        _mint(receiver, amount);
    }
}