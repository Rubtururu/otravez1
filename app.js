// app.js - Versión BSC Testnet
let contract;
let userAddress;
let provider;

// Configuración BSC Testnet
const CONTRACT_ADDRESS = '0xF26B81A0c34aC6b126074Ba5f79C5D5418FFeBCD'; // Reemplazar con tu dirección
const CONTRACT_ABI = [[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"enum AdvancedWeedFarm.PlantType","name":"plantType","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlantPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"referrer","type":"address"}],"name":"ReferralRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"enum AdvancedWeedFarm.UpgradeType","name":"upgradeType","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"level","type":"uint256"}],"name":"UpgradePurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bnbReceived","type":"uint256"}],"name":"WeedBurned","type":"event"},{"inputs":[],"name":"BURN_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DAILY_POOL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REFERRAL_BONUS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPlayers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnWeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"enum AdvancedWeedFarm.PlantType","name":"plantType","type":"uint8"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyPlant","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"enum AdvancedWeedFarm.UpgradeType","name":"upgradeType","type":"uint8"}],"name":"buyUpgrade","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"baseCost","type":"uint256"},{"internalType":"uint256","name":"baseProduction","type":"uint256"},{"internalType":"uint256","name":"growthFactor","type":"uint256"}],"internalType":"struct AdvancedWeedFarm.PlantConfig","name":"config","type":"tuple"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"calculatePlantCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"calculateProduction","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"cost","type":"uint256"},{"internalType":"uint256","name":"effect","type":"uint256"},{"internalType":"uint256","name":"maxLevel","type":"uint256"}],"internalType":"struct AdvancedWeedFarm.UpgradeConfig","name":"config","type":"tuple"},{"internalType":"uint256","name":"currentLevel","type":"uint256"}],"name":"calculateUpgradeCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"claimReferralBonus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"harvestWeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"plantConfigs","outputs":[{"internalType":"uint256","name":"baseCost","type":"uint256"},{"internalType":"uint256","name":"baseProduction","type":"uint256"},{"internalType":"uint256","name":"growthFactor","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"players","outputs":[{"internalType":"uint256","name":"weed","type":"uint256"},{"internalType":"uint256","name":"lastHarvest","type":"uint256"},{"internalType":"uint256","name":"totalBurned","type":"uint256"},{"internalType":"uint256","name":"totalEarned","type":"uint256"},{"internalType":"string","name":"username","type":"string"},{"internalType":"address","name":"referrer","type":"address"},{"internalType":"uint256","name":"referrals","type":"uint256"},{"internalType":"uint256","name":"bonus","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"referrer","type":"address"}],"name":"register","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalBNB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalWeed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"upgradeConfigs","outputs":[{"internalType":"uint256","name":"cost","type":"uint256"},{"internalType":"uint256","name":"effect","type":"uint256"},{"internalType":"uint256","name":"maxLevel","type":"uint256"}],"stateMutability":"view","type":"function"}]];
const BSC_TESTNET_CONFIG = {
    chainId: '0x61', // 97 en decimal
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com/']
};

// Elementos UI
const UI = {
    connectBtn: document.getElementById('connectBtn'),
    weedBalance: document.getElementById('weedBalance'),
    bnbBalance: document.getElementById('bnbBalance'),
    productionRate: document.getElementById('productionRate'),
    shopPlants: document.getElementById('shopPlants'),
    leaderboard: document.getElementById('leaderboard')
};

// Inicialización
async function init() {
    try {
        // 1. Deshabilitar TronWeb si existe
        if (window.tronWeb) window.tronWeb = null;

        // 2. Verificar si MetaMask está instalado
        if (!window.ethereum) return showError('Instala MetaMask: https://metamask.io');

        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // 3. Configurar listeners de eventos
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('accountsChanged', handleAccountsChanged);

        // 4. Verificar y configurar red
        await checkNetwork();
        
        // 5. Conectar automáticamente si ya está autenticado
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
            userAddress = accounts[0];
            await setupContract();
        }

    } catch (error) {
        showError(error.message);
    }
}

// Conexión a MetaMask
async function connectWallet() {
    try {
        // 1. Solicitar conexión de cuenta
        await provider.send('eth_requestAccounts', []);
        
        // 2. Obtener cuenta
        userAddress = await provider.getSigner().getAddress();
        
        // 3. Actualizar UI
        UI.connectBtn.textContent = `${userAddress.slice(0,6)}...${userAddress.slice(-4)}`;
        
        // 4. Inicializar contrato
        await setupContract();
        
    } catch (error) {
        showError(`Error de conexión: ${error.message}`);
    }
}

// Configurar red BSC Testnet
async function checkNetwork() {
    const chainId = await provider.send('eth_chainId', []);
    
    if (chainId !== BSC_TESTNET_CONFIG.chainId) {
        try {
            await provider.send('wallet_switchEthereumChain', [{ 
                chainId: BSC_TESTNET_CONFIG.chainId 
            }]);
        } catch (error) {
            if (error.code === 4902) {
                await provider.send('wallet_addEthereumChain', [BSC_TESTNET_CONFIG]);
            }
        }
    }
}

// Inicializar contrato
async function setupContract() {
    try {
        contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            provider.getSigner()
        );

        // Verificar conexión
        const totalWeed = await contract.totalWeed();
        console.log('Conexión exitosa al contrato. Total WEED:', totalWeed.toString());
        
        // Iniciar actualizaciones
        updatePlayerStats();
        loadShopItems();
        startAutoHarvest();

    } catch (error) {
        showError(`Error en contrato: ${error.message}`);
    }
}

// Función para comprar plantas (ejemplo)
async function buyPlant(plantType, amount) {
    try {
        showLoader();
        const cost = await contract.getPlantCost(plantType, amount);
        
        const tx = await contract.buyPlant(plantType, amount, {
            value: cost,
            gasLimit: 300000 // Ajustar según necesidad
        });
        
        await tx.wait();
        updatePlayerStats();
        showSuccess(`¡${amount} plantas compradas!`);

    } catch (error) {
        showError(`Error en compra: ${error.message}`);
    } finally {
        hideLoader();
    }
}

// Actualizar estadísticas del jugador
async function updatePlayerStats() {
    try {
        const player = await contract.players(userAddress);
        
        UI.weedBalance.textContent = ethers.utils.formatUnits(player.weed, 0);
        UI.bnbBalance.textContent = ethers.utils.formatEther(player.totalEarned);
        UI.productionRate.textContent = await contract.getProductionRate(userAddress);

    } catch (error) {
        showError(`Error actualizando stats: ${error.message}`);
    }
}

// Manejar cambio de red
async function handleChainChanged(chainId) {
    if (chainId !== BSC_TESTNET_CONFIG.chainId) {
        showError('Cambia a BSC Testnet');
        await checkNetwork();
    }
}

// Manejar cambio de cuenta
async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        showError('Wallet desconectada');
        window.location.reload();
    } else {
        userAddress = accounts[0];
        await setupContract();
    }
}

// Auto-cosecha cada 30 segundos
function startAutoHarvest() {
    setInterval(async () => {
        if (userAddress) {
            try {
                await contract.harvestWeed();
                updatePlayerStats();
            } catch (error) {
                console.log('Error en auto-cosecha:', error);
            }
        }
    }, 30000); // 30 segundos
}

// Funciones de UI
function showError(message) {
    console.error(message);
    alert(message); // Reemplazar con tu sistema de notificaciones
}

function showSuccess(message) {
    console.log(message);
    // Implementar notificación visual
}

function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Iniciar la aplicación
window.onload = init;
window.connectWallet = connectWallet;
window.buyPlant = buyPlant;
