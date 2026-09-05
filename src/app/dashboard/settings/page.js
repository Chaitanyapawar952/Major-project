'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUser } from '@/store/userSlice';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { Settings, Save, Loader, User, Mail, Phone, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.displayName) {
      toast.error('Display name is required');
      return;
    }

    try {
      setLoading(true);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName,
        });
      }

      await updateDoc(doc(db, 'users', user.uid), {
        displayName: formData.displayName,
        phone: formData.phone,
        bio: formData.bio,
        updatedAt: new Date().toISOString(),
      });

      dispatch(addUser({
        ...user,
        displayName: formData.displayName,
        phone: formData.phone,
        bio: formData.bio,
      }));

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <Settings size={32} />
          <div>
            <h1 className="text-4xl font-bold">Settings</h1>
            <p className="text-purple-100 mt-1">Manage your profile and preferences</p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
          {/* Display Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User size={16} />
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-600 transition"
              disabled={loading}
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <AlertCircle size={12} />
              Email cannot be changed
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Phone size={16} />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Optional"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-600 transition"
              disabled={loading}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={16} />
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-600 h-32 resize-none transition"
              disabled={loading}
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl hover:shadow-lg disabled:opacity-50 font-bold flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Profile
              </>
            )}
          </button>
        </form>
      </div>

      {/* Account Info Section */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Account Type</span>
            <span className="font-bold text-gray-900 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
              Email Account
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-600 font-medium">Member Since</span>
            <span className="font-semibold text-gray-900">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-600 font-medium">User ID</span>
            <span className="font-mono text-xs text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
              {user?.uid?.slice(0, 12)}...
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-md border-2 border-red-200 overflow-hidden">
        <div className="bg-red-100 px-6 py-4 border-b border-red-200">
          <h2 className="text-xl font-bold text-red-900 flex items-center gap-2">
            <AlertCircle size={20} />
            Danger Zone
          </h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-red-700 mb-4">
            ⚠️ Be careful! These actions cannot be undone.
          </p>
          <button
            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 font-semibold shadow-md transition"
            onClick={() => alert('Delete account feature coming soon')}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
