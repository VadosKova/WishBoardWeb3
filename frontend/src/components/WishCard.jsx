import { ethers } from "ethers";
import { motion } from "framer-motion";

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

  const progress = goal > 0
    ? Math.min((current / goal) * 100, 100)
    : 0;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.2)" }}
      className={`card ${isCompleted ? "completed" : ""}`}>
      <h3>{wish.title}</h3>
      <p>{wish.description}</p>

      <div className="progress-bar">
        <motion.div 
          className="progress" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }} />
      </div>

      <div className="progress-label">
        <span>{progress.toFixed(1)}%</span>
        <span>{current} / {goal} ETH</span>
      </div>

      <div className="actions" style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
        <button className="btn-primary" onClick={fund}>Support</button>
        <button className="btn-outline" onClick={claim} disabled={!isCompleted || account !== wish.creator}>Claim</button>
        <button className="btn-outline" onClick={remove}>Remove</button>
      </div>
    </motion.div>
  );
}