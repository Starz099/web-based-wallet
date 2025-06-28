import { useState } from "react";
import { generateMnemonic } from "bip39";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { EthWallet } from "./EthWallet";
import { SolanaWallet } from "./SolanaWallet";

function App() {
  const [mnemonic, setMnemonic] = useState("");

  return (
    <BrowserRouter>
      <div className="text-center min-h-screen justify-start flex flex-col bg-fuchsia-50 p-4">
        <div className="mx-auto w-1/2 min-h-1/3 px-4 py-4 justify-evenly flex flex-col bg-fuchsia-200 rounded-2xl">
          <div className="mb-4">
            <button
              onClick={async function () {
                const mn = await generateMnemonic();
                setMnemonic(mn);
              }}
              className="bg-fuchsia-400 border-b-2 px-3 py-2 rounded-2xl font-bold cursor-pointer"
            >
              Generate mnemonic
            </button>
            <p className="mt-2 bg-fuchsia-300 rounded-2xl p-2 break-words">
              {mnemonic}
            </p>
          </div>

          <hr className="border-fuchsia-400 mb-4" />

          <div className="mx-auto">
            <p className="bg-fuchsia-300 border-2 border-t-2 px-3 py-1 rounded-2xl font-bold mb-2">
              SELECT BLOCKCHAIN
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/eth-wallet"
                className="bg-fuchsia-400 px-4 py-2 rounded-2xl font-bold"
              >
                Ethereum
              </Link>
              <Link
                to="/sol-wallet"
                className="bg-fuchsia-400 px-4 py-2 rounded-2xl font-bold"
              >
                Solana
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 mx-auto w-2/3">
          <Routes>
            <Route
              path="/eth-wallet"
              element={<EthWallet mnemonic={mnemonic} />}
            />
            <Route
              path="/sol-wallet"
              element={<SolanaWallet mnemonic={mnemonic} />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
