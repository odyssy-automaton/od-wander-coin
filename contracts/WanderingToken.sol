pragma solidity ^0.4.24;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract WanderingToken is ERC721Token, Ownable {

    struct OwnerHistory {
        bool isOwner;
        uint tokenId;
        int lat;
        int lon;
    }

    mapping(uint => mapping(address => OwnerHistory)) ownersHistoryByToken;
    uint256 tokenCount = 1;
    uint256 faucetAmount = 2 finney;

    address[] public ownersLUT;

    constructor(
        string _name, 
        string _symbol, 
        int _latitude, 
        int _longitude 
    ) 
    ERC721Token(_name, _symbol) public payable {
        ownersHistoryByToken[tokenCount][msg.sender].isOwner = true;
        ownersHistoryByToken[tokenCount][msg.sender].lat = _latitude;
        ownersHistoryByToken[tokenCount][msg.sender].lon = _longitude;
        ownersHistoryByToken[tokenCount][msg.sender].tokenId = tokenCount;
        ownersLUT.push(msg.sender);
        _mint(msg.sender, tokenCount);
    }

    function launchToken(
        int _latitude, 
        int _longitude 
    ) public {
        tokenCount++;
        ownersHistoryByToken[tokenCount][msg.sender].isOwner = true;
        ownersHistoryByToken[tokenCount][msg.sender].lat = _latitude;
        ownersHistoryByToken[tokenCount][msg.sender].lon = _longitude;
        ownersHistoryByToken[tokenCount][msg.sender].tokenId = tokenCount;
        ownersLUT.push(msg.sender);
        _mint(msg.sender, tokenCount);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        int _latitude, 
        int _longitude,
        uint tokenId
    )
      public
    {
        require(
            _from == ownerOf(tokenId), "Not the token holder");
        require(
            addrhasOwned(_to, tokenId), "already owned");
        require(
            address(this).balance >= faucetAmount,
            "Not enough ether in contract."
            );
        ownersHistoryByToken[tokenId][_to].isOwner = true;
        ownersHistoryByToken[tokenId][_to].lat = _latitude;
        ownersHistoryByToken[tokenId][_to].lon = _longitude;
        ownersHistoryByToken[tokenId][_to].tokenId = tokenId;
        ownersLUT.push(_to);
        _to.transfer(faucetAmount);
        super.safeTransferFrom(_from, _to, tokenId, "");
    }

    function numOwners() public view returns (uint) {
        return ownersLUT.length;
    }

    function addrhasOwned(address addr, uint tokenId) public view returns (bool) {
        return ownersHistoryByToken[tokenId][addr].isOwner;
    }

    function balanceOfTank() public view returns (uint) {
        return address(this).balance;
    }

    function getCoordinates(address _owner, uint tokenId) 
    public view 
    returns(int latitude, int longitude) {
        return (
            latitude = ownersHistoryByToken[tokenId][_owner].lat,
            longitude = ownersHistoryByToken[tokenId][_owner].lon
        );
    }

    function drain() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    function () public payable {}

}