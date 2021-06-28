/* eslint-disable no-unused-vars */
const { expect } = require('chai')
const { ethers } = require('hardhat')

// some tests: https://github.com/RaphaelHardFork/ico-hardhat

const CONTRACT_NAME = 'SyntheticEther'

describe('SyntheticEther', function () {
  let Contract, contract, dev, owner

  const SUPPLY = ethers.utils.parseEther('1.5')
  const ADDRESS_ZERO = ethers.constants.AddressZero

  beforeEach(async function () {
    ;[dev, owner] = await ethers.getSigners()
    Contract = await ethers.getContractFactory(CONTRACT_NAME)
    contract = await Contract.connect(dev).deploy()
    await contract.deployed()
  })

  describe('Mint token', function () {
    let mintCall
    beforeEach(async function () {
      mintCall = await contract.connect(owner).mintSYE({ value: SUPPLY })
    })
    it('should mint token', async function () {
      expect(await contract.balanceOf(owner.address)).to.equal(SUPPLY)
    })

    it('should decrease ether balance', async function () {
      expect(mintCall).to.changeEtherBalance(owner, SUPPLY.mul(-1))
    })

    it('should emit a AsstesMinted event', async function () {
      expect(mintCall)
        .to.emit(contract, 'AssetsMinted')
        .withArgs(owner.address, SUPPLY)
    })
  })

  describe('Withdraw token', function () {
    let withdrawCall
    beforeEach(async function () {
      await contract.connect(owner).mintSYE({ value: SUPPLY })
      withdrawCall = await contract.connect(owner).withdrawSYE(SUPPLY.div(2))
    })
    it('should burn token', async function () {
      expect(await contract.balanceOf(owner.address)).to.equal(SUPPLY.div(2))
    })

    it('should increase ether balance', async function () {
      expect(withdrawCall).to.changeEtherBalance(owner, SUPPLY.div(2))
    })

    it('should emit a AsstesMinted event', async function () {
      expect(withdrawCall)
        .to.emit(contract, 'AssetsWithdrew')
        .withArgs(owner.address, SUPPLY.div(2))
    })
  })

  describe('Interact directly with the contract', function () {
    let transferEther
    beforeEach(async function () {
      transferEther = await owner.sendTransaction({
        to: contract.address,
        value: SUPPLY,
      })
    })

    it('should mint token', async function () {
      expect(await contract.balanceOf(owner.address)).to.equal(SUPPLY)
    })

    it('should decrease ether balance', async function () {
      expect(transferEther).to.changeEtherBalance(owner, SUPPLY.mul(-1))
    })

    it('should emit a AsstesMinted event', async function () {
      expect(transferEther)
        .to.emit(contract, 'AssetsMinted')
        .withArgs(owner.address, SUPPLY)
    })

    it('should do something', async function () {
      await contract.connect(owner).transfer(contract.address, SUPPLY.div(2))
      expect(await contract.balanceOf(owner.address)).to.equal(SUPPLY.div(2))
    })
  })
})
