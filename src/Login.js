import React, { useState } from "react";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  return (
    <>
      <h1>ログインページ</h1>
      <form>
        <div>
          <label>メールアドレス</label>
          <input
            name="email"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
        </div>
        <div>
          <label>パスワード</label>
          <input
            name="password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </div>
        <button>ログイン</button>
      </form>
    </>
  );
};

export default Login;
