pragma solidity 0.8.7;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dex is Ownable {
    struct Token {
        bytes32 ticker;
        address tokenAddress;
    }
    mapping(bytes32 => Token) public tokens;
    bytes32[] public tokenList;


    event TokenAdded(bytes32 _ticker, address _tokenAddress);

    function addToken(
        bytes32 ticker,
        address tokenAddress
    )
    onlyOwner() external {
        tokens[ticker] = Token(ticker, tokenAddress);
        tokenList.push(ticker);
        emit TokenAdded(
            ticker,
            tokenAddress
        );
    }
}
