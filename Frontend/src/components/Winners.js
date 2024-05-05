import React, { useState, useEffect } from 'react';
import getContractInstance from '../config/ContractInstance'; // Import the contract instance

const Winners = () => {
  const [winners, setWinners] = useState({
    goldWinner: '',
    silverWinner: '',
    bronzeWinner: ''
  });
  const [winnersAvailable, setWinnersAvailable] = useState(false);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const contract = getContractInstance(); // Get the contract instance
        // Call the getWinners function on the contract instance
        const result = await contract.methods.getWinners().call();
        const [goldWinner, silverWinner, bronzeWinner] = result;
        setWinners({
          goldWinner,
          silverWinner,
          bronzeWinner
        });
        setWinnersAvailable(true); // Set winners available flag
      } catch (error) {
        console.error('Error fetching winners:', error);
      }

    };

    fetchWinners();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 w-full">
      <div className="text-center text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Winners</h1>
        {winnersAvailable ? (
          <div>
            <div className="flex flex-col items-center mb-4">
              <span className="font-bold">Gold Winner:</span>
              <span>{winners.goldWinner}</span>
            </div>
            <div className="flex flex-col items-center mb-4">
              <span className="font-bold">Silver Winner:</span>
              <span>{winners.silverWinner}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">Bronze Winner:</span>
              <span>{winners.bronzeWinner}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-300">Lottery ongoing...</p>
        )}
      </div>
    </div>
  );
};

export default Winners;
