// Inicializar Web3 y conectarse a la BSC
let web3;
let stakingPoolContract;
let userAddress;
let userAccount;

// ABI y Dirección del contrato StakingPool
const contractABI = [{"inputs":[{"internalType":"address","name":"_priceFeed","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"increase","type":"uint256"}],"name":"BoosterActivated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"bonus","type":"uint256"}],"name":"ClanBonusClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"newLevel","type":"uint256"}],"name":"LevelUp","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newTime","type":"uint256"}],"name":"LockTimeChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"prize","type":"uint256"}],"name":"LotteryWon","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"MysteryBoxOpened","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":false,"internalType":"address","name":"referred","type":"address"}],"name":"NewReferral","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RewardsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"SpinWon","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"TicketPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"WithdrawalFeeChanged","type":"event"},{"inputs":[],"name":"baseRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"calculateRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"calculateReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimClanBonus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"lastRewardTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lockTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lotteryPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"openMysteryBox","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"participants","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referrals","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rewardPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"spinWheel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tickets","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRewardsDistributed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"upgradeLevel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"deposit","type":"uint256"},{"internalType":"uint256","name":"rewards","type":"uint256"},{"internalType":"uint256","name":"lastClaim","type":"uint256"},{"internalType":"uint256","name":"level","type":"uint256"},{"internalType":"uint256","name":"missionsCompleted","type":"uint256"},{"internalType":"uint256","name":"freeTickets","type":"uint256"},{"internalType":"uint256","name":"mysteryBoxes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawalFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
const contractAddress = '0x8892e0Dfbc2A28D11201D80C90B8d102Ca270e04'; // Dirección del contrato desplegado

window.addEventListener('load', async () => {
    // Conectar con MetaMask
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        stakingPoolContract = new web3.eth.Contract(contractABI, contractAddress);
        userAccount = web3.eth.accounts[0];
        updateUI();
    } else {
        alert('Por favor, instala MetaMask para continuar.');
    }
});

