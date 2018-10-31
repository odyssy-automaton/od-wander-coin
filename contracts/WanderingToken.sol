pragma solidity ^0.4.24;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract WanderingToken is ERC721Token, Ownable {

    struct OwnerHistory {
        bool isOwner;
        uint tokenId;
        string txURI;
    }

    mapping(uint => mapping(address => OwnerHistory)) ownersHistoryByToken;
    uint256 tokenCount = 0;
    uint256 faucetAmount = 2 finney;

    address[] public ownersLUT;

    constructor(
        string _name, 
        string _symbol,
        string _txURI,
        string _tokenURI
    ) 
    ERC721Token(_name, _symbol) public payable {
        launchToken(_txURI);
        _setTokenURI(tokenCount, _tokenURI);
    }

    function launchToken(
        string _txURI
    ) public {
        tokenCount++;
        ownersHistoryByToken[tokenCount][msg.sender].isOwner = true;
        ownersHistoryByToken[tokenCount][msg.sender].tokenId = tokenCount;
        ownersHistoryByToken[tokenCount][msg.sender].txURI = _txURI;
        ownersLUT.push(msg.sender);
        _mint(msg.sender, tokenCount);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint tokenId,
        string txURI
    )
      public
    {
        require(
            _from == ownerOf(tokenId), "Not the token holder");
        require(
            !addrHasOwned(_to, tokenId), "already owned");
        require(
            address(this).balance >= faucetAmount,
            "Not enough ether in contract."
            );
        ownersHistoryByToken[tokenId][_to].isOwner = true;
        ownersHistoryByToken[tokenId][_to].tokenId = tokenId;
        ownersHistoryByToken[tokenId][_to].txURI = txURI;
        ownersLUT.push(_to);
        super.safeTransferFrom(_from, _to, tokenId, "");
        _to.transfer(faucetAmount);
    }

    function numOwners() public view returns (uint) {
        return ownersLUT.length;
    }

    function addrHasOwned(address addr, uint tokenId) public view returns (bool) {
        return ownersHistoryByToken[tokenId][addr].isOwner;
    }

    function balanceOfTank() public view returns (uint) {
        return address(this).balance;
    }

    function getTxURI(address _owner, uint tokenId) 
    public view 
    returns(string) {
        return ownersHistoryByToken[tokenId][_owner].txURI;
    }

    function drain() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    function () public payable {}

}