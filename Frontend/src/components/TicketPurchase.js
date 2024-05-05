import React, { useState } from 'react';
import getContractInstance from '../config/ContractInstance'; 

const TicketPurchase = ({ purchaseNFT }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); 

  const handlePurchase = async () => {
    try {
      if (window.ethereum) {

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0]; 
        const contract = getContractInstance(); 
        await contract.methods.buyTicket().send({ from: account}); // Call the buyTicket function on the contract instance
        console.log(`Purchased NFT`);
        setSuccess(true); 
        purchaseNFT();
        throw new Error('MetaMask not detected');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error purchasing NFT:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="text-center p-8 rounded">
        <h2 className="text-2xl font-bold mb-4">Buy DeSweep Lottery NFT</h2>
        <button onClick={handlePurchase} className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition">Purchase</button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">Payment successful!</p>}
      </div>
    </div>
  );
};

export default TicketPurchase;
