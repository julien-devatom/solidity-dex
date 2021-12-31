# Decentralized Exchange

This project is an example of a DEX. 
# How it works 
A dex is a smart contract which permits users to propose a trade of a token  
with a reference price. The user can propose a minimum price for a sell order, and a max price for a buy order.
In the second part of the process, users suggest a market order, with a max/min price, depending on the  transaction type (buy or sell). Then, the user exchange 
with users which have proposed a price (through a limit order) under (i.e over) the price that we want.  
A sort permits to match users with the better price.  
For example, if you want to buy BAT (ticker) at 2 DAI (price), and one user a sell BAT at 1 DAI, and one user B sell BAT at 1.5 DAI, so you will be 
matched first with user A, and then with user B (if you are not fully matched with user A).
## Trading sequence
Lets see a full trading sequence :
We have 2 traders, Bob and Alice:

- Bob wants to buy 1 BAT token, at a price of up to 2 Ethers
- Alice wants to sell 1 BAT token, for whatever price


This is the whole trading sequence:

- Bob sends 2 Ethers to the DEX smart contract.
- Bob creates a buy limit order for a limit price of 2 DAI, amount of 1 BAT token, and send it to DEX smart contract
- Alice sends 1 BAT token to the DEX smart contract
- Alice creates a sell market order for an amount of 1 BAT token, and send it to DEX smart contract
- The smart contract matches Bob and Alice order, and carry out the trade. Bob now owns 1 BAT token and Alice 2 DAI
- Bob withdraws his 1 BAT token from the DEX smart contract
- Alice withdraws her 2 Ethers from the DEX smart contract

# Hardhat useful commands
```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten for our example.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your [Etherscan API key](https://etherscan.io/myapikey),
your [Infura API key](https://infura.io/dashboard) , and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
npx hardhat run --network ropsten scripts/deploy.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
