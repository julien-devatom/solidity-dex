// SPDX-License-Identifier: GNU AGPLv3
pragma solidity 0.8.4;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BAT is ERC20 {
    constructor() ERC20("BAT", "BAT") {}

    function faucet(address to, uint amount) external {
        _mint(to, amount);
    }
}