import { ethers } from "ethers";

export default function WishCard({ wish, id, contract, reload, account }) {
  const current = wish.balance
    ? Number(ethers.formatEther(wish.balance))
    : 0;

  const goal = wish.goal
    ? Number(ethers.formatEther(wish.goal))
    : 0;

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
    <div className={`card ${isCompleted ? "completed" : ""}`}>
      <h3>{wish.title}</h3>
      <p>{wish.description}</p>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>

      <p>{current} / {goal} ETH</p>

      <div className="actions">
        <button onClick={fund}>Support</button>
        <button onClick={claim} disabled={!isCompleted || account !== wish.creator}>Claim</button>
        <button onClick={remove}>Remove</button>
      </div>
    </div>
  );
}