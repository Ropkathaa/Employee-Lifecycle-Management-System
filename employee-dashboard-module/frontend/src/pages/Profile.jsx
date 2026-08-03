import React, { useState, useEffect, useRef } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiBriefcase, FiEdit2, FiSave, FiX, FiLoader, FiCamera } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useEmployee } from '../context/EmployeeContext';
import { FORMAT_DATE } from '../utils/constants';
import { getInitials } from '../utils/helpers';

const Profile = () => {
  const { profile, profileLoading, fetchProfile, updateProfileData, uploadProfileAvatar } = useEmployee();

  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    department: '',
    position: '',
  });

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        department: profile.department || '',
        position: profile.position || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfileData(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original profile data
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        department: profile.department || '',
        position: profile.position || '',
      });
    }
    setIsEditing(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset the input so the same file can be selected again later
    e.target.value = '';

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      await uploadProfileAvatar(formData);
      toast.success('Profile picture updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Loading state
  if (profileLoading && !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  const fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'N/A';
  const initials = getInitials(fullName);

const displayField = (label, value) => (
    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
        <p className="dark:text-gray-200">{value || 'N/A'}</p>
      </div>
    </div>
  );

  const inputField = (label, name, Icon = null, type = 'text') => (
    <div>
<label className="block text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</label>
      <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 dark:bg-gray-800">
        {Icon && <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />}
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full outline-none text-sm bg-transparent"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiEdit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                <FiSave className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50"
            >
              <FiX className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
<div className="w-28 h-28 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-md">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
<span className="text-primary-700 dark:text-primary-300 text-3xl font-bold">{initials}</span>
              )}
            </div>
            {/* Camera button overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              title={profile?.avatar ? 'Change profile picture' : 'Upload profile picture'}
className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-md hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {avatarUploading ? (
                <FiLoader className="w-4 h-4 animate-spin" />
              ) : (
                <FiCamera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="*/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={avatarUploading}
            />
          </div>
          <div className="text-center md:text-left flex-1">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {inputField('First Name', 'firstName')}
                {inputField('Last Name', 'lastName')}
                {inputField('Position / Job Title', 'position')}
                {inputField('Department', 'department')}
              </div>
            ) : (
              <>
<h2 className="text-2xl font-bold dark:text-gray-100">{fullName}</h2>
                <p className="text-gray-500 dark:text-gray-400">{profile?.position || 'N/A'}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{profile?.department || 'N/A'} Department</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card">
<h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Contact Information</h3>
        {isEditing ? (
          <div className="space-y-4">
            {inputField('Email', 'email', FiMail, 'email')}
            {inputField('Phone', 'phone', FiPhone, 'tel')}
            {inputField('Location', 'location', FiMapPin)}
          </div>
        ) : (
          <div className="space-y-4">
<div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <FiMail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              {displayField('Email', profile?.email)}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <FiPhone className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              {displayField('Phone', profile?.phone)}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <FiMapPin className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              {displayField('Location', profile?.location)}
            </div>
          </div>
        )}
      </div>

      {/* Employment Details */}
      <div className="card">
<h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Employment Details</h3>
        <div className="space-y-4">
<div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <FiBriefcase className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            {displayField('Department', profile?.department)}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <FiCalendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            {displayField('Join Date', profile?.joinDate ? FORMAT_DATE(profile.joinDate) : 'N/A')}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <FiUser className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            {displayField('Employee ID', profile?.employeeId)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

