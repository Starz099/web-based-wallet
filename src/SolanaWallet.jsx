import { useEffect, useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import axios from "axios";

const sol_address = process.env.SOL_ENDPOINT;

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [privateKeys, setPrivateKeys] = useState([]);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    async function fetchBalances() {
      const newBalances = [];

      for (let i = 0; i < publicKeys.length; i++) {
        try {
          const res = await axios.post(sol_address, {
            jsonrpc: "2.0",
            id: 1,
            method: "getBalance",
            params: [publicKeys[i].toString()],
          });
          newBalances.push(res.data.result.value);
        } catch (error) {
          console.error(`Error fetching balance for key ${i}:`, error);
          newBalances.push(null); // or 0
        }
      }

      setBalances(newBalances);
    }

    if (publicKeys.length > 0) {
      fetchBalances();
    }
  }, [publicKeys]);

  return (
    <div className="text-center gap-3 h-screen justify-center flex flex-col bg-fuchsia-50">
      <button
        onClick={async function () {
          const seed = await mnemonicToSeed(mnemonic);
          const path = `m/44'/501'/${currentIndex}'/0'`;
          const derivedSeed = derivePath(path, seed.toString("hex")).key;
          const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
          const keypair = Keypair.fromSecretKey(secret);
          const publicKeyEncoded = keypair.publicKey;
          const privateKeyEncoded = bs58.encode(secret);
          setCurrentIndex(currentIndex + 1);
          setPublicKeys([...publicKeys, publicKeyEncoded.toBase58()]);
          setPrivateKeys([...privateKeys, privateKeyEncoded]);
        }}
        className="bg-fuchsia-400 border-b-2 mx-auto px-3 rounded-2xl font-bold "
      >
        Add Sol wallet
      </button>
      <div className="overflow-y-auto flex-1 space-y-4 pr-2">
        {publicKeys.map((pubKey, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 border">
            <p className="font-semibold">Public Key:</p>
            <p className="text-sm break-all">{pubKey}</p>
            <p className="font-semibold mt-2">Private Key:</p>
            <p className="text-sm break-all">{privateKeys[index]}</p>
            <p>
              <span className="font-medium">Balance: </span>
              {balances[index] !== undefined
                ? `${balances[index]} lamports`
                : "Loading..."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
