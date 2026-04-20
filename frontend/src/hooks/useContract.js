import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "../WishBoard.json";

const CONTRACT_ADDRESS = "0x4F7fd4F6A3F0B662F6944f7Af1469AbBf262dfFc";

export default function useContract() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [contractBalance, setContractBalance] = useState("0");

  const updateBalance = async (currentContract) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(CONTRACT_ADDRESS);
      setContractBalance(ethers.formatEther(balance));
    } catch (err) {
      console.error("Error fetching contract balance:", err);
    }
  };

  useEffect(() => {
    connect();
  }, []);

  let connecting = false;

  const connect = async () => {
    if (connecting) return;
    connecting = true;

    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI.abi, signer);

    setContract(contract);
    setAccount(await signer.getAddress());
    updateBalance();

    connecting = false;
  };

  console.log("ABI:", ABI);

  return { contract, account, contractBalance, updateBalance };
}