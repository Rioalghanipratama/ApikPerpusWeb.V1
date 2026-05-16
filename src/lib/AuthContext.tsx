import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'guest' | 'member' | 'admin';

export interface User {
  role: Role;
  name: string;
  memberId?: string; // If member
}

interface AuthContextType {
  currentUser: User;
  switchUser: (role: Role) => void;
  updateProfile: (name: string) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isRegInfoModalOpen: boolean;
  setIsRegInfoModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const users: Record<Role, User> = {
  admin: { role: 'admin', name: 'Aris Setiawan (Admin)' },
  member: { role: 'member', name: 'Budi Santoso (Mahasiswa)', memberId: '1' },
  guest: { role: 'guest', name: 'Pengunjung Bebas' }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(users.guest);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegInfoModalOpen, setIsRegInfoModalOpen] = useState(false);

  const switchUser = (role: Role) => {
    setCurrentUser(users[role]);
    setIsLoginModalOpen(false);
  };

  const updateProfile = (name: string) => {
    setCurrentUser(prev => ({ ...prev, name }));
  };

  const logout = () => {
    setCurrentUser(users.guest);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      switchUser,
      updateProfile,
      logout,
      isLoginModalOpen,
      setIsLoginModalOpen,
      isRegInfoModalOpen,
      setIsRegInfoModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
