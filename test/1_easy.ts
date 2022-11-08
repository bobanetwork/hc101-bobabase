import { BigNumber, Contract, ContractFactory, providers, Wallet, utils } from 'ethers'
import { getContractFactory } from '@eth-optimism/contracts'
import { ethers } from 'hardhat'
import chai, { expect } from 'chai'
import chalk from 'chalk'
import { solidity } from 'ethereum-waffle'
chai.use(solidity)
const abiDecoder = require('web3-eth-abi')
import * as request from 'request-promise-native'

import hre from 'hardhat'
const cfg = hre.network.config

const gasOverride = { gasLimit: 3000000 }
const local_provider = new providers.JsonRpcProvider(cfg['url'])

const deployerPK = hre.network.config.accounts[0]
const deployerWallet = new Wallet(deployerPK, local_provider)

var BOBAL2Address
var BobaTuringCreditAddress

let Factory__Easy: ContractFactory
let easy: Contract
let Factory__Helper: ContractFactory
let helper: Contract
let turingCredit: Contract
let L2BOBAToken: Contract

import BobaTuringCreditJson from "../abi/BobaTuringCredit.json";
import EasyJson from "../artifacts/contracts/Easy.sol/Easy.json"
import TuringHelperJson from "../artifacts/contracts/TuringHelper.sol/TuringHelper.json"
import L2GovernanceERC20Json from '../abi/L2GovernanceERC20.json'

describe("Easy Random Number", function () {

    before(async () => {

    Factory__Helper = new ContractFactory(
      (TuringHelperJson.abi),
      (TuringHelperJson.bytecode),
      deployerWallet)

    helper = await Factory__Helper.deploy(gasOverride)
    console.log(`${chalk.green(`    Hybrid Compute Helper contract deployed as`)}`, helper.address)

    Factory__Easy = new ContractFactory(
      (EasyJson.abi),
      (EasyJson.bytecode),
      deployerWallet)

    easy = await Factory__Easy.deploy(
      helper.address,
      gasOverride
    )

    console.log(`${chalk.green(`    Easy (Your contract) deployed as`)}`, easy.address)

    // whitelist the new 'lending' contract in the helper
    const tr1 = await helper.addPermittedCaller(easy.address)
    const res1 = await tr1.wait()
    console.log(`${chalk.green(`    addingPermittedCaller to TuringHelper`)}`, res1.events[0].data)

    BOBAL2Address = "0x4200000000000000000000000000000000000006";
    BobaTuringCreditAddress = "0x4200000000000000000000000000000000000020";


    L2BOBAToken = new Contract(
      BOBAL2Address,
      L2GovernanceERC20Json.abi,
      deployerWallet
    )

    const bobaBalance = await L2BOBAToken.balanceOf(deployerWallet.address)
    console.log("    BOBA Balance in your account", bobaBalance.toString())

    // prepare to register/fund your Turing Helper
      turingCredit = new ContractFactory(
        BobaTuringCreditJson.abi,
        BobaTuringCreditJson.bytecode,
        deployerWallet
      ).attach(BobaTuringCreditAddress);
  })

  it("contract should be whitelisted", async () => {
    const tr2 = await helper.checkPermittedCaller(easy.address, gasOverride)
    const res2 = await tr2.wait()
    const rawData = res2.events[0].data
    const result = parseInt(rawData.slice(-64), 16)
    expect(result).to.equal(1)
    console.log(`${chalk.green(`    Test contract whitelisted in TuringHelper (1 = yes)?`)}`, result)
  })

  it('Should register and fund your Turing helper contract in turingCredit', async () => {

    const depositAmount = utils.parseEther('0.20')

    const depositTx = await turingCredit.addBalanceTo(
      depositAmount,
      helper.address,
      { value: depositAmount }
    )
    await depositTx.wait()
  })

  it("should return the helper address", async () => {
    let helperAddress = await easy.helperAddr()
    expect(helperAddress).to.equal(helper.address)
  })

  it("should get a random number", async () => {
    await easy.estimateGas.getRandom()
    await easy.getRandom()

    const num = await easy.randomNumber()

    console.log('   Your magic number: ', num.toString())
  })

})

