import { collection, getDocs, QuerySnapshot } from "firebase/firestore";
import React, { useEffect } from "react";
import db from "../FirebaseConfig";

const Modal = (props) => {
  const { setShowModal, content, setOtherUsers, showFlag } = props;

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const others = collection(db, "users");
    getDocs(others).then((QuerySnapshot) => {
      setOtherUsers(QuerySnapshot.docs.map((doc) => doc.data()));
      console.log(QuerySnapshot.docs.map((doc) => doc.data().balance));
    });
  }, []);

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
      {showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div id="overlay" style={overlay}>
          <div id="modalContent" style={modalContent}>
            <p>{}さんの残高:</p>
            <p>{content}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      ) : (
        <></> // showFlagがfalseの場合はModalは表示しない
      )}
    </>
  );
};

export default Modal;
