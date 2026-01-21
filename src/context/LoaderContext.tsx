"use client";

import { createContext, useContext, useState, useEffect } from "react";

type LoaderContextType = {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

const LoaderContext = createContext<LoaderContextType>({
  isLoading: true,
  setIsLoading: () => {},
});

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we've already visited in this session
    const hasSeen = sessionStorage.getItem("hasSeenPreloader");
    if (hasSeen) {
      setIsLoading(false);
    }
  }, []);

  const handleSetLoading = (val: boolean) => {
    setIsLoading(val);
    if (!val) {
      sessionStorage.setItem("hasSeenPreloader", "true");
    }
  };

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading: handleSetLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);