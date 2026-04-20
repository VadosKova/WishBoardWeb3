import { useEffect, useState } from "react";
import useContract from "../hooks/useContract";
import WishCard from "../components/WishCard";
import CreateWish from "../components/CreateWish";

export default function Home() {
  const { contract, account } = useContract();
  const [wishes, setWishes] = useState([]);

  const loadWishes = async () => {
    if (!contract) return;
    const data = await contract.getWishes();
    setWishes(data);
  };

  useEffect(() => {
    loadWishes();
  }, [contract]);

  return (
    <div className="container">
      <h1>WishBoard</h1>
      <p>{account}</p>

      <CreateWish contract={contract} reload={loadWishes} />

      <div className="grid">
        {wishes.map((w, i) => (
          <WishCard key={i} wish={w} id={i} contract={contract} reload={loadWishes} />
        ))}
      </div>
    </div>
  );
}