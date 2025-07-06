
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, ExternalLink } from 'lucide-react';

export const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    websiteLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
          website_link: formData.websiteLink
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
    }

    setLoading(false);
  };

  const openWebsiteLink = () => {
    if (formData.websiteLink) {
      const url = formData.websiteLink.startsWith('http') 
        ? formData.websiteLink 
        : `https://${formData.websiteLink}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800">
          {error}
        </div>
      )}
      
      <div>
        <Label htmlFor="email" className="text-white">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20"
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <Label htmlFor="username" className="text-white">Username</Label>
        <Input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20"
          placeholder="Choose a username"
          required
        />
      </div>

      <div>
        <Label htmlFor="password" className="text-white">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20 pr-12"
            placeholder="Create a password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="websiteLink" className="text-white">Website Link (Optional)</Label>
        <div className="relative">
          <Input
            id="websiteLink"
            type="url"
            value={formData.websiteLink}
            onChange={(e) => setFormData(prev => ({ ...prev, websiteLink: e.target.value }))}
            className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20 pr-12"
            placeholder="https://yourwebsite.com"
          />
          {formData.websiteLink && (
            <button
              type="button"
              onClick={openWebsiteLink}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              <ExternalLink size={16} />
            </button>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-blue-900 hover:bg-blue-50 font-medium"
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </form>
  );
};
