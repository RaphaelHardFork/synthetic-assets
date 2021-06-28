//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

// contracts: https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts
// docs: https://docs.openzeppelin.com/contracts/4.x/

contract SyntheticEther is ERC20 {
    using Address for address payable;

    event AssetsMinted(address indexed minter, uint256 amount);
    event AssetsWithdrew(address indexed recipient, uint256 amount);

    constructor() ERC20("SyntheticEther", "SYE") {}

    receive() external payable {
        _mint(msg.sender, msg.value);
        emit AssetsMinted(msg.sender, msg.value);
    }

    function mintSYE() external payable returns (bool) {
        _mint(msg.sender, msg.value);
        emit AssetsMinted(msg.sender, msg.value);
        return true;
    }

    function withdrawSYE(uint256 amount) public returns (bool) {
        _burn(msg.sender, amount);
        payable(msg.sender).sendValue(amount);
        emit AssetsWithdrew(msg.sender, amount);
        return true;
    }
}
