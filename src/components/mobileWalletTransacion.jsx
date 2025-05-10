import React, { useState } from 'react';
import { PublicKey, Keypair } from '@solana/web3.js';
import checkAndRefreshToken from './CheckRegistration';
import api from './Api';

const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

const recipient = "A7PB8vLhPAh93QCpgZFTuHWY6tq7rQGHfByxy3CjyRWr";
const memo = "Stake your solana.";
const label = "Stake your solana token to get more reward.";

const SolanaInvestmentMobile = (props) => {
  const [status, setStatus] = useState('');
  const [errorId, setErrorId] = useState(null);
  const [reference, setReference] = useState('');
  const [buttonState, setButtonState] = useState({}); // { taskId: 'stake' | 'confirm' | 'processing' }

  const handleInvest = () => {
    const reference = Keypair.generate().publicKey;
    const referenceStr = reference.toBase58();
    setReference(referenceStr);

    setButtonState(prev => ({
      ...prev,
      [props.taskId]: 'confirm'
    }));

    const url = `solana:${recipient}?amount=${props.amount}&label=${label}&memo=${memo}&reference=${referenceStr}`;
    window.open(url, '_blank');
  };

  const VerifyTransaction = async () => {
    try {
      setStatus("verifying Transaction...");
      setErrorId(props.taskId);
      setButtonState(prev => ({
        ...prev,
        [props.taskId]: 'processing'
      }));

      await checkAndRefreshToken();
      const token = localStorage.getItem("accessToken");

      const response = await api.post(
        `${BackEndUrl}/verify-transaction`,
        {
          reference,
          amount: props.amount,
          fromPubkey: new PublicKey(props.publicKey),
          taskId: props.taskId,
          reward: props.reward,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatus(response.data.message);
    } catch (error) {
      console.log("Error verifying transaction:", error);
      setStatus( error.response?.data?.message || "❌ Transaction Failed");
    } finally {
      setButtonState(prev => ({
        ...prev,
        [props.taskId]: 'stake'
      }));
    }
  };

  const currentState = buttonState[props.taskId] || 'stake';
  const isDisabled = currentState === 'processing' || !props.connected || !props.publicKey;

  return (
    <>
      <button
        disabled={isDisabled}
        onClick={
          currentState === 'confirm'
            ? VerifyTransaction
            : handleInvest
        }
        className={`w-full sm:w-auto text-center ${isDisabled
          ? "bg-gray-700 cursor-not-allowed"
          : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          } px-4 py-2 rounded-lg text-white font-semibold transition`}
      >
        {currentState === 'stake' && 'Stake'}
        {currentState === 'confirm' && 'Confirm'}
        {currentState === 'processing' && 'Processing...'}
      </button>

      {props.taskId === errorId && (
        <p className={`mt-1 text-xs ${status.includes("❌") ? "text-red-400" : "text-white"}`}>
          {status}
        </p>
      )}
    </>
  );
};

export default SolanaInvestmentMobile;
