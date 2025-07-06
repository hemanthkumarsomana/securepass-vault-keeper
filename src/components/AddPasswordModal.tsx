
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordAdded: () => void;
}

export const AddPasswordModal = ({ isOpen, onClose, onPasswordAdded }: AddPasswordModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    website_name: '',
    website_url: '',
    username: '',
    email: '',
    encrypted_password: '',
    purpose: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        website_name: '',
        website_url: '',
        username: '',
        email: '',
        encrypted_password: '',
        purpose: ''
      });
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    const { error } = await supabase
      .from('passwords')
      .insert([{
        ...formData,
        user_id: user.id
      }]);

    if (error) {
      console.error('Error adding password:', error);
    } else {
      onPasswordAdded();
      onClose();
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="website_name">Website Name *</Label>
            <Input
              id="website_name"
              value={formData.website_name}
              onChange={(e) => setFormData(prev => ({ ...prev, website_name: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="encrypted_password">Password *</Label>
            <div className="relative">
              <Input
                id="encrypted_password"
                type={showPassword ? 'text' : 'password'}
                value={formData.encrypted_password}
                onChange={(e) => setFormData(prev => ({ ...prev, encrypted_password: e.target.value }))}
                className="pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="purpose">Purpose/Notes</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              placeholder="Personal, Work, etc."
              className="min-h-[80px]"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Password'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
