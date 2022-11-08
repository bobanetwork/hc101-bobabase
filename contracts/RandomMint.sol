//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./interfaces/ITuringHelper.sol";

/**
 * @title RandomMint
 * This contract has not been audited. Do not use this in production.
 */
contract RandomMint is ERC721 {

    address public helperAddr;
    ITuringHelper public myHelper;

    event MintedRandom(uint256, uint8, uint8);

    constructor(
      string memory name,
      string memory symbol,
      address _helper) ERC721(name, symbol) {
        helperAddr = _helper;
        myHelper = ITuringHelper(helperAddr);
    }

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function mint(address to, uint256 tokenId) public {
      // invoke Hybrid Compute here
      uint256 result = myHelper.TuringRandom();
      bytes memory resBytes = abi.encodePacked(result);
      uint8 attributeA = uint8(resBytes[0]);
      uint8 attributeB = uint8(resBytes[1]);
      // use the attributes here to e.g. set URI/Attributes etc
      _mint(to, tokenId);
      emit MintedRandom(result, attributeA, attributeB);
    }

    function safeMint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }

    function safeMint(
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public {
        _safeMint(to, tokenId, _data);
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
}
