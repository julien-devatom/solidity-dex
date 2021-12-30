pragma solidity 0.8.7;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dex is Ownable {
    enum Side {
        BUY,
        SELL
    }
    struct Order {
        uint id;
        Side side;
        address trader;
        bytes32 ticker;
        uint amount;
        uint filled; // part of the amount filled through trades
        uint price;
        uint date;
    }
    struct Token {
        bytes32 ticker;
        address tokenAddress;
    }
    mapping(bytes32 => Token) public tokens;
    mapping(address => mapping(bytes32 => uint)) public traderBalances;
    mapping(bytes32 => mapping(uint => Order[])) public orderBook; // uint is the side of the order, and the list of orders is sorted
    bytes32[] public tokenList;
    uint public nextOrderId;
    bytes32 storage DAI = bytes32("DAI");
    event TokenAdded(bytes32 _ticker, address _tokenAddress);


    modifier tokenExist(bytes32 ticker) {
        require(tokens[ticker].tokenAddress != address(0), "token does not exist");
        _;
    }
    modifier isNotDai(bytes32 ticker) {
        require(ticker != DAI, "cannot trade DAI");
        _;
    }
    function addToken(
        bytes32 ticker,
        address tokenAddress
    )
    onlyOwner()
    external {
        tokens[ticker] = Token(ticker, tokenAddress);
        tokenList.push(ticker);
        emit TokenAdded(
            ticker,
            tokenAddress
        );
    }

    function deposit(
        uint amount,
        bytes32 ticker
    )
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
        bytes32 ticker
    )
    tokenExist(ticker)
    external {
        require(
            traderBalances[msg.sender][ticker] >= amount,
            "balance too low"
        );
        traderBalances[msg.sender][ticker] -= amount;
        IERC20(tokens[ticker].tokenAddress).transfer(msg.sender, amount);
    }


    function createLimitOrder(
        bytes32 ticker,
        uint amount,
        uint price,
        Side side)
    tokenExist(ticker)
    isNotDai(ticker)
    external {
        if (side == Side.SELL) {
            require(traderBalances[msg.sender][ticker] >= amount, "token balance too low");
        } else {
            require(traderBalances[msg.sender][DAI] >= amount * price, "DAI balance too low");
        }
        Order[] storage orders = orderBook[ticker][uint(side)];
        orders.push(Order(
            nextOrderId,
            side,
            msg.sender,
            ticker,
            amount,
            0,
            price,
            now
        ));
        // bubble sort algorithm (easy)
        uint i = orders.length - 1;
        while(i > 0) {
            // set stop conditions
            if(side == Side.BUY && orders[i - 1].price > orders[i].price) {
                break;
            }
            if(side == Side.SELL && orders[i - 1].price < orders[i].price) {
                break;
            }
            // swap orders
            Order memory order = orders[i-1];
            orders[i - 1] = orders[i];
            orders[i] = order;
            i--;
        }
        nextOrderId++;
    }
}
