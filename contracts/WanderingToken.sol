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

    mapping(address => OwnerHistory) ownersHistory;
    uint256 firstTokenId = 1;
    uint256 faucetAmount = 1 finney;

    address[] public ownersLUT;

    constructor(
        string _name, 
        string _symbol, 
        int _latitude, 
        int _longitude 
    ) 
    ERC721Token(_name, _symbol) public payable {

        ownersHistory[msg.sender].isOwner = true;
        ownersHistory[msg.sender].lat = _latitude;
        ownersHistory[msg.sender].lon = _longitude;
        ownersHistory[msg.sender].tokenId = firstTokenId;
        ownersLUT.push(msg.sender);
        _mint(msg.sender, firstTokenId);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        int _latitude, 
        int _longitude 
    )
      public
    {
        require(
            _from == ownerOf(firstTokenId), "Not the token holder");
        require(
            ownersHistory[_to].isOwner == false, "already owned");
        require(
            address(this).balance >= faucetAmount,
            "Not enough ether in contract."
            );
        ownersHistory[_to].isOwner = true;
        ownersHistory[_to].lat = _latitude;
        ownersHistory[_to].lon = _longitude;
        ownersHistory[_to].tokenId = firstTokenId;
        ownersLUT.push(_to);
        _to.transfer(faucetAmount);
        super.safeTransferFrom(_from, _to, firstTokenId, "");
    }

    function numOwners() public view returns (uint) {
        return ownersLUT.length;
    }

    function getCoordinates(address _owner) 
    public view 
    returns(int latitude, int longitude) {
        return (
            latitude = ownersHistory[_owner].lat,
            longitude = ownersHistory[_owner].lon
        );
    }

    function balanceOfTank() public view returns (uint) {
        return address(this).balance;
    }

    function () public payable {}

}