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
import Modal from "./components/WalletModal.js";
import TransferModal from "./components/TransferModal.js";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState("");
  const [user, setUser] = useState("");
  const [otherUsers, setOtherUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTransferMoneyOpen, setIsTransferMoneyOpen] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [sendMoney, setSendMoney] = useState("");

  // 下のユーザー一覧を表示
  useEffect(() => {
    const others = collection(db, "users");
    // const others = doc(db, "users");
    getDocs(others).then((QuerySnapshot) => {
      setOtherUsers(QuerySnapshot.docs.map((doc) => doc.data()));
    });
  }, []);

  // 上の名前と残高を表記
  useEffect(() => {
    (async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      setUserName(docSnap.data().username);
      setBalance(docSnap.data().balance);
    })();
    // ここuserの意味をしっかり理解する
  }, [user]);

  // firestoreデータ更新;
  // useEffect(() => {
  //   // 自動生成ドキュメントIDを持つドキュメントへの参照を取得
  //   const newCityRef = doc(collection(db, "cities"));
  //   console.log(newCityRef);

  //   const data = {
  //     username: "Los Angeles",
  //     state: "CA",
  //     country: "USA",
  //   };
  //   setDoc(newCityRef, data);
  //   updateDoc(newCityRef, {
  //     username: "Tokyo", // USAからTokyoに更新
  //   });
  //   console.log(newCityRef);
  // }, []);

  // 投げ銭機能の実装
  useEffect(() => {
    (async () => {
      const docMyRef = doc(db, "users", user.uid);
      const docMySnap = await getDoc(docMyRef);
      // 相手のfirestore情報更新
      // const docOtherRef = doc(db, "users", "押したボタンと連動させる");
      // const docOtherSnap = await getDoc(docOtherRef);
      updateDoc(
        docMySnap,
        {
          balance: 800,
          // balance: docMySnap.data().balance + { amount },
          // balance: docOtherSnap.data().balance - { amount },
        },
        []
      );
    })();
  }, [user]);

  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

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
                    // OtherUsersに格納されたデータにおいてマップ関数の中の仮引数userには0から順番に全ての値が入る.
                    // setOtherUsersで
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
                    changeBalance();
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
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} otherUser={otherUser} />
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