// Función para actualizar las estadísticas en la interfaz
async function updateUI() {
    // Actualizar estadísticas generales
    const totalDeposited = await stakingPoolContract.methods.totalDeposited().call();
    const totalRewards = await stakingPoolContract.methods.totalRewardsDistributed().call();
    const poolBalance = await stakingPoolContract.methods.rewardPool().call();
    const activeUsers = await stakingPoolContract.methods.participants().call();
    const teamBonus = await stakingPoolContract.methods.claimClanBonus().call();
    const user = await stakingPoolContract.methods.users(userAccount).call();

    document.getElementById('totalDeposited').textContent = web3.utils.fromWei(totalDeposited, 'ether') + ' BNB';
    document.getElementById('totalRewards').textContent = web3.utils.fromWei(totalRewards, 'ether') + ' BNB';
    document.getElementById('poolBalance').textContent = web3.utils.fromWei(poolBalance, 'ether') + ' BNB';
    document.getElementById('activeUsers').textContent = activeUsers.length;
    document.getElementById('teamBonus').textContent = web3.utils.fromWei(teamBonus, 'ether') + ' BNB';

    // Actualizar datos de usuario
    document.getElementById('userDeposit').textContent = web3.utils.fromWei(user.deposit, 'ether') + ' BNB';
    document.getElementById('userLevel').textContent = user.level;
    document.getElementById('availableRewards').textContent = web3.utils.fromWei(await stakingPoolContract.methods.calculateReward(userAccount).call(), 'ether') + ' BNB';
    document.getElementById('lotteryTickets').textContent = user.freeTickets;
    document.getElementById('lastWinner').textContent = 'N/A'; // Aquí puedes agregar lógica para obtener el último ganador
    document.getElementById('userReferrals').textContent = await getUserReferrals(userAccount);
    document.getElementById('referralBonus').textContent = web3.utils.fromWei(await getReferralBonus(userAccount), 'ether') + ' BNB';

    // Actualizar el ranking de jugadores
    const leaderboard = await getLeaderboard();
    const leaderboardList = document.getElementById('playerLeaderboard');
    leaderboardList.innerHTML = '';
    leaderboard.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name}: ${web3.utils.fromWei(player.deposit, 'ether')} BNB`;
        leaderboardList.appendChild(li);
    });
}

// Función para obtener los referidos de un usuario
async function getUserReferrals(address) {
    const referrals = await stakingPoolContract.methods.referrals(address).call();
    return referrals ? referrals.length : 0;
}

// Función para obtener el bono de referidos
async function getReferralBonus(address) {
    const user = await stakingPoolContract.methods.users(address).call();
    return user.rewards; // Este valor puede ser ajustado según la lógica de referidos
}

// Función para obtener el ranking de jugadores
async function getLeaderboard() {
    // Esta función es un ejemplo; necesitarás implementar la lógica de clasificación según tus necesidades
    return [
        { name: 'Jugador 1', deposit: '100000000000000000000' }, // 100 BNB
        { name: 'Jugador 2', deposit: '50000000000000000000' },  // 50 BNB
        { name: 'Jugador 3', deposit: '30000000000000000000' },  // 30 BNB
    ];
}

// Función para depositar fondos en el staking pool
document.getElementById('depositBtn').addEventListener('click', async () => {
    const amount = document.getElementById('depositAmount').value;
    const referrer = document.getElementById('referrer').value || userAccount;
    const amountInWei = web3.utils.toWei(amount, 'ether');

    if (amount && !isNaN(amount)) {
        try {
            await stakingPoolContract.methods.deposit(referrer).send({
                from: userAccount,
                value: amountInWei
            });
            alert('Depósito exitoso!');
            updateUI();
        } catch (error) {
            alert('Error al depositar fondos: ' + error.message);
        }
    } else {
        alert('Por favor ingresa una cantidad válida.');
    }
});

// Función para reclamar recompensas
document.getElementById('claimRewards').addEventListener('click', async () => {
    try {
        await stakingPoolContract.methods.claimRewards().send({ from: userAccount });
        alert('Recompensas reclamadas con éxito!');
        updateUI();
    } catch (error) {
        alert('Error al reclamar recompensas: ' + error.message);
    }
});

// Función para mejorar el nivel del usuario
document.getElementById('upgradeLevel').addEventListener('click', async () => {
    try {
        await stakingPoolContract.methods.upgradeLevel().send({ from: userAccount });
        alert('Nivel mejorado con éxito!');
        updateUI();
    } catch (error) {
        alert('Error al mejorar el nivel: ' + error.message);
    }
});

// Función para abrir la mystery box
document.getElementById('openMysteryBox').addEventListener('click', async () => {
    try {
        await stakingPoolContract.methods.openMysteryBox().send({ from: userAccount });
        alert('Mystery Box abierta con éxito!');
        updateUI();
    } catch (error) {
        alert('Error al abrir la Mystery Box: ' + error.message);
    }
});

// Función para girar la ruleta
document.getElementById('spinWheel').addEventListener('click', async () => {
    try {
        await stakingPoolContract.methods.spinWheel().send({ from: userAccount });
        alert('Ruleta girada con éxito!');
        updateUI();
    } catch (error) {
        alert('Error al girar la ruleta: ' + error.message);
    }
});

// Función para reclamar el bono de clan
document.getElementById('claimClanBonus').addEventListener('click', async () => {
    try {
        await stakingPoolContract.methods.claimClanBonus().send({ from: userAccount });
        alert('Bono de clan reclamado con éxito!');
        updateUI();
    } catch (error) {
        alert('Error al reclamar el bono de clan: ' + error.message);
    }
});

// Función para comprar boleto de lotería
document.getElementById('buyLotteryTicket').addEventListener('click', async () => {
    try {
        await stakingPoolContract.methods.buyLotteryTicket().send({ from: userAccount });
        alert('Boleto de lotería comprado con éxito!');
        updateUI();
    } catch (error) {
        alert('Error al comprar boleto: ' + error.message);
    }
});
