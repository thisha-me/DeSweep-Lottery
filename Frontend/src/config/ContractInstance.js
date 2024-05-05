import Web3 from "web3";
import lotteryABI from "./lotteryABI.json";

const getContractInstance = () => {
    const web3 = new Web3(window.ethereum);
    const contractAddress = '0x6e78e07F744b04b09FD7606b6121756170b4eC45';
    return new web3.eth.Contract(lotteryABI, contractAddress);
};

export default getContractInstance;