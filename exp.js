// pulse-explorer-cli.js
const { ethers } = require("ethers");
const readline = require("readline");

// Define PulseChain RPC URL and provider
const provider = new ethers.JsonRpcProvider("https://rpc-pulsechain.g4mm4.io");

// Set up readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getBlock(blockNumberOrHash) {
    try {
        const block = await provider.getBlock(blockNumberOrHash);
        console.log("Block Details:", block);
    } catch (error) {
        console.error("Error fetching block:", error.message);
    }
    mainMenu();
}

async function getTransaction(txHash) {
    try {
        const tx = await provider.getTransaction(txHash);
        console.log("Transaction Details:", tx);
    } catch (error) {
        console.error("Error fetching transaction:", error.message);
    }
    mainMenu();
}

async function getAddressInfo(address) {
    try {
        const balance = await provider.getBalance(address);
        console.log(`Balance of ${address}: ${ethers.formatEther(balance)} PLS`);
    } catch (error) {
        console.error("Error fetching address info:", error.message);
    }
    mainMenu();
}

function mainMenu() {
    console.log("\nPulseChain Explorer CLI");
    console.log("1. Look up Block Details");
    console.log("2. Look up Transaction Details");
    console.log("3. Check Address Balance");
    console.log("4. Exit");
    
    rl.question("Choose an option: ", (choice) => {
        switch (choice.trim()) {
            case "1":
                rl.question("Enter Block Number or Hash: ", (input) => getBlock(input.trim()));
                break;
            case "2":
                rl.question("Enter Transaction Hash: ", (input) => getTransaction(input.trim()));
                break;
            case "3":
                rl.question("Enter Address: ", (input) => getAddressInfo(input.trim()));
                break;
            case "4":
                console.log("Exiting...");
                rl.close();
                break;
            default:
                console.log("Invalid choice. Please try again.");
                mainMenu();
                break;
        }
    });
}

// Start the app
mainMenu();
