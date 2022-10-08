import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./FirebaseConfig.js";
import db from "./FirebaseConfig";
import { getDoc, doc } from "firebase/firestore";
// import { async } from "@firebase/util";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [balance, setBalance] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    (async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      console.log(user.uid);
      console.log(docSnap.data());
      setUserName(docSnap.data().username);
      setBalance(docSnap.data().balance);
    })();
  }, [user]);

  /* ↓state変数「user」を上で定義 */
  /* ↓ログインしているかどうかを判定する */
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <>
      {/* ↓ユーザーのメールアドレスを表示（ログインしている場合） */}
      {userName}さんようこそ！ 残高:{balance}
      <h1>マイページ</h1>
      <p>{user && user.email}</p>
      <button>ログアウト</button>
    </>
  );
};

export default Dashboard;
