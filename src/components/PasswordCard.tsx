
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, EyeOff, Copy, Edit, Trash2, ExternalLink } from 'lucide-react';

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

interface PasswordCardProps {
  password: Password;
  onDelete: () => void;
  onUpdate: (updates: Partial<Omit<Password, 'id' | 'user_id'>>) => void;
}

export const PasswordCard = ({ password, onDelete, onUpdate }: PasswordCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    website_name: password.website_name,
    website_url: password.website_url || '',
    username: password.username,
    email: password.email || '',
    encrypted_password: password.encrypted_password,
    purpose: password.purpose || ''
  });

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log(`${type} copied to clipboard`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleUpdate = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  const getWebsiteIcon = () => {
    if (password.website_url) {
      try {
        const domain = new URL(password.website_url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
      } catch {
        return null;
      }
    }
    return null;
  };

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getWebsiteIcon() && (
                <img 
                  src={getWebsiteIcon()!} 
                  alt={`${password.website_name} icon`}
                  className="w-6 h-6"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
              <span className="text-white truncate">{password.website_name}</span>
            </div>
            <div className="flex items-center space-x-1">
              {password.website_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(password.website_url, '_blank')}
                  className="text-white/60 hover:text-white hover:bg-white/10 p-1"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-1"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-blue-200 text-sm">Username:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm font-mono">{password.username}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(password.username, 'Username')}
                className="text-white/60 hover:text-white hover:bg-white/10 p-1"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {password.email && (
            <div className="flex items-center justify-between">
              <span className="text-blue-200 text-sm">Email:</span>
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm font-mono truncate max-w-[120px]">{password.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(password.email!, 'Email')}
                  className="text-white/60 hover:text-white hover:bg-white/10 p-1"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-blue-200 text-sm">Password:</span>
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm font-mono">
                {showPassword ? password.encrypted_password : '••••••••'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-1"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(password.encrypted_password, 'Password')}
                className="text-white/60 hover:text-white hover:bg-white/10 p-1"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {password.purpose && (
            <div className="pt-2 border-t border-white/10">
              <span className="text-blue-200 text-xs">Purpose: </span>
              <span className="text-white/80 text-xs">{password.purpose}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-website_name">Website Name</Label>
              <Input
                id="edit-website_name"
                value={editForm.website_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, website_name: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-website_url">Website URL</Label>
              <Input
                id="edit-website_url"
                type="url"
                value={editForm.website_url}
                onChange={(e) => setEditForm(prev => ({ ...prev, website_url: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={editForm.username}
                onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-encrypted_password">Password</Label>
              <Input
                id="edit-encrypted_password"
                type="password"
                value={editForm.encrypted_password}
                onChange={(e) => setEditForm(prev => ({ ...prev, encrypted_password: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-purpose">Purpose/Notes</Label>
              <Textarea
                id="edit-purpose"
                value={editForm.purpose}
                onChange={(e) => setEditForm(prev => ({ ...prev, purpose: e.target.value }))}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
