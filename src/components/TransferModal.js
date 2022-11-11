const TransferModal = (props) => {
  const {
    setIsTransferMoneyOpen,
    setOtherUser,
    otherUser,
    isTransferMoneyOpen,
    user,
    setBalance,
    balance,
  } = props;

  const transferButton = () => {
    setIsTransferMoneyOpen(false);
    setOtherUser(user);
    setBalance(docSnap.data().balance);
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

  // setBalance(docSnap.data().balance);
  console.log(setBalance(docSnap.data().balance))
  console.log("aaa")

  return (
    <>
      {isTransferMoneyOpen && (
        <div id="overlay" style={overlay}>
          <div id="modalContent" style={modalContent}>
            <p>あなたの残高:{balance}</p>
            <p>送る金額</p>
            <input />
            <button onClick={transferButton}>送信</button>
          </div>
        </div>
      )}
    </>
  );
};

export default TransferModal;
