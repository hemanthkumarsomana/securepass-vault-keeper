
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const { error } = await signUp(email, password, username);
    
    if (error) {
      setError(error.message || 'Failed to create account');
    } else {
      setSuccess('Account created! Please check your email to confirm your account before signing in.');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
          placeholder="Choose a username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
          placeholder="Enter your email"
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
            placeholder="Create a password"
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

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
          <p className="text-green-200 text-sm">{success}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-blue-900 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
};
