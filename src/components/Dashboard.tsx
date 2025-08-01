
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PasswordCard } from '@/components/PasswordCard';
import { AddPasswordModal } from '@/components/AddPasswordModal';
import { ProfileModal } from '@/components/ProfileModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Search, Plus, User, LogOut, Menu } from 'lucide-react';

interface Password {
  id: string;
  website_name: string;
  website_url?: string;
  username: string;
  email?: string;
  encrypted_password: string;
  purpose?: string;
  created_at: string;
  updated_at: string;
}

export const Dashboard = () => {
  const { user, signOut, profile } = useAuth();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const fetchPasswords = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('passwords')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching passwords:', error);
    } else {
      setPasswords(data || []);
      setFilteredPasswords(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPasswords();
  }, [user]);

  useEffect(() => {
    const filtered = passwords.filter(password =>
      password.website_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (password.email && password.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (password.purpose && password.purpose.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPasswords(filtered);
  }, [searchTerm, passwords]);

  const handleDeletePassword = async (id: string) => {
    const { error } = await supabase
      .from('passwords')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting password:', error);
    } else {
      fetchPasswords();
    }
  };

  const handleUpdatePassword = async (id: string, updates: Partial<Omit<Password, 'id' | 'user_id'>>) => {
    const { error } = await supabase
      .from('passwords')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating password:', error);
    } else {
      fetchPasswords();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">SecurePass</h1>
              <p className="text-blue-200 text-sm md:text-base hidden sm:block">Welcome back, {profile?.username || user?.email}</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              onClick={() => setIsProfileModalOpen(true)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button
              onClick={signOut}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mb-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4">
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => {
                  setIsProfileModalOpen(true);
                  setShowMobileMenu(false);
                }}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 justify-start"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                onClick={signOut}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {/* Welcome message for mobile */}
        <div className="sm:hidden mb-4">
          <p className="text-blue-200 text-sm">Welcome back, {profile?.username || user?.email}</p>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20 h-10 md:h-11"
            />
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white text-blue-900 hover:bg-blue-50 h-10 md:h-11 px-4 md:px-6 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Password
          </Button>
        </div>

        {/* Passwords Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-white mt-4 text-sm md:text-base">Loading your passwords...</p>
          </div>
        ) : filteredPasswords.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl mb-4">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No passwords found</h3>
            <p className="text-blue-200 mb-6 text-sm md:text-base px-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first password'}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-white text-blue-900 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Password
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredPasswords.map((password) => (
              <PasswordCard
                key={password.id}
                password={password}
                onDelete={() => handleDeletePassword(password.id)}
                onUpdate={(updates) => handleUpdatePassword(password.id, updates)}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <AddPasswordModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onPasswordAdded={fetchPasswords}
        />

        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </div>
    </div>
  );
};
