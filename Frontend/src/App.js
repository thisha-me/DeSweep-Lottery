import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TicketPurchase from './components/TicketPurchase';
import Winners from './components/Winners';
import Navbar from './components/Navbar';
import getContractInstance from './config/ContractInstance'; // Import the function

const App = () => {
  const handlePurchaseNFT = () => {
    console.log(`Purchasing NFT tickets...`);
  };

  const connectWallet = () => {
    console.log("Connecting to wallet...");
  };

  // Get the contract instance
  const contract = getContractInstance();

  return (
    <Router>
        <Navbar connectWallet={connectWallet} />
          <Routes>
            <Route path="/purchase" element={<TicketPurchase purchaseNFT={handlePurchaseNFT} />} />
            {/* Pass the contract instance as a prop */}
            <Route path="/winners" element={<Winners contract={contract} />} />
            <Route path="/" element={<h1 className="text-3xl font-bold text-center my-8">Welcome to DeSweep - NFT Lottery Platform</h1>} />
          </Routes>

    </Router>
  );
};

export default App;
