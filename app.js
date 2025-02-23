let web3, contract, userAccount;
const CONTRACT_ADDRESS = '0xcB02cE74AeA8aC527d8952Fb0393965fdD3229c5';
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnWeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"buyUnits","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"distributeDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getGlobalStats","outputs":[{"internalType":"uint256[8]","name":"contractData","type":"uint256[8]"},{"internalType":"uint256","name":"currentBalance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserStats","outputs":[{"internalType":"uint256[6]","name":"userData","type":"uint256[6]"},{"internalType":"uint256[2]","name":"pendingRewards","type":"uint256[2]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stats","outputs":[{"internalType":"uint256","name":"totalInvested","type":"uint256"},{"internalType":"uint256","name":"totalWeedProduced","type":"uint256"},{"internalType":"uint256","name":"totalBurned","type":"uint256"},{"internalType":"uint256","name":"totalDividends","type":"uint256"},{"internalType":"uint256","name":"totalBurnRewards","type":"uint256"},{"internalType":"uint256","name":"lastDistribution","type":"uint256"},{"internalType":"uint256","name":"activeUsers","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"invested","type":"uint256"},{"internalType":"uint256","name":"weedProduced","type":"uint256"},{"internalType":"uint256","name":"burned","type":"uint256"},{"internalType":"uint256","name":"dividendsReceived","type":"uint256"},{"internalType":"uint256","name":"burnRewards","type":"uint256"},{"internalType":"uint256","name":"lastUpdate","type":"uint256"}],"stateMutability":"view","type":"function"}];

// Elementos del DOM
const elements = {
    connectButton: document.getElementById('connectButton'),
    buyButton: document.getElementById('buyButton'),
    burnButton: document.getElementById('burnButton'),
    notification: document.getElementById('notification'),
    
    // Balances
    bnbBalance: document.getElementById('bnbBalance'),
    weedBalance: document.getElementById('weedBalance'),
    
    // Estadísticas Globales
    totalInvested: document.getElementById('totalInvested'),
    totalWeed: document.getElementById('totalWeed'),
    totalBurned: document.getElementById('totalBurned'),
    
    // Estadísticas Usuario
    userInvested: document.getElementById('userInvested'),
    productionRate: document.getElementById('productionRate'),
    pendingRewards: document.getElementById('pendingRewards')
};

// Event Listeners
elements.connectButton.addEventListener('click', connectWallet);
elements.buyButton.addEventListener('click', buyUnits);
elements.burnButton.addEventListener('click', burnWeed);

async function connectWallet() {
    try {
        if (!window.ethereum) throw new Error("Instala MetaMask");
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3 = new Web3(window.ethereum);
        userAccount = (await web3.eth.getAccounts())[0];
        
        initContract();
        updateAllStats();
        setupEventListeners();
        
        elements.connectButton.textContent = userAccount.slice(0,6) + '...' + userAccount.slice(-4);
        showNotification("Wallet conectada!", "success");

    } catch (error) {
        showNotification(error.message, "error");
    }
}

function initContract() {
    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
}

function setupEventListeners() {
    contract.events.Bought({ filter: { buyer: userAccount } })
        .on('data', () => updateAllStats())
        .on('error', console.error);

    contract.events.Burned({ filter: { burner: userAccount } })
        .on('data', () => updateAllStats())
        .on('error', console.error);
}

async function updateAllStats() {
    try {
        // Obtener datos globales
        const globalData = await contract.methods.getGlobalStats().call();
        elements.totalInvested.textContent = web3.utils.fromWei(globalData.totalInvested, 'ether') + ' BNB';
        elements.totalWeed.textContent = globalData.totalWeedProduced;
        elements.totalBurned.textContent = globalData.totalBurned;

        // Obtener datos del usuario
        const userData = await contract.methods.getUserStats(userAccount).call();
        elements.userInvested.textContent = web3.utils.fromWei(userData.invested, 'ether') + ' BNB';
        elements.productionRate.textContent = userData.weedProduced + '/s';
        elements.pendingRewards.textContent = web3.utils.fromWei(userData.pendingRewards, 'ether') + ' BNB';

        // Actualizar balances
        const bnbBalance = await web3.eth.getBalance(userAccount);
        elements.bnbBalance.textContent = web3.utils.fromWei(bnbBalance, 'ether').slice(0,7);
        elements.weedBalance.textContent = userData.weedProduced;

    } catch (error) {
        console.error("Error actualizando:", error);
    }
}

async function buyUnits() {
    const amount = document.getElementById('buyAmount').value;
    try {
        await contract.methods.buyUnits().send({
            from: userAccount,
            value: web3.utils.toWei(amount, 'ether')
        });
        showNotification("Unidades compradas!", "success");
    } catch (error) {
        showNotification("Error: " + error.message, "error");
    }
}

async function burnWeed() {
    const amount = document.getElementById('burnAmount').value;
    try {
        await contract.methods.burnWeed(amount).send({ from: userAccount });
        showNotification("Weed quemado!", "success");
    } catch (error) {
        showNotification("Error: " + error.message, "error");
    }
}

function showNotification(message, type = "info") {
    elements.notification.textContent = message;
    elements.notification.className = `notification ${type}`;
    elements.notification.style.display = 'block';
    setTimeout(() => elements.notification.style.display = 'none', 5000);
}

// Inicialización
window.addEventListener('load', async () => {
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', () => window.location.reload());
        window.ethereum.on('chainChanged', () => window.location.reload());
    }
});
