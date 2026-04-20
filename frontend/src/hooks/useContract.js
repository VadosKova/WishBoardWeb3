import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "../WishBoard.json";

const CONTRACT_ADDRESS = "0x7334b5086377DD68946343ad6eb539330D6822aB";

export default function useContract() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  useEffect(() => {
    connect();
  }, []);

  const connect = async () => {
    if (!window.ethereum) return alert("Install MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    setContract(contract);
    setAccount(await signer.getAddress());
  };

  return { contract, account };
}