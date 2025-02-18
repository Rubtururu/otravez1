// Configuración de Web3
let web3;
let contract;
let userAddress;

const contractAddress = "0x3C39311a15d4521ccCd65afcfacD49B10AD9B9F5"; // Reemplaza con la dirección de tu contrato
const abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DividendClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"LotteryWinner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ReferralEarned","type":"event"},{"inputs":[],"name":"LOTTERY_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REFERRAL_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REWARD_RATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimDividends","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"referrer","type":"address"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"drawLottery","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getStats","outputs":[{"internalType":"uint256","name":"totalBNBDeposited","type":"uint256"},{"internalType":"uint256","name":"totalBNBPaid","type":"uint256"},{"internalType":"uint256","name":"currentPoolBalance","type":"uint256"},{"internalType":"uint256","name":"totalUniqueUsers","type":"uint256"},{"internalType":"uint256","name":"dailyRewardAmount","type":"uint256"},{"internalType":"uint256","name":"myTotalEarned","type":"uint256"},{"internalType":"uint256","name":"myReferralEarnings","type":"uint256"},{"internalType":"uint256","name":"myReferralCount","type":"uint256"},{"internalType":"uint256","name":"lotteryPoolAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastPayoutTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lotteryPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"participants","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDividendsPaid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalUsers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"depositedAmount","type":"uint256"},{"internalType":"uint256","name":"lastClaimTime","type":"uint256"},{"internalType":"uint256","name":"totalEarned","type":"uint256"},{"internalType":"uint256","name":"referralEarnings","type":"uint256"},{"internalType":"address","name":"referrer","type":"address"},{"internalType":"uint256","name":"referralCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

// Elementos del DOM
const totalDeposited = document.getElementById("totalDeposited");
const totalDividendsPaid = document.getElementById("totalDividendsPaid");
const totalUsers = document.getElementById("totalUsers");
const currentPoolBalance = document.getElementById("currentPoolBalance");
const lotteryPool = document.getElementById("lotteryPool");
const lastLotteryWinner = document.getElementById("lastLotteryWinner");
const lastLotteryPrize = document.getElementById("lastLotteryPrize");

const myDepositedAmount = document.getElementById("myDepositedAmount");
const myTotalEarned = document.getElementById("myTotalEarned");
const myReferralEarnings = document.getElementById("myReferralEarnings");
const myReferralCount = document.getElementById("myReferralCount");
const nextClaimTime = document.getElementById("nextClaimTime");

const depositAmount = document.getElementById("depositAmount");
const referrerAddress = document.getElementById("referrerAddress");
const depositButton = document.getElementById("depositButton");
const claimButton = document.getElementById("claimButton");
const withdrawAmount = document.getElementById("withdrawAmount");
const withdrawButton = document.getElementById("withdrawButton");
const drawLotteryButton = document.getElementById("drawLotteryButton");

// Inicializar Web3 y contrato
async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            userAddress = (await web3.eth.getAccounts())[0];
            contract = new web3.eth.Contract(abi, contractAddress);
            loadStats();
        } catch (error) {
            console.error("Error al conectar con MetaMask:", error);
        }
    } else {
        console.error("MetaMask no está instalado.");
    }
}

// Cargar estadísticas
async function loadStats() {
    const stats = await contract.methods.getStats().call({ from: userAddress });
    totalDeposited.textContent = `${web3.utils.fromWei(stats[0], 'ether')} BNB`;
    totalDividendsPaid.textContent = `${web3.utils.fromWei(stats[1], 'ether')} BNB`;
    totalUsers.textContent = stats[3];
    currentPoolBalance.textContent = `${web3.utils.fromWei(stats[2], 'ether')} BNB`;
    lotteryPool.textContent = `${web3.utils.fromWei(stats[8], 'ether')} BNB`;
    myDepositedAmount.textContent = `${web3.utils.fromWei(stats[5], 'ether')} BNB`;
    myTotalEarned.textContent = `${web3.utils.fromWei(stats[6], 'ether')} BNB`;
    myReferralEarnings.textContent = `${web3.utils.fromWei(stats[7], 'ether')} BNB`;
    myReferralCount.textContent = stats[8];
}

// Eventos
depositButton.addEventListener("click", async () => {
    const amount = web3.utils.toWei(depositAmount.value, 'ether');
    const referrer = referrerAddress.value || "0x0000000000000000000000000000000000000000";
    await contract.methods.deposit(referrer).send({ from: userAddress, value: amount });
    loadStats();
});

claimButton.addEventListener("click", async () => {
    await contract.methods.claimDividends().send({ from: userAddress });
    loadStats();
});

withdrawButton.addEventListener("click", async () => {
    const amount = web3.utils.toWei(withdrawAmount.value, 'ether');
    await contract.methods.withdraw(amount).send({ from: userAddress });
    loadStats();
});

drawLotteryButton.addEventListener("click", async () => {
    await contract.methods.drawLottery().send({ from: userAddress });
    loadStats();
});

// Inicialización
init();
