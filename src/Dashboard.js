import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../src/App.css";
import { auth } from "./FirebaseConfig.js";
import db from "./FirebaseConfig";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Modal from "./components/WalletModal.js";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState("");
  const [user, setUser] = useState("");
  const [otherUsers, setOtherUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [otherUser, setOtherUser] = useState(null);

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
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      setUserName(docSnap.data().username);
      setBalance(docSnap.data().balance);
    })();
    // ここuserの意味をしっかり理解する
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
                    setOtherUser(user);
                  }}
                >
                  walletを見る
                </button>
              </div>
              <div className="moneyWallet">
                <button>送る</button>
              </div>
            </div>
          </div>
        </li>
      ))}
      <button onClick={logout}>ログアウト</button>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        user={user}
        otherUser={otherUser}
        setOtherUsers={setOtherUsers}
      />
    </>
  );
};

export default Dashboard;
