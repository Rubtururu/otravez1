// app.js - Versión Completa
let contract;
let userAddress;
let provider;
let signer;

// Configuración (REEMPLAZAR CON TUS DATOS)
const CONTRACT_ADDRESS = '0xF26B81A0c34aC6b126074Ba5f79C5D5418FFeBCD';
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"enum AdvancedWeedFarm.PlantType","name":"plantType","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlantPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"referrer","type":"address"}],"name":"ReferralRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"enum AdvancedWeedFarm.UpgradeType","name":"upgradeType","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"level","type":"uint256"}],"name":"UpgradePurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bnbReceived","type":"uint256"}],"name":"WeedBurned","type":"event"},{"inputs":[],"name":"BURN_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DAILY_POOL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REFERRAL_BONUS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPlayers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnWeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"enum AdvancedWeedFarm.PlantType","name":"plantType","type":"uint8"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyPlant","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"enum AdvancedWeedFarm.UpgradeType","name":"upgradeType","type":"uint8"}],"name":"buyUpgrade","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"baseCost","type":"uint256"},{"internalType":"uint256","name":"baseProduction","type":"uint256"},{"internalType":"uint256","name":"growthFactor","type":"uint256"}],"internalType":"struct AdvancedWeedFarm.PlantConfig","name":"config","type":"tuple"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"calculatePlantCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"calculateProduction","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"cost","type":"uint256"},{"internalType":"uint256","name":"effect","type":"uint256"},{"internalType":"uint256","name":"maxLevel","type":"uint256"}],"internalType":"struct AdvancedWeedFarm.UpgradeConfig","name":"config","type":"tuple"},{"internalType":"uint256","name":"currentLevel","type":"uint256"}],"name":"calculateUpgradeCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"claimReferralBonus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"harvestWeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"plantConfigs","outputs":[{"internalType":"uint256","name":"baseCost","type":"uint256"},{"internalType":"uint256","name":"baseProduction","type":"uint256"},{"internalType":"uint256","name":"growthFactor","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"players","outputs":[{"internalType":"uint256","name":"weed","type":"uint256"},{"internalType":"uint256","name":"lastHarvest","type":"uint256"},{"internalType":"uint256","name":"totalBurned","type":"uint256"},{"internalType":"uint256","name":"totalEarned","type":"uint256"},{"internalType":"string","name":"username","type":"string"},{"internalType":"address","name":"referrer","type":"address"},{"internalType":"uint256","name":"referrals","type":"uint256"},{"internalType":"uint256","name":"bonus","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"referrer","type":"address"}],"name":"register","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalBNB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalWeed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"upgradeConfigs","outputs":[{"internalType":"uint256","name":"cost","type":"uint256"},{"internalType":"uint256","name":"effect","type":"uint256"},{"internalType":"uint256","name":"maxLevel","type":"uint256"}],"stateMutability":"view","type":"function"}];
const BSC_CHAIN_ID = '0x38'; // BSC Mainnet

// Elementos UI
const UI = {
    connectBtn: document.getElementById('connectBtn'),
    weedBalance: document.getElementById('weedBalance'),
    bnbBalance: document.getElementById('bnbBalance'),
    productionRate: document.getElementById('productionRate'),
    plantsOwned: document.getElementById('plantsOwned'),
    upgradesOwned: document.getElementById('upgradesOwned'),
    leaderboard: document.getElementById('leaderboard'),
    shopPlants: document.getElementById('shopPlants'),
    shopUpgrades: document.getElementById('shopUpgrades'),
    burnAmount: document.getElementById('burnAmount'),
    referralBonus: document.getElementById('referralBonus'),
    registerModal: document.getElementById('registerModal'),
    usernameInput: document.getElementById('username'),
    referrerInput: document.getElementById('referrer')
};

// Inicialización
async function init() {
    if (!window.ethereum) return showError('Instala MetaMask');
    
    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        
        setupEventListeners();
        await checkNetwork();
        await handleAccountsChanged();
        
        if (await isRegistered()) {
            startAutoHarvest();
            loadShopItems();
        } else {
            showModal('registerModal');
        }
        
    } catch (error) {
        showError(error.message);
    }
}

// Registro de usuario
async function registerUser() {
    try {
        const username = UI.usernameInput.value;
        const referrer = UI.referrerInput.value || ethers.constants.AddressZero;
        
        if (!username) throw new Error('¡Nombre requerido!');
        
        const tx = await contract.register(username, referrer);
        await tx.wait();
        
        hideModal('registerModal');
        startAutoHarvest();
        loadShopItems();
        updateAllStats();
        
    } catch (error) {
        showError(error.message);
    }
}

