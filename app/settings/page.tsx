'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { useTheme } from 'next-themes'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Eye, EyeOff, Moon, Sun, Upload, ArrowLeft } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { user, updateUserProfile, changePassword, changeEmail } = useAuth()
  const { theme, setTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState('profile')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Profile form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: user?.address || '',
  })

  // Password form states
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    showOld: false,
    showNew: false,
    showConfirm: false,
  })

  // Email form states
  const [emailForm, setEmailForm] = useState({
    newEmail: user?.email || '',
    password: '',
    showPassword: false,
  })

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<string | undefined>(user?.profilePicture)
  

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Header cartCount={0} cartTotal={0} onCartClick={() => {}} />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please sign in to access settings</p>
          <Link
            href="/signin"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Go to Sign In
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await updateUserProfile({
        name: formData.name,
        address: formData.address,
        profilePicture: profilePicture,
      })
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await changePassword(passwordForm.oldPassword, passwordForm.newPassword)
      setSuccess('Password changed successfully!')
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        showOld: false,
        showNew: false,
        showConfirm: false,
      })
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!emailForm.newEmail.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      await changeEmail(emailForm.newEmail, emailForm.password)
      setSuccess('Email changed successfully!')
      setEmailForm({
        newEmail: emailForm.newEmail,
        password: '',
        showPassword: false,
      })
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change email')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      <Header cartCount={0} cartTotal={0} onCartClick={() => {}} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-900 dark:text-blue-400 hover:text-green-600 dark:hover:text-green-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 rounded-lg">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-800">
          {['profile', 'password', 'email', 'theme'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold transition-colors capitalize ${
                activeTab === tab
                  ? 'text-blue-900 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 mb-8">
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Profile Picture
                </label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {profilePicture ? (
                      <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl text-gray-400">👤</span>
                    )}
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-blue-900 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Max 5MB</p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Delivery Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400"
                  placeholder="Enter your delivery address"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 dark:bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-700 dark:hover:bg-green-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 mb-8">
            <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
              {/* Old Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={passwordForm.showOld ? 'text' : 'password'}
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm({ ...passwordForm, showOld: !passwordForm.showOld })}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {passwordForm.showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={passwordForm.showNew ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm({ ...passwordForm, showNew: !passwordForm.showNew })}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {passwordForm.showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={passwordForm.showConfirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordForm({ ...passwordForm, showConfirm: !passwordForm.showConfirm })}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {passwordForm.showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 dark:bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-700 dark:hover:bg-green-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* Email Tab */}
        {/* {activeTab === 'email' && (
          <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 mb-8">
            <form onSubmit={handleEmailChange} className="space-y-6 max-w-md"> */}
              {/* Current Email */}
              {/* <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Current Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white cursor-not-allowed"
                />
              </div> */}

              {/* New Email */}
              {/* <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  New Email
                </label>
                <input
                  type="email"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400"
                />
              </div> */}

              {/* Password Confirmation */}
              {/* <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Password (for verification)
                </label>
                <div className="relative">
                  <input
                    type={emailForm.showPassword ? 'text' : 'password'}
                    value={emailForm.password}
                    onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setEmailForm({ ...emailForm, showPassword: !emailForm.showPassword })}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {emailForm.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div> */}

              {/* <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 dark:bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-700 dark:hover:bg-green-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Change Email'}
              </button> */}
            {/* </form> */}
          {/* </div> */}
        {/* )} */}  

        {/* Theme Tab */}
        {/* {activeTab === 'theme' && (
          <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-6 mb-8">
            <div className="max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose your preferred color theme for the application.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => theme === 'dark' && setTheme('light')}
                  className={`flex-1 p-6 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-blue-900 dark:border-blue-400 bg-white shadow-lg'
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900 dark:text-white">Light Mode</p>
                  {theme === 'light' && <p className="text-xs text-green-600 mt-2">Active</p>}
                </button>
                <button
                  onClick={() => theme === 'light' && setTheme('dark')}
                  className={`flex-1 p-6 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-blue-900 dark:border-blue-400 bg-white dark:bg-slate-800 shadow-lg'
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <Moon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900 dark:text-white">Dark Mode</p>
                  {theme === 'dark' && <p className="text-xs text-green-600 dark:text-green-400 mt-2">Active</p>}
                </button>
              </div>
            </div>
          </div>
        )} */}
      </main>

      <Footer />
    </div>
  )
}
