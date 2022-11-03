const Modal = (props) => {
  const { setShowModal, setOtherUser, otherUser, showFlag, user } = props;

  const closeModal = () => {
    setShowModal(false);
    setOtherUser(user);
  };

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
            <p>{otherUser.username}さんの残高:</p>
            <p>{otherUser.balance}</p>
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