// Tienda Dinámica
async function loadShopItems() {
    try {
        // Cargar plantas
        const plantCount = await contract.plantConfigsLength();
        UI.shopPlants.innerHTML = await Promise.all(
            Array.from({length: plantCount}, async (_, i) => {
                const config = await contract.plantConfigs(i);
                return `
                    <div class="shop-item">
                        <h3>${await contract.getPlantName(i)}</h3>
                        <p>Producción: ${config.baseProduction}/s</p>
                        <p>Coste: ${ethers.utils.formatEther(config.baseCost)} BNB</p>
                        <div class="shop-actions">
                            <button onclick="buyPlant(${i}, 1)">+1</button>
                            <button onclick="buyPlant(${i}, 5)">+5</button>
                        </div>
                    </div>
                `;
            })
        ).join('');

        // Cargar mejoras
        const upgradeCount = await contract.upgradeConfigsLength();
        UI.shopUpgrades.innerHTML = await Promise.all(
            Array.from({length: upgradeCount}, async (_, i) => {
                const config = await contract.upgradeConfigs(i);
                const currentLevel = await contract.getUpgradeLevel(userAddress, i);
                return `
                    <div class="shop-item">
                        <h3>Mejora Nivel ${currentLevel + 1}</h3>
                        <p>+${config.effect}% Eficiencia</p>
                        <p>Coste: ${ethers.utils.formatEther(config.cost)} BNB</p>
                        <button onclick="buyUpgrade(${i})">Mejorar</button>
                    </div>
                `;
            })
        ).join('');
        
    } catch (error) {
        showError(error.message);
    }
}

// Transacciones Complejas
async function buyPlant(plantType, amount) {
    try {
        showLoader();
        const cost = await contract.calculatePlantCost(plantType, amount);
        const tx = await contract.buyPlant(plantType, amount, { 
            value: cost,
            gasLimit: 500000 
        });
        await tx.wait();
        updateAllStats();
        showSuccess(`¡${amount} plantas compradas!`);
    } catch (error) {
        showError(`Fallo compra: ${error.message}`);
    } finally {
        hideLoader();
    }
}

async function burnWeed() {
    try {
        showLoader();
        const amount = UI.burnAmount.value;
        if (!amount || amount <= 0) throw new Error('Cantidad inválida');
        
        const tx = await contract.burnWeed(amount, { gasLimit: 300000 });
        await tx.wait();
        updateAllStats();
        showSuccess(`¡${amount} WEED quemados!`);
    } catch (error) {
        showError(`Fallo al quemar: ${error.message}`);
    } finally {
        hideLoader();
    }
}

// Sistema de Referidos
async function handleReferrals() {
    const referralBonus = await contract.getReferralBonus(userAddress);
    UI.referralBonus.textContent = ethers.utils.formatEther(referralBonus);
    
    const referralLink = `${window.location.href}?ref=${userAddress}`;
    document.getElementById('referralLink').textContent = referralLink;
}

// Actualización Completa de Stats
async function updateAllStats() {
    try {
        const player = await contract.players(userAddress);
        
        // Balances
        UI.weedBalance.textContent = ethers.utils.formatUnits(player.weed, 0);
        UI.bnbBalance.textContent = ethers.utils.formatEther(player.totalEarned);
        UI.productionRate.textContent = await contract.calculateProduction(userAddress);
        
        // Plantas y Mejoras
        UI.plantsOwned.innerHTML = player.plants.map((count, i) => `
            <div class="plant-item">
                <span>Tipo ${i + 1}:</span>
                <span>${count} unidades</span>
            </div>
        `).join('');
        
        UI.upgradesOwned.innerHTML = player.upgrades.map((level, i) => `
            <div class="upgrade-item">
                <span>Mejora ${i + 1}:</span>
                <span>Nivel ${level}</span>
            </div>
        `).join('');
        
        // Referidos
        await handleReferrals();
        await loadLeaderboard();
        
    } catch (error) {
        showError(error.message);
    }
}

// Helpers
function setupEventListeners() {
    // Botones
    document.getElementById('registerBtn').addEventListener('click', registerUser);
    document.getElementById('burnBtn').addEventListener('click', burnWeed);
    document.getElementById('claimBonusBtn').addEventListener('click', claimReferralBonus);
    
    // Modales
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            hideModal(e.target.closest('.modal').id);
        });
    });
}

async function claimReferralBonus() {
    try {
        showLoader();
        const tx = await contract.claimReferralBonus();
        await tx.wait();
        updateAllStats();
        showSuccess('¡Bono reclamado!');
    } catch (error) {
        showError(`Error: ${error.message}`);
    } finally {
        hideLoader();
    }
}

// Sistema de Notificaciones
function showError(message) {
    const errorDiv = document.getElementById('errorNotification');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    setTimeout(() => errorDiv.classList.remove('show'), 5000);
}

function showSuccess(message) {
    const successDiv = document.getElementById('successNotification');
    successDiv.textContent = message;
    successDiv.classList.add('show');
    setTimeout(() => successDiv.classList.remove('show'), 3000);
}

// Iniciar
window.onload = init;
