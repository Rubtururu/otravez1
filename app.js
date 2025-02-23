// Configuración inicial
let contract;
let userAddress;
let provider;
let signer;

const CONTRACT_ADDRESS = '0xF26B81A0c34aC6b126074Ba5f79C5D5418FFeBCD';
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"enum AdvancedWeedFarm.PlantType","name":"plantType","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PlantPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"referrer","type":"address"}],"name":"ReferralRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"enum AdvancedWeedFarm.UpgradeType","name":"upgradeType","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"level","type":"uint256"}],"name":"UpgradePurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bnbReceived","type":"uint256"}],"name":"WeedBurned","type":"event"},{"inputs":[],"name":"BURN_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DAILY_POOL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REFERRAL_BONUS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPlayers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnWeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"enum AdvancedWeedFarm.PlantType","name":"plantType","type":"uint8"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyPlant","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"enum AdvancedWeedFarm.UpgradeType","name":"upgradeType","type":"uint8"}],"name":"buyUpgrade","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"baseCost","type":"uint256"},{"internalType":"uint256","name":"baseProduction","type":"uint256"},{"internalType":"uint256","name":"growthFactor","type":"uint256"}],"internalType":"struct AdvancedWeedFarm.PlantConfig","name":"config","type":"tuple"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"calculatePlantCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"calculateProduction","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"cost","type":"uint256"},{"internalType":"uint256","name":"effect","type":"uint256"},{"internalType":"uint256","name":"maxLevel","type":"uint256"}],"internalType":"struct AdvancedWeedFarm.UpgradeConfig","name":"config","type":"tuple"},{"internalType":"uint256","name":"currentLevel","type":"uint256"}],"name":"calculateUpgradeCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"claimReferralBonus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"harvestWeed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"plantConfigs","outputs":[{"internalType":"uint256","name":"baseCost","type":"uint256"},{"internalType":"uint256","name":"baseProduction","type":"uint256"},{"internalType":"uint256","name":"growthFactor","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"players","outputs":[{"internalType":"uint256","name":"weed","type":"uint256"},{"internalType":"uint256","name":"lastHarvest","type":"uint256"},{"internalType":"uint256","name":"totalBurned","type":"uint256"},{"internalType":"uint256","name":"totalEarned","type":"uint256"},{"internalType":"string","name":"username","type":"string"},{"internalType":"address","name":"referrer","type":"address"},{"internalType":"uint256","name":"referrals","type":"uint256"},{"internalType":"uint256","name":"bonus","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"referrer","type":"address"}],"name":"register","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalBNB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalWeed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"upgradeConfigs","outputs":[{"internalType":"uint256","name":"cost","type":"uint256"},{"internalType":"uint256","name":"effect","type":"uint256"},{"internalType":"uint256","name":"maxLevel","type":"uint256"}],"stateMutability":"view","type":"function"}];

// Elementos UI
const elements = {
    connectBtn: document.getElementById('connectBtn'),
    weedBalance: document.getElementById('weedBalance'),
    bnbBalance: document.getElementById('bnbBalance'),
    productionRate: document.getElementById('productionRate'),
    plantsOwned: document.getElementById('plantsOwned'),
    upgradesOwned: document.getElementById('upgradesOwned'),
    leaderboard: document.getElementById('leaderboard'),
    shopPlants: document.getElementById('shopPlants'),
    shopUpgrades: document.getElementById('shopUpgrades'),
    burnAmountInput: document.getElementById('burnAmount'),
    referralBonus: document.getElementById('referralBonus')
};

// Inicialización
async function init() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    
    window.ethereum.on('accountsChanged', async () => {
        window.location.reload();
    });

    await connectWallet();
    loadShopItems();
    startAutoHarvest();
}

// Conexión a la wallet
async function connectWallet() {
    try {
        await provider.send("eth_requestAccounts", []);
        userAddress = await signer.getAddress();
        elements.connectBtn.textContent = userAddress.slice(0,6) + '...' + userAddress.slice(-4);
        
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        await updateAllStats();
    } catch (error) {
        console.error("Error connecting wallet:", error);
    }
}

// Actualizar todas las estadísticas
async function updateAllStats() {
    await updatePlayerStats();
    await updateContractStats();
    await updateShopPrices();
    await loadLeaderboard();
}

// Actualizar estadísticas del jugador
async function updatePlayerStats() {
    const player = await contract.players(userAddress);
    
    elements.weedBalance.textContent = ethers.utils.formatUnits(player.weed, 0);
    elements.bnbBalance.textContent = ethers.utils.formatEther(player.totalEarned);
    elements.productionRate.textContent = await calculateProduction();
    elements.referralBonus.textContent = ethers.utils.formatEther(player.bonus);
    
    // Actualizar plantas y mejoras
    elements.plantsOwned.innerHTML = player.plants.map((count, index) => `
        <div class="plant-item">
            <span>Planta ${index + 1}:</span>
            <span>${count}</span>
        </div>
    `).join('');
    
    elements.upgradesOwned.innerHTML = player.upgrades.map((level, index) => `
        <div class="upgrade-item">
            <span>Mejora ${index + 1}:</span>
            <span>Nivel ${level}</span>
        </div>
    `).join('');
}

