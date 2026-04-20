import { useEffect, useState } from "react";
import useContract from "../hooks/useContract";
import WishCard from "../components/WishCard";
import CreateWish from "../components/CreateWish";

export default function Home() {
  const { contract, account, contractBalance, updateBalance } = useContract();
  const [wishes, setWishes] = useState([]);

  const loadWishes = async () => {
    if (!contract) return;

    const data = await contract.getWishes();

    const formatted = data.map(w => ({
      creator: w.creator,
      title: w.title,
      description: w.description,
      deadline: Number(w.deadline),
      balance: w.balance,
      goal: w.goal,
      completed: w.completed,
      claimed: w.claimed
    }));

    console.log("FORMATTED:", formatted);

    setWishes(formatted);
    updateBalance();
  };

  useEffect(() => {
    loadWishes();
  }, [contract]);

  return (
    <div className="container">
      <h1>WishBoard</h1>
      <p>Metamask address: {account}</p>
      <div className="balance-card">
        <span>Contract Balance:</span>
        <strong> {contractBalance} ETH</strong>
      </div>

      <CreateWish contract={contract} reload={loadWishes} />

      <div className="grid">
        {wishes.map((w, i) => (
          <WishCard key={i} wish={w} id={i} contract={contract} reload={loadWishes} account={account} />
        ))}
      </div>
    </div>
  );
}