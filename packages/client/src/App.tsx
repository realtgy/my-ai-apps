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
  return <div>{message}</div>;
}

export default App;