// Funciones principales del contrato
async function register(username, referrer = ethers.constants.AddressZero) {
    try {
        const tx = await contract.register(username, referrer);
        await tx.wait();
        await updateAllStats();
    } catch (error) {
        console.error("Registration failed:", error);
    }
}

async function buyPlant(plantType, amount) {
    try {
        const cost = await contract.calculatePlantCost(plantType, amount);
        const tx = await contract.buyPlant(plantType, amount, { value: cost });
        await tx.wait();
        await updateAllStats();
    } catch (error) {
        console.error("Plant purchase failed:", error);
    }
}

async function buyUpgrade(upgradeType) {
    try {
        const cost = await contract.calculateUpgradeCost(upgradeType);
        const tx = await contract.buyUpgrade(upgradeType, { value: cost });
        await tx.wait();
        await updateAllStats();
    } catch (error) {
        console.error("Upgrade purchase failed:", error);
    }
}

async function harvestWeed() {
    try {
        const tx = await contract.harvestWeed();
        await tx.wait();
        await updatePlayerStats();
    } catch (error) {
        console.error("Harvest failed:", error);
    }
}

async function burnWeed() {
    try {
        const amount = elements.burnAmountInput.value;
        const tx = await contract.burnWeed(amount);
        await tx.wait();
        await updateAllStats();
    } catch (error) {
        console.error("Burn failed:", error);
    }
}

// Funciones de cálculo
async function calculateProduction() {
    return await contract.calculateProduction(userAddress);
}

async function calculatePlantCost(plantType, amount) {
    return await contract.calculatePlantCost(plantType, amount);
}

// Estadísticas del contrato
async function updateContractStats() {
    const totalWeed = await contract.totalWeed();
    const totalBNB = await contract.totalBNB();
    
    document.getElementById('totalWeed').textContent = ethers.utils.formatUnits(totalWeed, 0);
    document.getElementById('totalBNB').textContent = ethers.utils.formatEther(totalBNB);
}

// Leaderboard
async function loadLeaderboard() {
    const [addresses, weed] = await contract.getTopPlayers();
    
    elements.leaderboard.innerHTML = addresses.map((address, index) => `
        <div class="leaderboard-item">
            <span>${index + 1}. ${address.slice(0,6)}...${address.slice(-4)}</span>
            <span>${ethers.utils.formatUnits(weed[index], 0)} WEED</span>
        </div>
    `).join('');
}

// Cargar tienda
async function loadShopItems() {
    const plantCount = await contract.plantConfigsLength();
    const upgradeCount = await contract.upgradeConfigsLength();
    
    // Plantas
    elements.shopPlants.innerHTML = await Promise.all(
        Array.from({length: plantCount}, async (_, i) => {
            const config = await contract.plantConfigs(i);
            return `
                <div class="shop-item">
                    <h3>Planta Tipo ${i + 1}</h3>
                    <p>Producción: ${config.baseProduction}/s</p>
                    <p>Costo: ${ethers.utils.formatEther(config.baseCost)} BNB</p>
                    <button onclick="buyPlant(${i}, 1)">Comprar 1</button>
                    <button onclick="buyPlant(${i}, 5)">Comprar 5</button>
                </div>
            `;
        })
    ).then(items => items.join(''));
    
    // Mejoras
    elements.shopUpgrades.innerHTML = await Promise.all(
        Array.from({length: upgradeCount}, async (_, i) => {
            const config = await contract.upgradeConfigs(i);
            return `
                <div class="shop-item">
                    <h3>Mejora Tipo ${i + 1}</h3>
                    <p>Efecto: +${config.effect}%</p>
                    <p>Costo: ${ethers.utils.formatEther(config.cost)} BNB</p>
                    <button onclick="buyUpgrade(${i})">Comprar</button>
                </div>
            `;
        })
    ).then(items => items.join(''));
}

// Auto-cosecha cada segundo
function startAutoHarvest() {
    setInterval(async () => {
        if (userAddress) {
            await harvestWeed();
        }
    }, 1000);
}

// Iniciar la aplicación
window.onload = init;

// Event Listeners (ejemplo básico)
document.getElementById('registerBtn').addEventListener('click', () => {
    const username = prompt('Ingresa tu nombre de granjero:');
    if (username) register(username);
});

document.getElementById('burnBtn').addEventListener('click', burnWeed);
document.getElementById('claimBonusBtn').addEventListener('click', claimReferralBonus);
