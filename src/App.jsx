import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function App() {
  const [config, setConfig] = useState({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  });
  const [token, setToken] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load configuration from localStorage if it exists
    const savedConfig = localStorage.getItem("firebaseConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveConfigToLocalStorage = () => {
    localStorage.setItem("firebaseConfig", JSON.stringify(config));
  };

  const initializeFirebase = () => {
    if (!getApps().length) {
      initializeApp(config);
      setIsInitialized(true);
    }
  };

  const signIn = async () => {
    // Add your own sign-in logic here
    // e.g. `const result = await firebase.auth().signInWithEmailAndPassword(email, password);`
    // For this example, I'm just retrieving the token after a mock sign-in:
    const auth = getAuth();
    await signInWithPopup(auth, new GoogleAuthProvider());
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      setToken(token);
    }
  };

  return (
    <div className="App">
      <h1>Firebase Auth UI</h1>
      {isInitialized ? (
        <>
          <button onClick={signIn}>Sign In</button>
          {token && (
            <div>
              <h2>JWT Token:</h2>
              <textarea readOnly value={token} rows={10} cols={50} />
              <button onClick={() => navigator.clipboard.writeText(token)}>
                Copy Token
              </button>
            </div>
          )}
        </>
      ) : (
        <div>
          <h2>Enter Firebase Configuration:</h2>
          {Object.keys(config).map((key) => (
            <div key={key}>
              <label>{key}: </label>
              <input
                name={key}
                value={config[key]}
                onChange={handleConfigChange}
              />
            </div>
          ))}
          <button onClick={saveConfigToLocalStorage}>Save Config</button>
          <button onClick={initializeFirebase}>Initialize Firebase</button>
        </div>
      )}
    </div>
  );
}

export default App;
