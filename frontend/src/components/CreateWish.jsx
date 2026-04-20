import { useState } from "react";
import { ethers } from "ethers";

export default function CreateWish({ contract, reload }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [goal, setGoal] = useState("");

  const create = async () => {
    if (!contract) return alert("Contract not loaded");

    const goalWei = ethers.parseEther(goal);

    const tx = await contract.createWish(title, desc, 3600);
    await tx.wait();

    setTitle("");
    setDesc("");
    setGoal("");
    reload();
  };

  return (
    <div className="card">
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
      <input placeholder="Goal ETH" value={goal} onChange={e => setGoal(e.target.value)} />
      <button onClick={create}>Create</button>
    </div>
  );
}