// app.js
let web3;
let contract;
let account;
const CONTRACT_ADDRESS = '0xcB02cE74AeA8aC527d8952Fb0393965fdD3229c5'; // Dirección del contrato desplegado
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnWeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"buyUnits","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"distributeDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getGlobalStats","outputs":[{"internalType":"uint256[8]","name":"contractData","type":"uint256[8]"},{"internalType":"uint256","name":"currentBalance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserStats","outputs":[{"internalType":"uint256[6]","name":"userData","type":"uint256[6]"},{"internalType":"uint256[2]","name":"pendingRewards","type":"uint256[2]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stats","outputs":[{"internalType":"uint256","name":"totalInvested","type":"uint256"},{"internalType":"uint256","name":"totalWeedProduced","type":"uint256"},{"internalType":"uint256","name":"totalBurned","type":"uint256"},{"internalType":"uint256","name":"totalDividends","type":"uint256"},{"internalType":"uint256","name":"totalBurnRewards","type":"uint256"},{"internalType":"uint256","name":"lastDistribution","type":"uint256"},{"internalType":"uint256","name":"activeUsers","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"invested","type":"uint256"},{"internalType":"uint256","name":"weedProduced","type":"uint256"},{"internalType":"uint256","name":"burned","type":"uint256"},{"internalType":"uint256","name":"dividendsReceived","type":"uint256"},{"internalType":"uint256","name":"burnRewards","type":"uint256"},{"internalType":"uint256","name":"lastUpdate","type":"uint256"}],"stateMutability":"view","type":"function"}]; // ABI del contrato

window.addEventListener('load', async () => {
    // Conectar a MetaMask
    if(window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            account = (await web3.eth.getAccounts())[0];
            initContract();
            checkAdmin();
            setInterval(updateStats, 5000);
        } catch(error) {
            alert("Error al conectar la wallet");
        }
    }
});

function initContract() {
    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    updateStats();
}

async function updateStats() {
    // Estadísticas globales
    const globalStats = await contract.methods.getGlobalStats().call();
    document.getElementById('totalInvested').innerText = web3.utils.fromWei(globalStats[0], 'ether');
    document.getElementById('totalWeedProduced').innerText = web3.utils.fromWei(globalStats[1], 'ether');
    document.getElementById('totalBurned').innerText = web3.utils.fromWei(globalStats[2], 'ether');
    document.getElementById('lastDistribution').innerText = new Date(globalStats[5] * 1000).toLocaleString();
    
    // Estadísticas usuario
    const userStats = await contract.methods.getUserStats(account).call();
    document.getElementById('userInvested').innerText = web3.utils.fromWei(userStats[0], 'ether');
    document.getElementById('userWeedProduced').innerText = web3.utils.fromWei(userStats[1], 'ether');
    document.getElementById('userBurned').innerText = web3.utils.fromWei(userStats[2], 'ether');
    document.getElementById('pendingRewards').innerText = 
        `${parseFloat(web3.utils.fromWei(userStats[3], 'ether')).toFixed(6)} BNB`;
}

async function buyUnits() {
    const bnbAmount = document.getElementById('bnbAmount').value;
    const weiAmount = web3.utils.toWei(bnbAmount, 'ether');
    
    try {
        await contract.methods.buyUnits().send({
            from: account,
            value: weiAmount
        });
        updateStats();
    } catch(error) {
        alert("Error en la compra: " + error.message);
    }
}

async function burnWeed() {
    const amount = document.getElementById('weedToBurn').value;
    
    try {
        await contract.methods.burnWeed(amount).send({ from: account });
        updateStats();
    } catch(error) {
        alert("Error al quemar: " + error.message);
    }
}

async function claimRewards() {
    try {
        await contract.methods.claimRewards().send({ from: account });
        updateStats();
    } catch(error) {
        alert("Error al reclamar: " + error.message);
    }
}

async function distributeDividends() {
    try {
        await contract.methods.distributeDividends().send({ from: account });
        updateStats();
    } catch(error) {
        alert("Error en distribución: " + error.message);
    }
}

async function checkAdmin() {
    const owner = await contract.methods.owner().call();
    if(account.toLowerCase() === owner.toLowerCase()) {
        document.getElementById('adminSection').style.display = 'block';
    }
}

// Helpers
function formatWei(value) {
    return parseFloat(web3.utils.fromWei(value, 'ether')).toFixed(6);
}
