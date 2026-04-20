// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WishBoard {
    struct Wish {
        address creator;
        string title;
        string description;
        uint256 deadline;
        uint256 balance;
        bool completed;
        bool claimed;
    }

    Wish[] public wishes;

    mapping(uint256 => mapping(address => uint256)) public contributions;

    function createWish(string memory _title, string memory _description, uint256 _duration) public {
        wishes.push(Wish({
            creator: msg.sender,
            title: _title,
            description: _description,
            deadline: block.timestamp + _duration,
            balance: 0,
            completed: false,
            claimed: false
        }));
    }

    function fundWish(uint256 _id) public payable {
        require(msg.value > 0, "Send ETH");
        Wish storage w = wishes[_id];
        require(block.timestamp < w.deadline, "Expired");

        w.balance += msg.value;
        contributions[_id][msg.sender] += msg.value;
    }

    function markCompleted(uint256 _id) public {
        Wish storage w = wishes[_id];
        require(msg.sender == w.creator, "Not owner");
        require(block.timestamp <= w.deadline, "Deadline passed");

        w.completed = true;
    }

    function claimFunds(uint256 _id) public {
        Wish storage w = wishes[_id];
        require(msg.sender == w.creator, "Not owner");
        require(w.completed, "Not completed");
        require(!w.claimed, "Already claimed");

        w.claimed = true;
        (bool success, ) = payable(msg.sender).call{value: w.balance}("");
        require(success, "Transfer failed");
    }

    function refund(uint256 _id) public {
        Wish storage w = wishes[_id];
        require(block.timestamp > w.deadline, "Not expired");
        require(!w.completed, "Completed");

        uint256 amount = contributions[_id][msg.sender];
        require(amount > 0, "No funds");

        contributions[_id][msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Refund failed");
    }

    function getWishes() public view returns (Wish[] memory) {
        return wishes;
    }
}