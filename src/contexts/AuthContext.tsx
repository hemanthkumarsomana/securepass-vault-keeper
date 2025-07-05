
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (email?: string, phoneNumber?: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('securepass_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Get stored users
      const users = JSON.parse(localStorage.getItem('securepass_users') || '[]');
      const foundUser = users.find((u: any) => u.username === username && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('securepass_user', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (username: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('securepass_users') || '[]');
      
      // Check if username already exists
      if (users.find((u: any) => u.username === username)) {
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        password,
        email: '',
        phoneNumber: ''
      };

      users.push(newUser);
      localStorage.setItem('securepass_users', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('securepass_user', JSON.stringify(userWithoutPassword));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('securepass_user');
  };

  const updateProfile = async (email?: string, phoneNumber?: string): Promise<boolean> => {
    try {
      if (!user) return false;

      const users = JSON.parse(localStorage.getItem('securepass_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], email: email || '', phoneNumber: phoneNumber || '' };
        localStorage.setItem('securepass_users', JSON.stringify(users));

        const updatedUser = { ...user, email: email || '', phoneNumber: phoneNumber || '' };
        setUser(updatedUser);
        localStorage.setItem('securepass_user', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!user) return false;

      const users = JSON.parse(localStorage.getItem('securepass_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex !== -1 && users[userIndex].password === currentPassword) {
        users[userIndex].password = newPassword;
        localStorage.setItem('securepass_users', JSON.stringify(users));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
