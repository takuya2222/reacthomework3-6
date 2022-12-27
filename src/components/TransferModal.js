import { useState } from "react";

const TransferModal = (props) => {
  const {
    setIsTransferMoneyOpen,
    isTransferMoneyOpen,
    balance,
    amount,
    setAmount,
    sendMoney,
    setSendMoney,
  } = props;

  const modalContent = {
    background: "white",
    padding: "10px",
    borderRadius: "3px",
  };

  const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <>
      {isTransferMoneyOpen && (
        <div id="overlay" style={overlay}>
          <div id="modalContent" style={modalContent}>
            <p>あなたの残高:{balance}</p>
            <p>送る金額{sendMoney}</p>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button
              onClick={() => {
                setIsTransferMoneyOpen(false);
                setSendMoney(amount);
              }}
            >
              送信
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TransferModal;
