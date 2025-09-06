import React from "react";
import "./App.css";

function App() {
  return (
    <div className="container">
      {/* Top bar */}
      <div className="top-bar">
        <div className="newchat">
          <button>
            <img src="newchatnew.png" alt="New Chat" />
          </button>
        </div>
        <div className="appname">
          <button>Generic App Name</button>
        </div>
        <div className="auth-buttons">
          <div className="login">
            <button>Log In</button>
          </div>
          <div className="signup">
            <button>Sign Up</button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <h1>What can I help with?</h1>

      {/* Input box */}
      <div className="input-box">
        <input type="text" placeholder="Ask anything" />
        <div className="input-actions">
          <button className="attach">+ Attach</button>
          <button className="search">🌐 Search</button>
          <button className="reason">💡 Reason</button>
          <button className="voice">🎤 Voice</button>
        </div>
      </div>

      {/* Quick action buttons */}
      <div className="buttons">
        <button>🎓 Get advice</button>
        <button>💡 Brainstorm</button>
        <button>📄 Summarize text</button>
        <button>👁️ Analyze images</button>
        <button>More</button>
      </div>

      {/* Footer */}
      <div className="footer">
        By messaging <b>Generic App Name</b>, you agree to our{" "}
        <u>Terms</u> and have read our <u>Privacy Policy</u>.
      </div>
    </div>
  );
}

export default App;
