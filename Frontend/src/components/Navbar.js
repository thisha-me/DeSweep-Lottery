import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ connectWallet }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  const truncateAddress=(address)=>{
    return address.substring(0,4)+"..."+address.substring(address.length-4,address.length)
  }

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        console.log('Connected to MetaMask');
        setWalletAddress(address);
        connectWallet();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('MetaMask not detected');
    }
  };

  return (
    <nav className="bg-gray-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">DeSweep</Link>
        <div>
          <Link to="/purchase" className="text-white mr-4 hover:text-blue-400 transition">Buy Lottery</Link>
          <Link to="/winners" className="text-white mr-4 hover:text-blue-400 transition">Winners</Link>
          {walletAddress ? (
            <span className="text-white mr-4">Wallet: {truncateAddress(walletAddress)}</span>
          ) : (
            <button onClick={handleConnectWallet} className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition">Connect Wallet</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
