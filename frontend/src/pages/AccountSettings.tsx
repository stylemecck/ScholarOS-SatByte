import { toast } from '../lib/toast';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Camera, Shield, Bell, 
  Trash2, Save, Loader2, LogOut, Key,
  CheckCircle2, AlertCircle, Share2, Copy,
  Lock, Smartphone, Eye, EyeOff
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { Navigate } from 'react-router-dom';

type TabType = 'profile' | 'security' | 'notifications' | 'referrals';

const AccountSettings = () => {
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  // Security Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);

  // Notifications State
  const [notifs, setNotifs] = useState({
    emailAlerts: true,
    weeklyReports: false,
    newFeatures: true
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground tracking-tight">Loading settings...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, {
        name: profileData.name,
        avatar: profileData.avatar
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      window.dispatchEvent(new Event('user-data-refresh'));
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode || '');
    toast.success('Referral code copied to clipboard!');
  };

  const avatarStyles = ["avataaars", "bottts", "initials", "lorelei", "micah", "pixel-art"];
  const generateNewAvatar = () => {
    const style = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    const seed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
    setProfileData({ ...profileData, avatar: newAvatar });
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Account <span className="text-primary">Settings</span></h1>
        <p className="text-muted-foreground font-medium">Manage your digital identity and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2">
          <SettingsTab icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setMessage(null); }} />
          <SettingsTab icon={Shield} label="Security" active={activeTab === 'security'} onClick={() => { setActiveTab('security'); setMessage(null); }} />
          <SettingsTab icon={Bell} label="Notifications" active={activeTab === 'notifications'} onClick={() => { setActiveTab('notifications'); setMessage(null); }} />
          <SettingsTab icon={Share2} label="Referrals" active={activeTab === 'referrals'} onClick={() => { setActiveTab('referrals'); setMessage(null); }} />
          <div className="pt-4 mt-4 border-t border-border">
            <button onClick={logout} className="w-full flex items-center gap-3 px-6 py-4 text-rose-500 font-black text-sm hover:bg-rose-500/10 rounded-2xl transition-all uppercase tracking-widest">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-xl space-y-8">
                  <div className="flex flex-col items-center sm:flex-row gap-8">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-primary/20 shadow-2xl bg-muted">
                        <img src={profileData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profileData.name}`} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <button type="button" onClick={generateNewAvatar} className="absolute -bottom-2 -right-2 p-3 bg-primary text-primary-foreground rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2 text-center sm:text-left">
                      <h3 className="text-xl font-black">Profile Picture</h3>
                      <p className="text-xs text-muted-foreground font-medium max-w-xs leading-relaxed">Customize your avatar or shuffle to get a new unique look from DiceBear.</p>
                      <button type="button" onClick={generateNewAvatar} className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Shuffle Avatar</button>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-primary/20 outline-none font-bold" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                        <div className="relative opacity-60">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input type="email" disabled value={profileData.email} className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-14 pr-6 cursor-not-allowed font-bold" />
                        </div>
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Profile</>}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-xl space-y-8">
                  <div className="flex items-center gap-4 text-primary">
                    <Lock className="w-8 h-8" />
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tighter">Password Management</h3>
                      <p className="text-xs text-muted-foreground font-medium">Change your password to keep your account secure.</p>
                    </div>
                  </div>

                  {user.isGoogleUser ? (
                    <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-start gap-4">
                      <Smartphone className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                        You are signed in with Google. Password management is handled through your <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-primary font-black underline">Google Account settings</a>.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleChangePassword} className="space-y-6">
                      <div className="space-y-4">
                        <PasswordInput label="Current Password" value={passwordData.currentPassword} onChange={(val: string) => setPasswordData({...passwordData, currentPassword: val})} show={showPasswords} toggle={() => setShowPasswords(!showPasswords)} />
                        <PasswordInput label="New Password" value={passwordData.newPassword} onChange={(val: string) => setPasswordData({...passwordData, newPassword: val})} show={showPasswords} toggle={() => setShowPasswords(!showPasswords)} />
                        <PasswordInput label="Confirm New Password" value={passwordData.confirmPassword} onChange={(val: string) => setPasswordData({...passwordData, confirmPassword: val})} show={showPasswords} toggle={() => setShowPasswords(!showPasswords)} />
                      </div>
                      <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Key className="w-5 h-5" /> Change Password</>}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-xl space-y-8">
                  <div className="flex items-center gap-4 text-primary">
                    <Bell className="w-8 h-8" />
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tighter">Notifications</h3>
                      <p className="text-xs text-muted-foreground font-medium">Control how you receive updates and alerts.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <NotificationToggle label="Email Security Alerts" desc="Get notified about login attempts and password changes." active={notifs.emailAlerts} onToggle={() => setNotifs({...notifs, emailAlerts: !notifs.emailAlerts})} />
                    <NotificationToggle label="Weekly Academic Reports" desc="Receive a summary of your study progress and exam goals." active={notifs.weeklyReports} onToggle={() => setNotifs({...notifs, weeklyReports: !notifs.weeklyReports})} />
                    <NotificationToggle label="New Feature Updates" desc="Be the first to know when we launch new AI tools." active={notifs.newFeatures} onToggle={() => setNotifs({...notifs, newFeatures: !notifs.newFeatures})} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'referrals' && (
              <motion.div key="referrals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-xl space-y-8">
                  <div className="flex items-center gap-4 text-amber-500">
                    <Share2 className="w-8 h-8" />
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tighter">Referral Program</h3>
                      <p className="text-xs text-muted-foreground font-medium">Invite friends and earn bonus credits for every signup.</p>
                    </div>
                  </div>

                  <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center sm:text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/60">Your Referral Code</p>
                      <h4 className="text-3xl font-black tracking-[0.1em] text-amber-600">{user.referralCode}</h4>
                    </div>
                    <button onClick={copyReferralCode} className="flex items-center gap-3 px-8 py-4 bg-amber-500 text-amber-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20">
                      <Copy className="w-4 h-4" /> Copy Code
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-6 rounded-3xl border border-border text-center">
                      <p className="text-2xl font-black">{user.referralsCount || 0}</p>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Successful Referrals</p>
                    </div>
                    <div className="bg-muted/30 p-6 rounded-3xl border border-border text-center">
                      <p className="text-2xl font-black text-primary">50+</p>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Potential Credits</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {message && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <p className="text-sm font-black uppercase tracking-tight">{message.text}</p>
            </motion.div>
          )}

          {/* Dangerous Zone */}
          <div className="bg-rose-500/5 border border-rose-500/10 rounded-[2.5rem] p-8 md:p-10 space-y-6">
            <div className="flex items-center gap-3 text-rose-500">
               <Trash2 className="w-6 h-6" />
               <h3 className="text-xl font-black uppercase tracking-tighter">Danger Zone</h3>
            </div>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Permanently delete your account and all associated data including saved analyses, study plans, and credits. This action is irreversible.
            </p>
            <button className="px-8 py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
               Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
    <Icon className="w-5 h-5" /> {label}
  </button>
);

const PasswordInput = ({ label, value, onChange, show, toggle }: any) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{label}</label>
    <div className="relative">
      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-14 pr-12 focus:ring-4 focus:ring-primary/20 outline-none font-bold transition-all" />
      <button type="button" onClick={toggle} className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

const NotificationToggle = ({ label, desc, active, onToggle }: any) => (
  <div className="flex items-center justify-between p-6 bg-muted/20 border border-border rounded-3xl hover:bg-muted/30 transition-all">
    <div className="space-y-1 pr-4">
      <h4 className="text-sm font-black uppercase tracking-tight">{label}</h4>
      <p className="text-[11px] text-muted-foreground font-medium leading-tight">{desc}</p>
    </div>
    <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${active ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-muted-foreground/30'}`}>
      <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>
);

export default AccountSettings;
