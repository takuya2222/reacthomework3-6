import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./FirebaseConfig.js";
import db from "./FirebaseConfig";
import {
  getDoc,
  doc,
  collection,
  getDocs,
  QuerySnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Modal from "./components/WalletModal.js";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState("");
  const [user, setUser] = useState("");
  const [otherUsers, setOtherUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const others = collection(db, "users");
    getDocs(others).then((QuerySnapshot) => {
      console.log(QuerySnapshot.docs.map((doc) => doc.data()));
      setOtherUsers(QuerySnapshot.docs.map((doc) => doc.data()));
    });
  }, []);

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

  const ShowModal = () => {
    setShowModal(true);
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
        <li>
          {user.username}
          <button onClick={ShowModal}>walletを見る</button>
          <button>送る</button>
          <button>{user.balance}</button>
        </li>
      ))}
      <button onClick={logout}>ログアウト</button>
      <Modal showFlag={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default Dashboard;
