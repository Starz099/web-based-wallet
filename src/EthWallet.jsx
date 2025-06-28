import { useEffect, useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import axios from "axios";

const eth_address = process.env.ETH_ENDPOINT;

export const EthWallet = ({mnemonic}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);
    const [privateKeys, setPrivateKeys] = useState([]);
    const [balances, setBalances] = useState([]);

    useEffect(() => {
      async function fetchBalances() {
        const newBalances = [];

        for (let i = 0; i < publicKeys.length; i++) {
          try {
            const res = await axios.post(eth_address, {
              jsonrpc: "2.0",
              id: 1,
              method: "eth_getBalance",
              params: [publicKeys[i].toString(), "latest"],
            });
            newBalances.push(parseInt(res.data.result));
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
      <div className="p-4 text-center gap-3 h-screen justify-center flex flex-col bg-fuchsia-50">
        <button
          onClick={async function () {
            const seed = await mnemonicToSeed(mnemonic);
            const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
            const hdNode = HDNodeWallet.fromSeed(seed);
            const child = hdNode.derivePath(derivationPath);
            const privateKey = child.privateKey;
            const wallet = new Wallet(privateKey);
            const publicKeyEncoded = wallet.address;
            const privateKeyEncoded = Buffer.from(seed).toString("hex");
            setCurrentIndex(currentIndex + 1);
            setPublicKeys([...publicKeys, publicKeyEncoded]);
            setPrivateKeys([...privateKeys, privateKeyEncoded]);
          }}
          className="bg-fuchsia-400 border-b-2 mx-auto px-3 rounded-2xl font-bold sticky top-0 "
        >
          Add ETH wallet
        </button>
        <div className="overflow-y-auto flex-1 space-y-4 pr-2">
          {publicKeys.map((pubKey, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 border"
            >
              <p className="font-semibold">Public Key:</p>
              <p className="text-sm break-all">{pubKey}</p>
              <p className="font-semibold mt-2">Private Key:</p>
              <p className="text-sm break-all">{privateKeys[index]}</p>
              <p>
                <span className="font-medium">Balance: </span>
                {balances[index] !== undefined
                  ? `${balances[index]} wei`
                  : "Loading..."}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
}