pragma solidity 0.8.7;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract DAI is ERC20, ERC20Detailed {
    constructor() ERC20Detailed("DAI", "DAI Stablecoin", 18) public {}
}