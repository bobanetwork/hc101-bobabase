// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "./interfaces/ITuringHelper.sol";

contract Easy {

    event GetRandom(uint256);

    address public helperAddr;
    ITuringHelper public myHelper;

    uint256 public randomNumber;
    bytes public returnValue;

    constructor(address _helper) {
        helperAddr = _helper;
        myHelper = ITuringHelper(helperAddr);
    }

    function getRandom() public {
        // get Random number from hybrid compute
        randomNumber = myHelper.TuringRandom();
        emit GetRandom((randomNumber));
    }
}
