import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../src/App.css";
import { auth } from "./FirebaseConfig.js";
import db from "./FirebaseConfig";
import {
  getDoc,
  doc,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import WalletModal from "./components/WalletModal.js";
import TransferModal from "./components/TransferModal.js";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState("");
  const [authUser, setAuthUser] = useState("");
  const [otherUser, setOtherUser] = useState("");
  const [otherUsers, setOtherUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransferMoneyOpen, setIsTransferMoneyOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [sendMoney, setSendMoney] = useState("");

  /* ↓state変数「user」を上で定義 */
  /* ↓ログインしているかどうかを判定する */
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setAuthUser(currentUser);
      }
    });
  }, [authUser]);

  // 下のユーザー一覧を表示
  useEffect(() => {
    const others = collection(db, "users");
    getDocs(others).then((QuerySnapshot) => {
      setOtherUsers(
        QuerySnapshot.docs.map((doc) => ({ documentId: doc.id, ...doc.data() }))
      );
    });
  }, []);

  // 上の名前と残高を表記
  useEffect(() => {
    (async () => {
      if (authUser) {
        const docRef = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(docRef);
        setUserName(docSnap.data().username);
        setBalance(docSnap.data().balance);
      }
    })();
  }, [authUser]);

  useEffect(() => {
    (async () => {
      if (authUser) {
        const docMyRef = doc(db, "users", authUser.uid);
        const docMySnap = await getDoc(docMyRef);
        const balance = docMySnap.data().balance - sendMoney;
        updateDoc(
          docMyRef,
          {
            balance: balance,
          },
          []
        );
        // ここのsetBalanceの意味をよく理解する
        setBalance(balance);
      }
    })();
  }, [sendMoney]);

  useEffect(() => {
    (async () => {
      if (otherUser) {
        const docUserRef = doc(db, "users", otherUser.documentId);
        const docUserSnap = await getDoc(docUserRef);
        updateDoc(
          docUserRef,
          {
            balance: Number(docUserSnap.data().balance) + Number(sendMoney),
          },
          []
        );
      }
    })();
  }, [sendMoney]);

  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <>
      {/* ↓ユーザーのメールアドレスを表示（ログインしている場合） */}
      {userName}さんようこそ！ 残高:{balance}
      <h1>マイページ</h1>
      <p>{authUser && authUser.email}</p>
      <h1>ユーザ一覧</h1>
      <p>ユーザ名</p>
      {otherUsers.map((user) => (
        <li key={user} className="moneyList">
          <div className="moneyOption">
            <div>{user.username}</div>
            <div className="moneyButton">
              <div className="moneyWallet">
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setOtherUser(user);
                  }}
                >
                  walletを見る
                </button>
              </div>
              <div className="moneyWallet">
                <button
                  onClick={() => {
                    setIsTransferMoneyOpen(true);
                    setOtherUser(user);
                  }}
                >
                  送る
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
      <button onClick={logout}>ログアウト</button>
      <WalletModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        otherUser={otherUser}
      />
      <TransferModal
        isTransferMoneyOpen={isTransferMoneyOpen}
        setIsTransferMoneyOpen={setIsTransferMoneyOpen}
        balance={balance}
        amount={amount}
        setAmount={setAmount}
        sendMoney={sendMoney}
        setSendMoney={setSendMoney}
        setBalance={setBalance}
        authUser={authUser}
      />
    </>
  );
};

export default Dashboard;
