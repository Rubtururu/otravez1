const web3 = new Web3(window.ethereum);
let contract;
let userAccount;

const stakingPoolAddress = '0x8892e0Dfbc2A28D11201D80C90B8d102Ca270e04'; // Reemplaza con la dirección de tu contrato
const stakingPoolABI = [{"inputs":[{"internalType":"address","name":"_priceFeed","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"increase","type":"uint256"}],"name":"BoosterActivated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"bonus","type":"uint256"}],"name":"ClanBonusClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"newLevel","type":"uint256"}],"name":"LevelUp","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newTime","type":"uint256"}],"name":"LockTimeChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"prize","type":"uint256"}],"name":"LotteryWon","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"MysteryBoxOpened","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":false,"internalType":"address","name":"referred","type":"address"}],"name":"NewReferral","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RewardsClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"SpinWon","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"TicketPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"WithdrawalFeeChanged","type":"event"},{"inputs":[],"name":"baseRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"calculateRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"calculateReward","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimClanBonus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"lastRewardTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lockTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lotteryPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"openMysteryBox","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"participants","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referrals","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rewardPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"spinWheel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tickets","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRewardsDistributed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"upgradeLevel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"deposit","type":"uint256"},{"internalType":"uint256","name":"rewards","type":"uint256"},{"internalType":"uint256","name":"lastClaim","type":"uint256"},{"internalType":"uint256","name":"level","type":"uint256"},{"internalType":"uint256","name":"missionsCompleted","type":"uint256"},{"internalType":"uint256","name":"freeTickets","type":"uint256"},{"internalType":"uint256","name":"mysteryBoxes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawalFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

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
  const userDeposit = await contract.methods.getUserDeposit(userAccount).call();
  const totalRewards = await contract.methods.getTotalRewards(userAccount).call();
  const userLevel = await contract.methods.getUserLevel(userAccount).call();
  const poolBalance = await contract.methods.poolBalance().call();

  document.getElementById('userDeposit').textContent = `${web3.utils.fromWei(userDeposit)} BNB`;
  document.getElementById('totalRewards').textContent = `${web3.utils.fromWei(totalRewards)} BNB`;
  document.getElementById('userLevel').textContent = userLevel;
  document.getElementById('poolBalance').textContent = `${web3.utils.fromWei(poolBalance)} BNB`;
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

