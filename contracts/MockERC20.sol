// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "solmate/src/tokens/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("MockToken", "MTK", 18) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
