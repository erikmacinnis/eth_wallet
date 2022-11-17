// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract TicketFactory{

    mapping(string => address) public allCollections;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function newTicketCollection(uint64 totalTickets, string memory name, string memory ticker) external {
        require(msg.sender == owner, "Caller is not the owner");
        TicketCollection ticketCollection = new TicketCollection(totalTickets, name, ticker, msg.sender);
        allCollections[ticker] = address(ticketCollection);
    }
}

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TicketCollection is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private ticketsMinted;
    address public owner;
    uint256 public maxTickets;

    constructor(uint256 totalTickets, string memory name, string memory ticker, address caller) ERC721(name, ticker) {
        owner = caller;
        maxTickets = totalTickets;
    }

    function mint(string memory tokenURI) public returns (uint256) {
        require(msg.sender == owner, "Caller is not the owner");
        uint256 ticketCount = Counters.current(ticketsMinted);
        require(maxTickets-1 >= ticketCount, "Tickets are sold out");
        _mint(msg.sender, ticketCount);
        _setTokenURI(ticketCount, tokenURI);
        ticketsMinted.increment();
        return ticketCount;
    }
}