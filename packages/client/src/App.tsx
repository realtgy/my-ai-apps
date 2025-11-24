import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  const [message, setMessage] = useState("!!");
  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      });
  }, []);
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>{message}</Button>
    </div>
  );
}

export default App;
