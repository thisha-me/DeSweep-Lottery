const hre = require("hardhat");

async function main() {
  const Lottery = await hre.ethers.getContractFactory("Lottery");
  console.log("Deploying contract...");
  const contract = await Lottery.deploy();
  // Wait for the contract to be mined
  await contract.waitForDeployment();
  console.log("Contract deployed to:", contract.address);


  console.log("Verifying contract on Etherscan...");

  try {
    await hre.run("verify:verify", {
      address: contract.address,
      constructorArguments: [], // Pass constructor arguments if any
    });
    console.log("Contract verified on Etherscan!");
  } catch (error) {
    console.error("Error verifying contract:", error);
    process.exit(1);
  }

  console.log(`Lottery contract deployed to ${contract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
