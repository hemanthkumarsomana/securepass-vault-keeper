
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AddPasswordModal } from '@/components/AddPasswordModal';
import { PasswordCard } from '@/components/PasswordCard';
import { ProfileModal } from '@/components/ProfileModal';
import { Plus } from 'lucide-react';

export interface Password {
  id: string;
  websiteName: string;
  websiteLink?: string;
  username: string;
  email?: string;
  password: string;
  purpose?: string;
  userId: string;
}

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (user) {
      const storedPasswords = JSON.parse(localStorage.getItem('securepass_passwords') || '[]');
      const userPasswords = storedPasswords.filter((p: Password) => p.userId === user.id);
      setPasswords(userPasswords);
    }
  }, [user]);

  const addPassword = (passwordData: Omit<Password, 'id' | 'userId'>) => {
    const newPassword: Password = {
      ...passwordData,
      id: Date.now().toString(),
      userId: user!.id
    };

    const allPasswords = JSON.parse(localStorage.getItem('securepass_passwords') || '[]');
    allPasswords.push(newPassword);
    localStorage.setItem('securepass_passwords', JSON.stringify(allPasswords));

    setPasswords(prev => [...prev, newPassword]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SecurePass</h1>
              <p className="text-sm text-blue-200">Welcome, {user?.username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Password</span>
            </button>

            <div className="relative group">
              <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="py-2">
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {passwords.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-white/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No passwords saved yet</h3>
            <p className="text-blue-200 mb-6">Start by adding your first password to keep it secure</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-blue-900 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-all inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Password</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {passwords.map((password) => (
              <PasswordCard key={password.id} password={password} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddPasswordModal
          onClose={() => setShowAddModal(false)}
          onSave={addPassword}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};
