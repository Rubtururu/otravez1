const web3 = new Web3(window.ethereum);
let contract;
let userAccount;

const stakingPoolAddress = '0x8892e0Dfbc2A28D11201D80C90B8d102Ca270e04'; // Dirección de tu contrato
const stakingPoolABI = [
  // ABI del contrato (reemplaza con el correcto)
  {
    "inputs":[{"internalType":"address","name":"_priceFeed","type":"address"}],
    "stateMutability":"nonpayable",
    "type":"constructor"
  },
  {
    "inputs":[],"name":"baseRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[],"name":"calculateRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"user","type":"address"}],
    "name":"calculateReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[],"name":"claimClanBonus","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"
  },
  {
    "inputs":[],"name":"lotteryPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"
  },
  {
    "inputs":[],"name":"totalDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"
  },
  {
    "inputs":[],"name":"totalRewardsDistributed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[
      {"internalType":"uint256","name":"deposit","type":"uint256"},
      {"internalType":"uint256","name":"rewards","type":"uint256"},
      {"internalType":"uint256","name":"lastClaim","type":"uint256"},
      {"internalType":"uint256","name":"level","type":"uint256"},
      {"internalType":"uint256","name":"missionsCompleted","type":"uint256"},
      {"internalType":"uint256","name":"freeTickets","type":"uint256"},
      {"internalType":"uint256","name":"mysteryBoxes","type":"uint256"}
    ],
    "stateMutability":"view","type":"function"
  },
  {
    "inputs":[],"name":"withdrawalFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"
  }
];

document.getElementById('connectWallet').addEventListener('click', connectWallet);
document.getElementById('depositBtn').addEventListener('click', deposit);
document.getElementById('claimRewards').addEventListener('click', claimRewards);
document.getElementById('upgradeLevel').addEventListener('click', upgradeLevel);
document.getElementById('buyLotteryTicket').addEventListener('click', buyLotteryTicket);
document.getElementById('withdraw').addEventListener('click', withdraw);
document.getElementById('compoundRewards').addEventListener('click', compoundRewards);

async function connectWallet() {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAccount = (await web3.eth.getAccounts())[0];
    contract = new web3.eth.Contract(stakingPoolABI, stakingPoolAddress);
    loadUserData();
  } else {
    alert('Por favor, instala MetaMask!');
  }
}

async function loadUserData() {
  const user = await contract.methods.users(userAccount).call();
  const baseRate = await contract.methods.baseRate().call();
  const calculateRate = await contract.methods.calculateRate().call();
  const totalDeposited = await contract.methods.totalDeposited().call();
  const totalRewardsDistributed = await contract.methods.totalRewardsDistributed().call();
  const withdrawalFee = await contract.methods.withdrawalFee().call();
  const lotteryPool = await contract.methods.lotteryPool().call();

  document.getElementById('userDeposit').textContent = `${web3.utils.fromWei(user.deposit)} BNB`;
  document.getElementById('userRewards').textContent = `${web3.utils.fromWei(user.rewards)} BNB`;
  document.getElementById('userLevel').textContent = user.level;
  document.getElementById('missionsCompleted').textContent = user.missionsCompleted;
  document.getElementById('freeTickets').textContent = user.freeTickets;
  document.getElementById('mysteryBoxes').textContent = user.mysteryBoxes;
  document.getElementById('baseRate').textContent = baseRate;
  document.getElementById('calculateRate').textContent = calculateRate;
  document.getElementById('totalDeposited').textContent = `${web3.utils.fromWei(totalDeposited)} BNB`;
  document.getElementById('totalRewardsDistributed').textContent = `${web3.utils.fromWei(totalRewardsDistributed)} BNB`;
  document.getElementById('withdrawalFee').textContent = `${web3.utils.fromWei(withdrawalFee)} BNB`;
  document.getElementById('lotteryPool').textContent = `${web3.utils.fromWei(lotteryPool)} BNB`;
}

async function deposit() {
  const amount = document.getElementById('depositAmount').value;
  const referrer = document.getElementById('referrer').value;
  
  if (amount > 0) {
    await contract.methods.deposit(referrer).send({
      from: userAccount,
      value: web3.utils.toWei(amount, 'ether')
    });
    loadUserData();
  }
}

async function claimRewards() {
  await contract.methods.claimRewards().send({ from: userAccount });
  loadUserData();
}

async function upgradeLevel() {
  await contract.methods.upgradeLevel().send({ from: userAccount });
  loadUserData();
}

async function buyLotteryTicket() {
  await contract.methods.buyLotteryTicket().send({ from: userAccount });
  loadUserData();
}

async function withdraw() {
  const amount = document.getElementById('withdrawAmount').value;
  
  if (amount > 0) {
    await contract.methods.withdraw(web3.utils.toWei(amount, 'ether')).send({ from: userAccount });
    loadUserData();
  }
}

async function compoundRewards() {
  await contract.methods.claimRewards().send({ from: userAccount });
  loadUserData();
}
