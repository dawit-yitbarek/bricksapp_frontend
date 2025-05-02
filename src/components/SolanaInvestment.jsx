import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useWalletError } from "./WalletErrorContext";
import checkAndRefreshToken from "./CheckRegistration";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import api from "./Api";

 const BackEndUrl = import.meta.env.VITE_BACKEND_URL;
 const Rpc_Url = import.meta.env.VITE_RPC_URL;

const connection = new Connection(Rpc_Url, "confirmed");
const receiverAddress = "A7PB8vLhPAh93QCpgZFTuHWY6tq7rQGHfByxy3CjyRWr";

const SolanaInvestment = () => {
  const [status, setStatus] = useState("");
  const [errorId, setErrorId] = useState(null);
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const { connected, publicKey, sendTransaction, disconnect } = useWallet();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const { error } = useWalletError();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); 
        const response = await api.get(`${BackEndUrl}/investment-tasks` , {headers: {Authorization: `Bearer ${accessToken}`,},});
        if (response.data.success) {
          setCompletedTasks(response.data.completedTasks || []);
          setIncompleteTasks(response.data.incompleteTasks || []);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [refreshFlag]);

  const handleInvest = async (taskId, amount, reward) => {
    try {
      setErrorId(taskId);
      setLoadingTaskId(taskId);
      setStatus("Sending transaction...");

      if (!publicKey || !sendTransaction) {
        setStatus("Wallet not connected.");
        return;
      }

      const fromPubkey = publicKey;
      const toPubkey = new PublicKey(receiverAddress);
      const lamports = amount * 1e9;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        })
      );

      transaction.feePayer = fromPubkey;

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");

      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;

      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed"
      );

      await checkAndRefreshToken()
      const token = localStorage.getItem("accessToken");
       const response = await api.post(`${BackEndUrl}/verify-transaction`, {
        signature,
        amount,
        fromPubkey: fromPubkey.toBase58(),
        taskId,
        reward
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

      setStatus(response.data.message);
    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction failed.");
    } finally {
      setRefreshFlag((prev) => prev + 1);
      setLoadingTaskId(null);
    }
  };


  const renderTaskCard = (task, isCompleted) => {


    return (
      <div
        key={task.id}
        className={`rounded-xl p-5 mb-4 shadow-md border ${isCompleted ? "bg-gray-800 border-gray-700" : "bg-gray-850 border-purple-700"
          }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold text-white">{task.title}</h3>
          {!isCompleted && (
            <span className="text-sm text-purple-300 font-medium">
              <strong>🎁 {task.reward_point} Points</strong>
            </span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-md text-gray-300">
            {!isCompleted ? `Amount Required: ${task.amount_required} SOL` :
             `Reward Point: ${task.reward_point} SOL` }
          </span>

          {/* Button + Error Message + Tooltip */}
          <div className="relative flex flex-col items-center w-fit">
            <button
              onClick={() => handleInvest(task.id, task.amount_required, task.reward_point)}
              disabled={
                !connected || !publicKey || loadingTaskId === task.id || isCompleted
              }
              className={`${isCompleted
                ? "bg-gray-600 cursor-not-allowed"
                : !connected || !publicKey
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                } px-4 py-2 rounded-lg text-white font-semibold transition`}
            >
              {loadingTaskId === task.id
                ? "Processing..."
                : isCompleted
                  ? "Completed"
                  : "Invest"}
            </button>

            {/* Transaction result message */}
            {task.id === errorId && !isCompleted && (<p>{status}</p>)}

            {/* Tooltip for disconnected wallet — stays absolute */}
            {!connected && !isCompleted &&
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 text-xs text-white bg-black bg-opacity-80 rounded shadow-lg z-10 whitespace-nowrap">
                Connect wallet to invest
              </div>

            }
          </div>
        </div>
      </div>
    );

  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {!connected || !publicKey ? (
        <div className="mb-6">
          <WalletMultiButton />

          {error ? (
            <p className="text-sm text-red-500  px-2 py-2 rounded-md mt-2">
              {error}
            </p>
          ) : (
            <p className="text-sm text-gray-400 mt-2">
              Connect your wallet to enable investing
            </p>
          )}
        </div>
      )
        : (
          <div className="mb-6">
            <p className="text-md text-gray-300 mb-1">✅ Wallet Connected</p>

            <div className="flex items-center gap-2">
              <p className="text-lg font-mono text-purple-400">
                <abbr title={publicKey?.toBase58()} className="cursor-pointer no-underline">
                  {publicKey?.toBase58().slice(0, 4)}...
                  {publicKey?.toBase58().slice(-4)}
                </abbr>
              </p>

              <button onClick={disconnect}
                className="text-red-400 hover:text-red-600"
                title="Disconnect Wallet"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}




      <div className="max-w-2xl mx-auto">

        {/* incomplete Tasks */}
        {incompleteTasks.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mb-4">🕒 Incomplete Tasks</h2>
            {incompleteTasks.map((task) => renderTaskCard(task, false))}
          </>
        )}


        {/* completed Tasks */}
        {completedTasks.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mt-10 mb-4">✅ Completed Investment Tasks</h2>
            {completedTasks.map((task) => renderTaskCard(task, true))}
          </>
        )}

      </div>
    </div >
  );
};

export default SolanaInvestment;
