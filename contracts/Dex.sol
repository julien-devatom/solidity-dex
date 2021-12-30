pragma solidity 0.8.7;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dex is Ownable {
    struct Token {
        bytes32 ticker;
        address tokenAddress;
    }
    mapping(bytes32 => Token) public tokens;
    mapping(address => mapping(bytes32 => uint)) public traderBalances;
    bytes32[] public tokenList;


    event TokenAdded(bytes32 _ticker, address _tokenAddress);


    modifier tokenExist(bytes32 ticker) {
        require(tokens[ticker].tokenAddress != address(0), "token does not exist");
        _;
    }
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

    function deposit(
        uint amount,
        bytes32 ticker)
    tokenExist(ticker)
    external
    {
        IERC20(tokens[ticker].tokenAddress).transferFrom(
            msg.sender,
            address(this),
            amount
    );
        traderBalances[msg.sender][ticker] += amount;
    }
    function withdraw(
        uint amount,
        bytes32 ticker)
    tokenExist(ticker)
    external {
        require(
            traderBalances[msg.sender][ticker] >= amount,
            "balance too low"
        );
        traderBalances[msg.sender][ticker] -= amount;
        IERC20(tokens[ticker].tokenAddress).transfer(msg.sender, amount);
    }

}
