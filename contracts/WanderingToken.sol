pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract WanderingToken is ERC721Full, Ownable {

    struct OwnerHistory {
        bool isOwner;
        uint tokenId;
        string txURI;
    }

    mapping(uint => mapping(address => OwnerHistory)) ownersHistoryByToken;
    uint256 tokenCount = 0;
    uint256 faucetAmount = 2 finney;
    uint256 tankMax = 300 finney;

    address[] public ownersLUT;

    constructor(
        string _name,
        string _symbol,
        string _txURI,
        string _tokenURI
    )
    ERC721Full(_name, _symbol) public payable {
        launchToken(_txURI, _tokenURI);
    }

    function launchToken(
        string _txURI,
        string _tokenURI
    ) public {
        tokenCount++;
        ownersHistoryByToken[tokenCount][msg.sender].isOwner = true;
        ownersHistoryByToken[tokenCount][msg.sender].tokenId = tokenCount;
        ownersHistoryByToken[tokenCount][msg.sender].txURI = _txURI;
        ownersLUT.push(msg.sender);
        _mint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint tokenId,
        bytes data,
        string txURI
    )
      public
    {
        require(
            _from == ownerOf(tokenId), "Not the token holder");
        require(
            !addrHasOwned(_to, tokenId), "already owned");

        ownersHistoryByToken[tokenId][_to].isOwner = true;
        ownersHistoryByToken[tokenId][_to].tokenId = tokenId;
        ownersHistoryByToken[tokenId][_to].txURI = txURI;
        ownersLUT.push(_to);
        super.safeTransferFrom(_from, _to, tokenId, data);
        if (address(this).balance >= faucetAmount) {
            _to.transfer(faucetAmount);
        } else if (address(this).balance >= 0){
            _to.transfer(address(this).balance);
        }

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

    function setFaucetAmount(uint amount) public onlyOwner {
        faucetAmount = amount;
    }

    function setTankMax(uint amount) public onlyOwner {
        tankMax = amount;
    }

    function () public payable {
        require(address(this).balance <= tankMax, "That would overflow the tank");
    }

}
