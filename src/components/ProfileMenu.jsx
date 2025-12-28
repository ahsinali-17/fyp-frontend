import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { User, Key, Camera, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfileMenu = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        if (user.app_metadata.provider === 'google') {
          setAvatarUrl(user.user_metadata.avatar_url);
        } else {
          const { data } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', user.id)
            .single();
          setAvatarUrl(data?.avatar_url);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    
    await supabase.auth.signOut();
    
    // Update toast to success
    toast.update(toastId, { render: "Logged out", type: "success", isLoading: false, autoClose: 1000 });
    navigate('/login');
  };

  const handleAvatarUpload = async (event) => {
    try {
      setLoading(true);
      const file = event.target.files[0];
      if (!file) return;

      // Loading Start
      const toastId = toast.loading("Uploading image...");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      // Update toast to success
      toast.update(toastId, { render: "Profile picture updated!", type: "success", isLoading: false, autoClose: 1000 });

    } catch (error) {
      toast.dismiss();
      toast.error('Upload failed: ' + error.message);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      toast.success('Password changed successfully!');
      
      setShowPasswordModal(false);
      setNewPassword('');
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isEmailUser = user?.app_metadata?.provider === 'email';

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm hover:ring-2 ring-blue-500 transition-all cursor-pointer"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            <User size={20} />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-50">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.app_metadata?.provider || 'User'}</p>
          </div>

          {isEmailUser && (
            <button 
              onClick={() => fileInputRef.current.click()}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
            >
              <Camera size={16} /> Change Photo
            </button>
          )}

          {isEmailUser && (
            <button 
              onClick={() => { setIsOpen(false); setShowPasswordModal(true); }}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
            >
              <Key size={16} /> Change Password
            </button>
          )}

          <div className="border-t border-slate-50 mt-1">
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarUpload} 
        className="hidden" 
        accept="image/*" 
      />

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Change Password</h3>
            <input 
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleChangePassword}
                disabled={loading || !newPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;