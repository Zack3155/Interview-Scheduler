import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // Change to a new mode
  const transition = (newMode, replace = false) => {
    if (replace && history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
    setHistory(prev => ([...prev, newMode]));
    setMode(newMode);
  };

  // Back to the old mode
  const back = () => {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory(prev => prev.slice(0, -1));
    }
  };
  console.log(history);
  return { mode, transition, back };
};