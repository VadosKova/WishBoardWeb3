import { ethers } from "ethers";

export default function WishCard({ wish, id, contract, reload }) {
  const fund = async () => {
    await contract.fundWish(id, {
      value: ethers.parseEther("0.01")
    });
    reload();
  };

  const complete = async () => {
    await contract.markCompleted(id);
    reload();
  };

  const claim = async () => {
    await contract.claimFunds(id);
  };

  const refund = async () => {
    await contract.refund(id);
  };

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