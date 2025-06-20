import { createContext, useState, useEffect, useContext, ReactNode } from "react";

export interface Session {
  [key: string]: any;
}

interface SessionContextType {
  session: Session;
  updateSession: (newSession: Session) => void;
  setSession: React.Dispatch<React.SetStateAction<Session>>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session>({});

  useEffect(() => {
    // Load session from localStorage on mount
    const savedSession = localStorage.getItem("Session");
    setSession(savedSession ? JSON.parse(savedSession) : {});
  }, []);

  const updateSession = (newSession: Session) => {
    localStorage.setItem("Session", JSON.stringify(newSession));
    setSession(newSession);
  };

  return (
    <SessionContext.Provider value={{ session, updateSession, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook with error check
export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};


