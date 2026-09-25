import { useState } from "react";
import "./App.css";

function App() {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const body = isRegister
        ? { name, email, password }
        : { email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      // Register successful
      if (isRegister) {
        alert("Registration successful! Please login.");

        setIsRegister(false);
        setName("");
        setEmail("");
        setPassword("");

        return;
      }

      // Login successful
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setLoggedIn(true);
    } catch (error) {
      alert("Server connection failed");
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setLoggedIn(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  // Dashboard
  if (loggedIn) {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
      <div className="app">
        <div className="card">
          <h1>Dashboard</h1>

          <p>Welcome to User Management 👋</p>

          <p>
            <strong>Name:</strong> {user?.name}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }

  // Register / Login
  return (
    <div className="app">
      <div className="card">
        <h1>User Management</h1>

        <p>
          {isRegister
            ? "Create your account"
            : "Manage your account securely"}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="register-text">
          {isRegister
            ? "Already have an account? "
            : "Don't have an account? "}

          <span
            onClick={() => {
              setIsRegister(!isRegister);
              setName("");
              setEmail("");
              setPassword("");
            }}
            style={{
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;