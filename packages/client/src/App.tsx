import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("!!");
  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      });
  }, []);
  return <div className="font-bold self-center text-3xl p-20">{message}</div>;
}

export default App;
