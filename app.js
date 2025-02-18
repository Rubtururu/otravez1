// Inicializar Web3 y conectarse a la BSC
let web3;
let stakingPoolContract;
let userAddress;
let userAccount;

// ABI y Dirección del contrato StakingPool
const contractABI = [{"inputs":[{"internalType":"address","name":"_priceFeed","type":"address"}],"stateMutability":"nonpayable","type":"constructor"}, ...];
const contractAddress = '0x8892e0Dfbc2A28D11201D80C90B8d102Ca270e04'; // Dirección del contrato desplegado

window.addEventListener('load', async () => {
    // Conectar con MetaMask
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);

        try {
            // Solicitar acceso a MetaMask
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Verificar que estamos en la red correcta (BSC)
            const chainId = await web3.eth.getChainId();
            if (chainId !== 56) {
                alert('Por favor, conecta a la red Binance Smart Chain (BSC).');
                return;
            }

            stakingPoolContract = new web3.eth.Contract(contractABI, contractAddress);
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];  // Obtener la primera cuenta
            updateUI();
        } catch (error) {
            alert('Error al conectar MetaMask: ' + error.message);
        }
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
