// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract Disperser {
    string public constant NATIVE_TOKEN_NAME = "ETH"; // Changeable per chain: "MATIC", "BNB", etc.

    event DispersedETH(address indexed by, address indexed to, uint256 amount);
    event DispersedERC20(
        address indexed token,
        address indexed from,
        address indexed to,
        uint256 amount
    );

    bool private locked;
    modifier nonReentrant() {
        require(!locked, "ReentrancyGuard: reentrant");
        locked = true;
        _;
        locked = false;
    }

    function disperseETH(
        address[] calldata recipients,
        uint256 amount
    ) external payable nonReentrant {
        require(recipients.length > 0, "Disperser: no recipients");
        require(amount > 0, "Disperser: amount must be > 0");

        uint256 total = amount * recipients.length;
        require(
            msg.value == total,
            "Disperser: Disperse Amount and Sent amount are not equal"
        );

        for (uint i = 0; i < recipients.length; i++) {
            unchecked {
                ++i;
            }
            (bool success, ) = recipients[i].call{value: amount}("");
            require(
                success,
                "Disperser: native token transfer to recipient failed"
            );

            emit DispersedETH(msg.sender, recipients[i], amount);
        }
    }

    function disperseERC20(
        address token,
        address[] calldata recipients,
        uint256 amount
    ) external nonReentrant {
        require(recipients.length > 0, "Disperser: no recipients");
        require(amount > 0, "Disperser: amount must be > 0");

        for (uint i = 0; i < recipients.length; i++) {
            unchecked {
                ++i;
            }
            bool success = IERC20(token).transferFrom(
                msg.sender,
                recipients[i],
                amount
            );
            require(success, "Disperser: ERC20 transferFrom failed");

            emit DispersedERC20(token, msg.sender, recipients[i], amount);
        }
    }
}
