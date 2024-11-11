const { ethers } = require("ethers");
const readline = require("readline");

// Initialize WebSocketProvider for live updates
const provider = new ethers.WebSocketProvider("wss://rpc-pulsechain.g4mm4.io");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Manually set the Transfer event signature for ERC-20 tokens
const transferEventSignature = ethers.keccak256(ethers.toUtf8Bytes("Transfer(address,address,uint256)"));

// Minimal ERC-20 ABI for fetching token name
const erc20Abi = [
    "function name() view returns (string)",
];

async function displayMenu() {
    console.log("\nPulseChain Explorer CLI");
    console.log("1. Look up Block Details");
    console.log("2. Look up Transaction Details");
    console.log("3. Check Address Balance");
    console.log("4. Live Block Viewer");
    console.log("5. Exit");

    rl.question("Choose an option: ", async (choice) => {
        switch (choice) {
            case "1":
                await getBlockDetails();
                break;
            case "2":
                await getTransactionDetails();
                break;
            case "3":
                await checkAddressBalance();
                break;
            case "4":
                liveBlockViewer();
                break;
            case "5":
                console.log("Exiting...");
                provider.destroy();
                rl.close();
                process.exit(0);
            default:
                console.log("Invalid choice. Please try again.");
                displayMenu();
        }
    });
}

// Option 4: Live Block Viewer
function liveBlockViewer() {
    console.log("Listening for new blocks...\n");

    provider.on("block", async (blockNumber) => {
        console.clear();
        console.log(`New Block Mined: ${blockNumber}`);

        try {
            const block = await provider.getBlock(blockNumber);

            if (!block) {
                console.log(`Could not retrieve block details for ${blockNumber}`);
                return;
            }

            console.log("Transactions:");
            for (const txHash of block.transactions) {
                const tx = await provider.getTransaction(txHash);

                console.log(`\nTransaction:`);
                console.log(`  Tx Hash: ${tx.hash}`);
                console.log(`  From: ${tx.from}`);
                console.log(`  To: ${tx.to}`);

                if (tx.value) {
                    console.log(`  Value: ${ethers.formatEther(tx.value)} PLS`);
                } else {
                    console.log(`  Value: 0 PLS (or undefined)`);
                }
                
                console.log(`  Gas Used: ${tx.gasLimit ? tx.gasLimit.toString() : "N/A"}`);

                // Fetch transaction receipt to access logs for token transfers
                const receipt = await provider.getTransactionReceipt(txHash);
                const tokenTransfers = receipt.logs.filter(log => log.topics[0] === transferEventSignature);

                // Display any token transfers found
                if (tokenTransfers.length > 0) {
                    console.log("  Token Transfers:");
                    for (const transfer of tokenTransfers) {
                        const from = `0x${transfer.topics[1].slice(26)}`;
                        const to = `0x${transfer.topics[2].slice(26)}`;
                        const value = ethers.getBigInt(transfer.data);

                        // Initialize the token contract
                        const tokenContract = new ethers.Contract(transfer.address, erc20Abi, provider);

                        try {
                            // Fetch the token name
                            const tokenName = await tokenContract.name();
                            console.log(`    Token Name: ${tokenName}`);
                        } catch (error) {
                            console.log("    Token Name: Unknown (failed to fetch)");
                        }

                        console.log(`    From: ${from}`);
                        console.log(`    To: ${to}`);
                        console.log(`    Amount: ${ethers.formatUnits(value, 18)} tokens`);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching transactions:", error.message);
        }
    });

    rl.question("\nPress Enter to return to the main menu.\n", () => {
        provider.removeAllListeners("block");
        displayMenu();
    });
}

// Option 1: Look up Block Details
async function getBlockDetails() {
    rl.question("Enter Block Number or Hash: ", async (input) => {
        try {
            const block = await provider.getBlock(input);
            console.log("Block Details:", block);
        } catch (error) {
            console.error("Error fetching block details:", error.message);
        }
        displayMenu();
    });
}

// Option 2: Look up Transaction Details
async function getTransactionDetails() {
    rl.question("Enter Transaction Hash: ", async (txHash) => {
        try {
            const transaction = await provider.getTransaction(txHash);
            console.log("Transaction Details:", transaction);
        } catch (error) {
            console.error("Error fetching transaction details:", error.message);
        }
        displayMenu();
    });
}

// Option 3: Check Address Balance
async function checkAddressBalance() {
    rl.question("Enter Address: ", async (address) => {
        try {
            const balance = await provider.getBalance(address);
            console.log(`Balance: ${ethers.formatEther(balance)} PLS`);
        } catch (error) {
            console.error("Error fetching balance:", error.message);
        }
        displayMenu();
    });
}

// Start the CLI
displayMenu();
