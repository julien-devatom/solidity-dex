// SPDX-License-Identifier: GNU AGPLv3
pragma solidity 0.8.4;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DAI is ERC20 {
    constructor() ERC20("DAI Stablecoin", "DAI") {}

}