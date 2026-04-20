import { useState } from "react";

export default function CreateWish({ contract, reload }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const create = async () => {
    if (!contract) return alert("Contract not loaded");

    const tx = await contract.createWish(title, desc, 3600);
    await tx.wait();
    setTitle("");
    setDesc("");
    reload();
  };

  return (
    <div className="card">
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
      <button onClick={create}>Create</button>
    </div>
  );
}