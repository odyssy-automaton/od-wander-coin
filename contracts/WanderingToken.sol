pragma solidity ^0.4.24;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract WanderingToken is ERC721Token, Ownable {

    struct OwnerHistory {
        address addr;
        int lat;
        int lon;
    }

    mapping(address => OwnerHistory[]) ownersHistory;
    uint256 onlyTokenId = 1;

    constructor(
        string _name, 
        string _symbol, 
        int _latitude, 
        int _longitude 
    ) 
    ERC721Token(_name, _symbol) public {
        OwnerHistory memory _newHistory = OwnerHistory({ 
            addr: owner,
            lat: _latitude,
            lon: _longitude 
        });
        ownersHistory[owner].push(_newHistory);
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
        require(ownersHistory[msg.sender].addr != "", "already owned");

        OwnerHistory memory _newHistory = OwnerHistory({ 
            addr: owner,
            lat: _latitude,
            lon: _longitude 
        });
        ownersHistory[owner].push(_newHistory);
        // solium-disable-next-line arg-overflow
        super.safeTransferFrom(_from, _to, onlyTokenId, "");
    }

}