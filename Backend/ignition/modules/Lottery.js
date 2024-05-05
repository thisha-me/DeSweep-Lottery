const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Lottery", (m, context) => {
  // Load the contract factory
  const { ethers, run } = context;

  return async () => {
    const Lottery = await ethers.getContractFactory("Lottery");

    // Deploy the contract
    const deployedLottery = await Lottery.deploy();

    // Wait for the contract to be deployed
    await deployedLottery.deployed();

    // Log the contract address
    console.log("Lottery contract deployed to:", deployedLottery.address);

    // Verify the contract on Etherscan
    try {
      await run("verify:verify", {
        address: deployedLottery.address,
        constructorArguments: [], // Pass constructor arguments if any
      });
      console.log("Contract verified on Etherscan!");
    } catch (error) {
      console.error("Error verifying contract:", error);
      throw error;
    }

    // Return the deployed contract instance
    return { Lottery: deployedLottery };
  };
});
