const TransferModal = (props) => {
  const {
    setIsTransferMoneyOpen,
    setOtherUser,
    otherUser,
    isTransferMoneyOpen,
    user,
  } = props;

  const closeModal = () => {
    setIsTransferMoneyOpen(false);
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
      {isTransferMoneyOpen && (
        <div id="overlay" style={overlay}>
          <div id="modalContent" style={modalContent}>
            <p>あなたの残高:{otherUser.balance}</p>
            <p>送る金額</p>
            <input />
            <button onClick={closeModal}>送信</button>
          </div>
        </div>
      )}
    </>
  );
};

export default TransferModal;
