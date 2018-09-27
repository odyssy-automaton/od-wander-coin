pragma solidity ^0.4.24;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract WanderingToken is ERC721Token, Ownable {

    struct OwnerHistory {
        bool isOwner;
        int lat;
        int lon;
    }

    mapping(address => OwnerHistory) ownersHistory;
    uint256 onlyTokenId = 1;
    address[] public ownersLUT;

    constructor(
        string _name, 
        string _symbol, 
        int _latitude, 
        int _longitude 
    ) 
    ERC721Token(_name, _symbol) public {

        ownersHistory[owner].isOwner = true;
        ownersHistory[owner].lat = _latitude;
        ownersHistory[owner].lon = _longitude;
        ownersLUT.push(owner) - 1;
        _mint(owner, onlyTokenId);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        int _latitude, 
        int _longitude 
    )
      public
    {
        require(ownersHistory[msg.sender].isOwner == true, "already owned");
        ownersHistory[msg.sender].isOwner = true;
        ownersHistory[msg.sender].lat = _latitude;
        ownersHistory[msg.sender].lon = _longitude;
        ownersLUT.push(msg.sender) - 1;
        // solium-disable-next-line arg-overflow
        super.safeTransferFrom(_from, _to, onlyTokenId, "");
    }

    function numOwners() public view returns (uint) {
        return ownersLUT.length;
    }

    function getCoordinates(address owner) 
    public view 
    returns(int latitude, int longitude) {
        return (
            latitude = ownersHistory[owner].lat,
            longitude = ownersHistory[owner].lon
        );
    }

}