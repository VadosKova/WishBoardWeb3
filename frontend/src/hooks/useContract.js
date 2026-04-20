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

    connecting = false;
  };

  console.log("ABI:", ABI);

  return { contract, account };
}