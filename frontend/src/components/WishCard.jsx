import { ethers } from "ethers";

export default function WishCard({ wish, id, contract, reload, account }) {
  const current = Number(ethers.formatEther(wish.balance));
  const goal = Number(ethers.formatEther(wish.goal));

  const isCompleted = current >= goal;

  const fund = async () => {
    const tx = await contract.fundWish(id, {
      value: ethers.parseEther("0.01")
    });
    await tx.wait();
    reload();
  };

  const claim = async () => {
    if (!isCompleted) return;
    const tx = await contract.claimFunds(id);
    await tx.wait();
  };

  const remove = async () => {
    const tx = await contract.refundAll(id);
    await tx.wait();
    reload();
  };

  const progress = Math.min((current / goal) * 100, 100);

  return (
    <div className="card">
      <h3>{wish.title}</h3>
      <p>{wish.description}</p>

      <p>{ethers.formatEther(wish.balance)} ETH</p>

      <div className="actions">
        <button onClick={fund}>Support</button>
        <button onClick={complete}>Complete</button>
        <button onClick={claim}>Claim</button>
        <button onClick={refund}>Refund</button>
      </div>
    </div>
  );
}