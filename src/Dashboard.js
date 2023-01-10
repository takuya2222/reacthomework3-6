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
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import WalletModal from "./components/WalletModal.js";
import TransferModal from "./components/TransferModal.js";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState("");
  const [user, setUser] = useState("");
  const [otherUsers, setOtherUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransferMoneyOpen, setIsTransferMoneyOpen] = useState(false);
  const [otherUser, setOtherUser] = useState("");
  const [amount, setAmount] = useState("");
  const [sendMoney, setSendMoney] = useState("");

  /* ↓state変数「user」を上で定義 */
  /* ↓ログインしているかどうかを判定する */
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });
  }, [user]);

  // 下のユーザー一覧を表示
  useEffect(() => {
    const others = collection(db, "users");
    getDocs(others).then((QuerySnapshot) => {
      setOtherUsers(QuerySnapshot.docs.map((doc) => doc.data()));
    });
  }, []);

  // 上の名前と残高を表記
  useEffect(() => {
    (async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        setUserName(docSnap.data().username);
        setBalance(docSnap.data().balance);
      }
    })();
    // ここuserの意味をしっかり理解する
  }, [user]);

  useEffect(() => {
    (async () => {
      if (user) {
        const docMyRef = doc(db, "users", user.uid);
        const docMySnap = await getDoc(docMyRef);
        console.log(user.uid);

        updateDoc(
          docMyRef,
          {
            balance: docMySnap.data().balance - sendMoney,
            // balance: docOtherSnap.data().balance + sendMoney,
          },
          []
        );
      }
    })();
  }, [user, sendMoney]);

  useEffect(() => {
    (async () => {
      if (otherUser) {
        const docUserRef = doc(db, "users", otherUser.uid);
        const docUserSnap = await getDoc(docUserRef);
        updateDoc(
          docUserRef,
          {
            balance: docUserSnap.data().balance + sendMoney,
          },
          []
        );
      }
    })();
  }, [sendMoney, otherUser]);

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
      <p>{user && user.email}</p>
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
                    console.log(user);
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
      />
    </>
  );
};

export default Dashboard;
