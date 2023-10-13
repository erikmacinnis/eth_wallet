// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract TicketFactory{

    using Counters for Counters.Counter;
    Counters.Counter public ticketCollectionId;
    // Id of ticket collection to it's address
    //Must keep track of ticket collection id in DB
    mapping(uint256 => address) public allCollections;

    // one of our wallets
    // potentially have an array of owners so the whole contract doesn't rely on just one wallet
    address public owner;

    constructor() {
        owner = msg.sender;
    } 

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized");
        _;
    }

    function newTicketCollection(uint256 totalTickets, string memory baseURI) public onlyOwner {
        TicketCollection ticketCollection = new TicketCollection(totalTickets, msg.sender, baseURI);
        allCollections[Counters.current(ticketCollectionId)] = address(ticketCollection);
        ticketCollectionId.increment();
    }
}

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TicketCollection is ERC1155URIStorage {

    bytes private constant Prefix = '\x19Ethereum Signed Message:\n';
    uint256 private constant MinPrice = 1000000000000000;
    address private constant emptyAddress = 0x0000000000000000000000000000000000000000;
    using Counters for Counters.Counter;
    Counters.Counter public ticketsMinted;
    uint256 public maxTickets;
    address public owner;
    struct Sale {
        uint256 salePrice;
        address payable owner;
    }
    uint public startGas;
    uint public endGas;
    // alternatively we can just keep track of the price and in the mapping
    // We would then have to keep track of the owner of each sale item
    mapping(uint256 => Sale) public forSale;

    // event TicketListed(address seller, uint256 ticketId);
    // event TicketDelisted(address seller, uint256 ticketId);
    // event TicketPurchased(address purchaser, uint256 ticketId);

    constructor(uint256 _maxTickets, address _owner, string memory _baseURI) ERC1155(_baseURI) {
        maxTickets = _maxTickets;
        owner = _owner;
        // start the counter at 1
        ticketsMinted.increment();
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized");
        _;
    }

    // price is in wei
    // function listForSale(uint256 ticketId, uint256 price) public {
    //     startGas = gasleft();
    //     // This requirement is subject to change
    //     require(price >= MinPrice, "price < 1000000000000000 wei");
    //     require(balanceOf(msg.sender, ticketId) == 1, "Unauthorized");
    //     forSale[ticketId] = Sale({salePrice: price, owner: payable (msg.sender)});
    //     emit TicketListed(msg.sender, ticketId);
    //     endGas = startGas - gasleft();
    // }

    // function purchase(uint256 ticketId) public payable {
    //     startGas = gasleft();
    //     Sale memory sale = forSale[ticketId];
    //     require(sale.salePrice >= MinPrice, "Ticket Not Listed");
    //     require(msg.value >= sale.salePrice, "Insufficient Funds");
    //     forSale[ticketId] = Sale({salePrice: 0, owner: payable (emptyAddress)});
    //     sale.owner.transfer(msg.value);
    //      _safeTransferFrom(sale.owner, msg.sender, ticketId, 1, new bytes(0));
    //      emit TicketPurchased(msg.sender, ticketId);
    //      endGas = startGas - gasleft();
    // }

    // function delist(uint256 ticketId) public {
    //     startGas = gasleft();
    //     require(balanceOf(msg.sender, ticketId) == 1, "Unauthorized");
    //     forSale[ticketId] = Sale({salePrice: 0, owner: payable (emptyAddress)});
    //     emit TicketDelisted(msg.sender, ticketId);
    //     endGas = startGas - gasleft();
    // }

    function mint(string memory tokenURI, address to) external onlyOwner returns (uint256) {
        startGas = gasleft();
        // current num tickets sold
        uint256 ticketCount = Counters.current(ticketsMinted);
        // if maxTickets == ticketCount then the last ticket already has been minted
        require(maxTickets >= ticketCount, "Sold out");
        // mint token with ticketCount being the ticketId
        _mint(to, ticketCount, 1, new bytes(0));
        // set IPFS link for NFT with ticketID
        _setURI(ticketCount, tokenURI);
        ticketsMinted.increment();
        endGas = startGas - gasleft();
        return ticketCount;
    }   

    // recieves the message we assume the message hash to be and ensures they match and returns the signer of the messsagehash
    function _validateSignature(bytes memory message, bytes32 messageHash, uint8 v, bytes32 r, bytes32 s) pure internal returns(address) {
        bytes32 hash = keccak256(message);
        // ensures hashed message and messagehash parameter match
        require(messageHash == hash, "Invalid Message");
        address recoveredAddress = ECDSA.recover(messageHash, v, r, s);
        return recoveredAddress;
    }

    // Accepts the tokenId which is the token you want to trade and is used to retrieve the message we will compare to the message hash
    // Accepts all values of signed message from NFT owner that authorizing the owner to trade the specified NFT in the message for them
    function transferWithSignedMessage(address from, address to, uint256 tokenId, bytes32 messageHash, uint8 v, bytes32 r, bytes32 s) public onlyOwner {
        startGas = gasleft();
        // gets the uri from the tokenId
        bytes memory _uri = bytes(uri(tokenId));
        // gets the signer address
        address recoveredAddress = _validateSignature(abi.encodePacked(Prefix, bytes(Strings.toString(_uri.length)), bytes(_uri)), messageHash, v, r, s);
        require(recoveredAddress == from, "Invalid Signer");
        // makes the transfer
        _safeTransferFrom(from, to, tokenId, 1, new bytes(0));
        endGas = startGas - gasleft();
    }
}