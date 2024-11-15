# PulseChain Explorer CLI

**PulseChain Explorer CLI** is a lightweight, interactive command-line tool for exploring blockchain data on the PulseChain network. It provides quick access to block details, transaction information, and address balances without needing a web-based explorer.
## Features - Look up details for specific blocks (by number or hash). - Retrieve information about individual transactions. - Check the balance of any address in PLS (PulseChain's native token). - Interactive menu allows for easy navigation and repeated operations. 
## Installation 1. **Clone the Repository** ``` git clone https://github.com/yourusername/pls-exp-cli.git cd pls-exp-cli ``` 2. **Install Dependencies** ``` npm install ethers readline ``` 
## Usage Run the app from the command line: ``` node exp.js ``` Once started, you will be presented with an interactive menu: 1. **Look up Block Details** - Enter a block number or block hash to view details of the specific block. 2. **Look up Transaction Details** - Enter a transaction hash to view details of the transaction. 3. **Check Address Balance** - Enter an address to retrieve its balance in PLS. 4. **Exit** - Close the application. After each operation, the application will return to the main menu, allowing continuous use. 
## Example ``` PulseChain Explorer CLI 1. Look up Block Details 2. Look up Transaction Details 3. Check Address Balance 4. Exit Choose an option: 1 Enter Block Number or Hash: 123456 Block Details: { block information displayed here } Choose an option: 3 Enter Address: 0xYourAddressHere Balance of 0xYourAddressHere: 1000 PLS Choose an option: 4 Exiting... ``` 
## Requirements - Node.js (>=12.x recommended) - PulseChain RPC URL (`https://rpc-pulsechain.g4mm4.io`), which is embedded in the script. 
## Customization To change the RPC provider URL or add more functionality (e.g., querying smart contracts), modify the `exp.js` file. 
## License This project is open-source and available under the MIT License.
