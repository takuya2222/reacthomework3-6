import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../FirebaseConfig";

const TransferModal = (props) => {
  const {
    setIsTransferMoneyOpen,
    isTransferMoneyOpen,
    balance,
    amount,
    setAmount,
    sendMoney,
    setBalance,
    setSendMoney,
    authUser,
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

  const [renewedBalance,setRenewedBalance] = useState("")

  useEffect(() => {
    (async () => {
      if (authUser) {
        const docRef = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(docRef);
      }
    })();
  }, [authUser]);

  return (
    <>
      {isTransferMoneyOpen && (
        <div id="overlay" style={overlay}>
          <div id="modalContent" style={modalContent}>
            <p>あなたの残高:{balance}</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              onClick={(e) => {
                setIsTransferMoneyOpen(false);
                setSendMoney(amount);
                setAmount("");
                setBalance(docSnap.data().balance);
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
