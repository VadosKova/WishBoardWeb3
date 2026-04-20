import { useState } from "react";
import { ethers } from "ethers";

export default function CreateWish({ contract, reload }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async () => {
    if (!contract) return alert("Contract not loaded");

    if (!title.trim() || !desc.trim() || !goal.trim()) {
      return alert("Fill in all fields!");
    }

    const goalNum = parseFloat(goal);
    
    if (isNaN(goalNum) || goalNum <= 0) {
      return alert("Goal amount must be > 0");
    }

    try {
      setLoading(true);

      const goalWei = ethers.parseEther(goal);
      const duration = 3600;

      const tx = await contract.createWish(title, desc, duration, goalWei);

      console.log("Transaction sent...", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed!");

      setTitle("");
      setDesc("");
      setGoal("");
      reload();
      alert("Wish created!");
    } catch (error) {
      console.error("Error creating wish:", error);
      alert("Error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card create-card">
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
      <input type="number" step="0.01" min="0.000000000000000001" placeholder="Goal ETH" value={goal} onChange={e => setGoal(e.target.value)} />
      <button onClick={create} disabled={loading} className="btn-primary">
        {loading ? "Creating..." : "Publish"}
      </button>
    </div>
  );
}