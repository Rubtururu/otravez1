const contractAddress = "0x4AD199a7c1ED96636eb0F7F33475F2f3a4461203";
const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"contributeToGamePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"depositBoxBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"depositToBox","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"distributeRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"earnGoo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"gooBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDistributionTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDepositBox","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalGamePool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

let provider, signer, contract;

document.addEventListener('DOMContentLoaded', () => {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);

    updateBalances();
    updateStats();
});

async function updateBalances() {
    const user = await contract.users(await signer.getAddress());
    document.getElementById('gooAmount').innerText = user.gooBalance.toString();

    const depositBoxTotal = await contract.totalDepositBox();
    document.getElementById('depositBoxTotal').innerText = depositBoxTotal.toString();

    const gamePoolTotal = await contract.totalGamePool();
    document.getElementById('gamePoolTotal').innerText = gamePoolTotal.toString();
}

async function updateStats() {
    const [depositBoxReward, gamePoolReward] = await contract.getDailyRewards();
    document.getElementById('dailyDepositBoxReward').innerText = depositBoxReward.toString();
    document.getElementById('dailyGamePoolReward').innerText = gamePoolReward.toString();

    const userShare = await contract.getUserShare(await signer.getAddress());
    document.getElementById('userShare').innerText = userShare.toString();

    const userRank = await contract.getUserRank(await signer.getAddress());
    document.getElementById('userRank').innerText = userRank.toString();
}

document.getElementById('investBNBButton').addEventListener('click', async () => {
    const amount = ethers.utils.parseEther("0.0001"); // Example amount
    await contract.investBNB({ value: amount });
    await updateBalances();
});

document.getElementById('depositBoxButton').addEventListener('click', async () => {
    const amount = document.getElementById('depositBoxAmount').value;
    await contract.depositToBox(amount);
    await updateBalances();
});

document.getElementById('gamePoolButton').addEventListener('click', async () => {
    const amount = document.getElementById('gamePoolAmount').value;
    await contract.contributeToGamePool(amount);
    await updateBalances();
});

document.getElementById('claimRewardsButton').addEventListener('click', async () => {
    await contract.claimRewards();
    await updateBalances();
    await updateStats();
});
