# hc101-bobabase
This is a minimal example of using Hybrid-Compute on Bobabase (Bobabeam's testnet)

#### Links to other relevant examples
- [Calling an external API](https://github.com/bobanetwork/boba/tree/develop/boba_community/turing-twitter)
- [Moving code off-chain](https://github.com/bobanetwork/HybridCompute_Tutorial)

## Quick start: Testnet setup
1. Install dependencies with `yarn` or `npm i`
2. Copy `.env.example`, rename to `.env` and add one of your private keys
3. Get Boba testnet tokens from [Gateway Bobabase](https://gateway.bobabase.boba.network/)
4. Deploy your contract incl. the tests, e.g. `yarn run test`

### The flow
When creating a new Hybrid-Compute project you should be aware of the following required steps to use it: 
1. Deploy your own `TuringHelper.sol` - This is needed to introduce AccessControl and to keep track of your calls (every call costs 0.01 BOBA token).
2. Deploy your own custom contract (in our case `Easy.sol` or `RandomMint.sol`) and provide the address of your deployed TuringHelper.
3. Call `addPermittedCaller(address)` on your TuringHelper contract to add your custom contract (previous step). This is needed to whitelist your contract to use your prepaid BOBA tokens when calling HybridCompute. 
4. Now we need to fund our TuringHelper with BOBA tokens since every call costs **0.01 BOBA** tokens. You can do this by calling `turingCredit.addBalanceTo(uint256,address)`. 

**Notes to 4):**
* You can find the contract address for the TuringCredit contract [here](https://docs.boba.network/for-developers/network-parameters) (this is deployed by the BOBA team once).
* `turingCredit.addBalanceTo(uint256,address)`: The first param describes how many BOBA tokens you want to send to the contract (pre-pay) and the second is the address of your `TuringHelper` contract.

### How to call a Hybrid-Compute function?
When calling a function on your smart-contract that utilizes Hybrid-Compute (APIs) then you need to `estimateGas` before. 
Otherwise Hybrid-Compute won't be able to intercept the call. 
For a random number (as of this tutorial, this is not required)


## Hybrid Compute
Turing is a system for interacting with the outside world from within solidity smart contracts. Ethereum is a computer with multiple strong constraints on its internal architecture and operations, all required for decentralization. As such, things that most developers take for granted - low cost data storage, audio and image processing, advanced math, millisecond response times, random number generation, and the ability to talk to any other computer - can be difficult or even impossible to run on the Ethereum "CPU". Of course, the benefits of decentralization far outweigh those limitations, and therefore, tools are desirable to add missing functionality to the Ethereum ecosystem. Turing is one such tool.

Turing is a **pipe** between (**1**) Boba's Geth (aka sequencer), which takes transactions, advances the state, and forms blocks, and (**2**) your server. To use this pipe, all you need is a smart contract on Boba that makes Turing calls and an external server that accepts these calls and returns data in a format that can be understood by the EVM. This is not hard to do and we provide many examples which will allow you to quickly build a working Turing system.

* Official examples - [[here]](https://github.com/bobanetwork/boba/tree/develop/boba_examples)
* Official documentation - [[here]](https://docs.boba.network/turing)
