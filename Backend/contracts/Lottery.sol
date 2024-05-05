// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lottery is ERC721, Ownable, VRFConsumerBase {
    uint256 public constant TOTAL_TICKETS = 100;
    uint256 public constant TICKET_PRICE = 0.1 ether;
    uint256 public constant GOLD_WINNER_PERCENTAGE = 30;
    uint256 public constant SILVER_WINNER_PERCENTAGE = 10;
    uint256 public constant BRONZE_WINNER_PERCENTAGE = 5;

    address payable public treasury;
    uint256 public ticketCounter;
    uint256 public randomResult;
    uint256 public goldWinner;
    uint256 public silverWinner;
    uint256 public bronzeWinner;

    enum LotteryState { Open, Closed, Finished }
    LotteryState public lotteryState;

    mapping(address => uint256) public ticketsBought;
    mapping(uint256 => address) public ticketOwners;
    mapping(uint256 => bool) public winners;

    bytes32 public requestId;
    bytes32 internal keyHash=0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    uint256 internal fee=25;
    address internal vrfCoordinator=0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625;
    address internal linkToken=0x779877A7B0D9E8603169DdbD7836e478b4624789;

    event TicketPurchased(address indexed buyer, uint256 indexed ticketId);
    event LotteryDrawn(uint256 indexed goldWinner, uint256 indexed silverWinner, uint256 indexed bronzeWinner);

    constructor()
        ERC721("DeSweep NFT Lottery Ticket", "DSWEEP")
        VRFConsumerBase(vrfCoordinator, linkToken)
        Ownable(msg.sender)
    {
        treasury = payable(msg.sender);
        ticketCounter = 0;
        lotteryState = LotteryState.Open;
        requestId = 0;
    }

    function buyTicket() external payable {
        require(lotteryState == LotteryState.Open, "Lottery is not open");
        require(ticketCounter < TOTAL_TICKETS, "All tickets sold out");
        require(msg.value >= TICKET_PRICE, "Insufficient payment");

        ticketCounter++;
        uint256 tokenId = ticketCounter;
        _safeMint(msg.sender, tokenId);
        ticketsBought[msg.sender]++;
        ticketOwners[tokenId] = msg.sender;
        emit TicketPurchased(msg.sender, tokenId);

        if (ticketCounter == TOTAL_TICKETS) {
            lotteryState = LotteryState.Closed;
            requestId = requestRandomness(keyHash, fee);
        }
    }

    function fulfillRandomness(bytes32 _requestId, uint256 _randomness) internal override {
        require(_requestId == requestId, "Invalid request ID");
        randomResult = _randomness;
        drawLottery();
    }

    function drawLottery() internal {
        require(lotteryState == LotteryState.Closed, "Lottery is not closed");
        
        goldWinner = (randomResult % TOTAL_TICKETS) + 1;
        silverWinner = ((randomResult >> 128) % TOTAL_TICKETS) + 1;
        bronzeWinner = ((randomResult >> 256) % TOTAL_TICKETS) + 1;

        winners[goldWinner] = true;
        winners[silverWinner] = true;
        winners[bronzeWinner] = true;

        emit LotteryDrawn(goldWinner, silverWinner, bronzeWinner);

        distributePrizes();
        lotteryState = LotteryState.Finished;
    }

    function distributePrizes() internal {
        require(lotteryState == LotteryState.Finished, "Lottery is not finished");

        uint256 totalRevenue = TOTAL_TICKETS * TICKET_PRICE;
        uint256 goldPrize = totalRevenue * GOLD_WINNER_PERCENTAGE / 100;
        uint256 silverPrize = totalRevenue * SILVER_WINNER_PERCENTAGE / 100;
        uint256 bronzePrize = totalRevenue * BRONZE_WINNER_PERCENTAGE / 100;

        treasury.transfer(totalRevenue - goldPrize - silverPrize - bronzePrize);

        for (uint256 i = 1; i <= TOTAL_TICKETS; i++) {
            address winnerAddress = ticketOwners[i];
            if (winners[i]) {
                if (i == goldWinner) {
                    payable(winnerAddress).transfer(goldPrize);
                } else if (i == silverWinner) {
                    payable(winnerAddress).transfer(silverPrize);
                } else if (i == bronzeWinner) {
                    payable(winnerAddress).transfer(bronzePrize);
                }
            }
        }
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        treasury.transfer(balance);
    }

    // Fallback function to receive Ether
    receive() external payable {}
}

