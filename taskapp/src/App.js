import React, { useState } from "react";
import bgImage from './image.png';
import logo from './logo.png';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  
  // Separate states for sign-up and sign-in
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(""); 
    setMessage("");

    // Validate if passwords match
    if (signUpPassword !== signUpConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("https://51njw409ek.execute-api.us-east-1.amazonaws.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signUpEmail, password: signUpPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setError("An error occurred during signup. Please try again.");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(""); 
    setMessage("");
    
    try {
      const response = await fetch("https://51njw409ek.execute-api.us-east-1.amazonaws.com/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="flex h-screen justify-center">
      <div className="w-5/12 text-white flex flex-col justify-between p-10">
        <div
          className="bg-cover bg-center rounded-2xl overflow-hidden w-full h-full max-w-lg flex flex-col"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="text-center mt-14">
            <h1 className="text-4xl font-semibold">Welcome to Task Flow</h1>
            <p className="text-lg mt-2">Your Gateway to Effortless Management.</p>
          </div>
          <div className="text-center mb-10 mt-72">
            <h2 className="text-4xl font-semibold">Seamless Collaboration</h2>
            <p className="text-lg mt-2">
              Effortlessly work together with your
              <br />
              team in real-time.
            </p>
          </div>
        </div>
      </div>

      <div className="w-7/12 flex items-center justify-center p-8 -ml-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-start mb-6">
            <img src={logo} alt="Task Flow Logo" className="w-8 h-8 mr-2" />
            <h2 className="text-2xl font-semibold">Task Flow</h2>
          </div>

          <div className="flex mb-6">
            <button
              onClick={() => setIsSignUp(true)}
              className={`w-1/2 py-2 rounded-lg ${isSignUp ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-500'}`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsSignUp(false)}
              className={`w-1/2 py-2 rounded-lg ${!isSignUp ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-500'}`}
            >
              Sign In
            </button>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-500 text-center">{message}</p>}

          {isSignUp ? (
            <form className="space-y-4" onSubmit={handleSignUp}>
              <div>
                <h1>Email id</h1>
                <input
                  type="email"
                  placeholder="Enter Email Id"
                  className="w-full p-3 border rounded-md border-teal-400"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <h1>Password</h1>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full p-3 border rounded-md border-teal-400"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <h1>Confirm Password</h1>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-3 border rounded-md border-teal-400"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-teal-500 text-white py-3 rounded-md mt-4">Register</button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSignIn}>
              <div>
                <h1>Email id</h1>
                <input
                  type="email"
                  placeholder="Enter Email Id"
                  className="w-full p-3 border rounded-md border-teal-400"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <h1>Password</h1>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full p-3 border rounded-md border-teal-400"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-teal-500 text-white py-3 rounded-md mt-4">Sign In</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
