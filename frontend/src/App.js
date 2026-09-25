import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Save user
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        // Fallback if API doesn't return user
        const loggedUser = {
          email: email,
        };

        localStorage.setItem("user", JSON.stringify(loggedUser));
        setUser(loggedUser);
      }

      setLoggedIn(true);

      console.log("Login response:", data);
    } catch (error) {
      alert("Server connection failed");
      console.error(error);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setLoggedIn(false);
    setUser(null);
    setEmail("");
    setPassword("");
  };

  // Dashboard
  if (loggedIn) {
    return (
      <div className="app">
        <div className="card">
          <h1>Dashboard</h1>

          <p>Welcome to User Management 👋</p>

          {user ? (
            <>
              <p>
                <strong>Name:</strong>{" "}
                {user.name || "Parth Patel"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {user.email || email}
              </p>
            </>
          ) : (
            <p>Loading user...</p>
          )}

          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }

  // Login
  return (
    <div className="app">
      <div className="card">
        <h1>User Management</h1>

        <p>Manage your account securely</p>

        <form onSubmit={handleLogin}>
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

          <button type="submit">Login</button>
        </form>

        <p className="register-text">
          Don't have an account? <span>Register</span>
        </p>
      </div>
    </div>
  );
}

export default App;