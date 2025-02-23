let web3, contract, account;
const CONTRACT_ADDRESS = '0xcB02cE74AeA8aC527d8952Fb0393965fdD3229c5'; // Reemplazar con tu dirección
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnWeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"buyUnits","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"distributeDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getGlobalStats","outputs":[{"internalType":"uint256[8]","name":"contractData","type":"uint256[8]"},{"internalType":"uint256","name":"currentBalance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserStats","outputs":[{"internalType":"uint256[6]","name":"userData","type":"uint256[6]"},{"internalType":"uint256[2]","name":"pendingRewards","type":"uint256[2]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stats","outputs":[{"internalType":"uint256","name":"totalInvested","type":"uint256"},{"internalType":"uint256","name":"totalWeedProduced","type":"uint256"},{"internalType":"uint256","name":"totalBurned","type":"uint256"},{"internalType":"uint256","name":"totalDividends","type":"uint256"},{"internalType":"uint256","name":"totalBurnRewards","type":"uint256"},{"internalType":"uint256","name":"lastDistribution","type":"uint256"},{"internalType":"uint256","name":"activeUsers","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"invested","type":"uint256"},{"internalType":"uint256","name":"weedProduced","type":"uint256"},{"internalType":"uint256","name":"burned","type":"uint256"},{"internalType":"uint256","name":"dividendsReceived","type":"uint256"},{"internalType":"uint256","name":"burnRewards","type":"uint256"},{"internalType":"uint256","name":"lastUpdate","type":"uint256"}],"stateMutability":"view","type":"function"}];

// Conexión inicial
async function connectWallet() {
    try {
        if (!window.ethereum) throw new Error("Instala MetaMask");
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3 = new Web3(window.ethereum);
        account = (await web3.eth.getAccounts())[0];
        
        initContract();
        updateStats();
        setInterval(updateStats, 3000);
        
        document.getElementById('connectBtn').textContent = 
            `${account.slice(0, 6)}...${account.slice(-4)}`;
        
        console.log("Conectado:", account);

    } catch (error) {
        console.error("Error de conexión:", error);
        alert(`Error: ${error.message}`);
    }
}

// Inicializar contrato
function initContract() {
    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    
    // Listeners de eventos
    contract.events.Bought().on('data', () => {
        console.log("Nueva compra detectada");
        updateStats();
    });
    
    contract.events.Burned().on('data', () => {
        console.log("Nuevo quemado detectado");
        updateStats();
    });
}

// Actualizar estadísticas
async function updateStats() {
    try {
        console.log("Actualizando estadísticas...");
        
        // Obtener datos globales
        const globalData = await contract.methods.getGlobalStats().call();
        document.getElementById('totalInvested').textContent = 
            `${web3.utils.fromWei(globalData[0], 'ether')} BNB`;
        document.getElementById('totalWeed').textContent = globalData[1];
        document.getElementById('totalBurned').textContent = globalData[2];
        
        // Obtener datos del usuario
        const userData = await contract.methods.getUserStats(account).call();
        document.getElementById('userInvested').textContent = 
            `${web3.utils.fromWei(userData[0][0], 'ether')} BNB`;
        document.getElementById('productionRate').textContent = 
            `${userData[0][1]}/s`;
        document.getElementById('pendingRewards').textContent = 
            `${web3.utils.fromWei(userData[1][0].add(userData[1][1]), 'ether')} BNB`;
        
        // Actualizar balances
        const bnbBalance = await web3.eth.getBalance(account);
        document.getElementById('bnbBalance').textContent = 
            web3.utils.fromWei(bnbBalance, 'ether').slice(0, 6);
        document.getElementById('weedBalance').textContent = userData[0][1];

    } catch (error) {
        console.error("Error actualizando:", error);
    }
}

// Interacciones
async function buyUnits() {
    const amount = document.getElementById('buyAmount').value;
    try {
        await contract.methods.buyUnits().send({
            from: account,
            value: web3.utils.toWei(amount, 'ether')
        });
        console.log("Compra exitosa");
    } catch (error) {
        console.error("Error comprando:", error);
    }
}

async function burnWeed() {
    const amount = document.getElementById('burnAmount').value;
    try {
        await contract.methods.burnWeed(amount).send({ from: account });
        console.log("Quemado exitoso");
    } catch (error) {
        console.error("Error quemando:", error);
    }
}

// Inicialización
window.addEventListener('load', () => {
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', () => window.location.reload());
        window.ethereum.on('chainChanged', () => window.location.reload());
    }
});
