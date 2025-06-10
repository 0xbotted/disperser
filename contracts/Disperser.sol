// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);
}

interface IERC20Permit {
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

contract Disperser {
    string public constant NATIVE_TOKEN_NAME = "ETH";

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
        address[] calldata recipients
    ) external payable nonReentrant {
        uint256 numRecipients = recipients.length;
        require(numRecipients > 0, "Disperser: no recipients");
        require(msg.value > 0, "Disperser: no ETH sent");
        require(
            msg.value % numRecipients == 0,
            "Disperser: ETH not evenly divisible"
        );

        uint256 amountPerRecipient = msg.value / numRecipients;

        for (uint i = 0; i < numRecipients; ) {
            (bool success, ) = recipients[i].call{value: amountPerRecipient}(
                ""
            );
            require(success, "Disperser: native token transfer failed");
            emit DispersedETH(msg.sender, recipients[i], amountPerRecipient);
            unchecked {
                i++;
            }
        }
    }

    function disperseERC20(
        address token,
        address[] calldata recipients
    ) external nonReentrant {
        uint256 numRecipients = recipients.length;
        require(numRecipients > 0, "Disperser: no recipients");

        uint256 allowance = IERC20(token).allowance(msg.sender, address(this));
        require(allowance > 0, "Disperser: allowance is 0");
        require(
            allowance % numRecipients == 0,
            "Disperser: allowance not evenly divisible"
        );

        uint256 amountPerRecipient = allowance / numRecipients;

        for (uint i = 0; i < numRecipients; ) {
            bool success = IERC20(token).transferFrom(
                msg.sender,
                recipients[i],
                amountPerRecipient
            );
            require(success, "Disperser: ERC20 transfer failed");
            emit DispersedERC20(
                token,
                msg.sender,
                recipients[i],
                amountPerRecipient
            );
            unchecked {
                i++;
            }
        }
    }

    function disperseERC20WithPermit(
        address token,
        address[] calldata recipients,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant {
        uint256 numRecipients = recipients.length;
        require(numRecipients > 0, "Disperser: no recipients");

        uint256 balance = IERC20(token).balanceOf(msg.sender);
        require(balance > 0, "Disperser: balance is 0");
        require(
            balance % numRecipients == 0,
            "Disperser: balance not evenly divisible"
        );

        uint256 totalAmount = balance;
        uint256 amountPerRecipient = balance / numRecipients;

        IERC20Permit(token).permit(
            msg.sender,
            address(this),
            totalAmount,
            deadline,
            v,
            r,
            s
        );

        for (uint i = 0; i < numRecipients; ) {
            bool success = IERC20(token).transferFrom(
                msg.sender,
                recipients[i],
                amountPerRecipient
            );
            require(success, "Disperser: ERC20 transfer failed");
            emit DispersedERC20(
                token,
                msg.sender,
                recipients[i],
                amountPerRecipient
            );
            unchecked {
                i++;
            }
        }
    }
}
