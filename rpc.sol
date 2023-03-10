// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract rpc {
    enum Action {
        Rock,
        Paper,
        Scissors
    }
    /*enum Outcome{
        Draw,
        Win,
        Loss
    }*/

    //modifier onlyOwner
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    //Owner's address
    address owner;

    event HandThrown(
        address player,
        uint256 amount,
        uint8 option,
        uint8 result
    );

    constructor() payable {
        owner = msg.sender;
    }

    //function that asks for 0 or 1 and returns if you win or lose
    function handThrow(uint8 _option) public payable returns (string memory) {
        //require(_option<4, "Please select rock (1), paper (2) or scissors (3)");
        //require(msg.value>0, "Please add your bet"); //WEI smallest unit ETH
        //1,000,000,000,000,000,000 WEI = 1 ETH
        //require(msg.value*2 <= address(this).balance, "Contract balance is insuffieient ");

        //PseudoRandom and check with _option
        uint8 result = uint8((block.timestamp * block.gaslimit) % 3);

        //Emiting event of Hand Move
        emit HandThrown(msg.sender, msg.value, _option, result);

        //Outcome outcome;
        if (result == _option) {
            //outcome = Outcome.Draw;
            //emit GamePlayed(msg.sender, outcome);
            payable(msg.sender).transfer(0);
            return "DRAW";
        } else if (
            (_option == uint8(Action.Rock) &&
                result == uint8(Action.Scissors)) ||
            (_option == uint8(Action.Paper) && result == uint8(Action.Rock)) ||
            (_option == uint8(Action.Scissors) && result == uint8(Action.Paper))
        ) {
            //outcome = Outcome.Win;
            payable(msg.sender).transfer(msg.value * 2);
            return "WIN";
        } else {
            //outcome = Outcome.Loss;
            return "LOSS";
        }
    }

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
