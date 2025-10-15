"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type MouseContextType = { x: number; y: number };
const MouseContext = createContext<MouseContextType>({ x: 0, y: 0 });

export const MouseProvider = ({ children }: { children: ReactNode }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <MouseContext.Provider value={mousePos}>{children}</MouseContext.Provider>
  );
};

export const useMouse = () => useContext(MouseContext);
