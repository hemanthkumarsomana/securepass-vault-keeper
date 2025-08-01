
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/backend/integrations/supabase/client';
import { Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const { signIn, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    // Check if input is email format or username
    const isEmail = emailOrUsername.includes('@');
    
    if (isEmail) {
      // Direct login with email
      const { error } = await signIn(emailOrUsername, password);
      
      if (error) {
        setError(error.message || 'Invalid email or password');
      }
    } else {
      // Username login - first get email from profiles table
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', emailOrUsername)
          .single();

        if (profileError || !profile) {
          setError('Username not found');
          setLoading(false);
          return;
        }

        // Get user email from auth.users via the profile id
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.id);
        
        if (userError || !userData.user?.email) {
          setError('Unable to find account');
          setLoading(false);
          return;
        }

        // Now sign in with the found email
        const { error } = await signIn(userData.user.email, password);
        
        if (error) {
          setError(error.message || 'Invalid username or password');
        }
      } catch (err) {
        setError('Login failed. Please try again.');
      }
    }
    
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setResetMessage('');

    const { error } = await resetPassword(resetEmail);
    
    if (error) {
      setError(error.message || 'Failed to send reset email');
    } else {
      setResetMessage('Check your email for password reset instructions');
    }
    
    setLoading(false);
  };

  if (showForgotPassword) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Reset Password</h3>
          <p className="text-blue-200 text-sm">Enter your email to receive reset instructions</p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {resetMessage && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
              <p className="text-green-200 text-sm">{resetMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-blue-900 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>

          <button
            type="button"
            onClick={() => setShowForgotPassword(false)}
            className="w-full text-white/80 py-2 text-sm hover:text-white transition-colors"
          >
            Back to Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Email or Username
        </label>
        <input
          type="text"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
          placeholder="Enter your email or username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-blue-900 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <button
        type="button"
        onClick={() => setShowForgotPassword(true)}
        className="w-full text-white/80 py-2 text-sm hover:text-white transition-colors"
      >
        Forgot your password?
      </button>
    </form>
  );
};
