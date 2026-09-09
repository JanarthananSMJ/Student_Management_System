import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ShieldCheck, GraduationCap, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ROLE_TABS = [
  { key: 'admin', label: 'Admin', icon: ShieldCheck },
  { key: 'staff', label: 'Staff', icon: Users },
  { key: 'student', label: 'Student', icon: GraduationCap },
];

export default function LoginPage() {
  const { login, user } = useAuth();
  const [activeTab, setActiveTab] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // A successful login updates `user` in AuthContext, which re-renders
      // this component as <Navigate/> above and unmounts it - so only the
      // error path needs to touch state here.
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const ActiveIcon = ROLE_TABS.find((t) => t.key === activeTab)?.icon || ShieldCheck;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-primary-950 to-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white font-bold text-lg shadow-lg shadow-primary-900/40">
            C
          </div>
          <h1 className="text-xl font-semibold text-white">College ERP</h1>
          <p className="text-sm text-gray-400">Sign in to access your dashboard</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-5 flex rounded-lg bg-gray-100 p-1">
            {ROLE_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mb-4 flex items-center gap-2 text-gray-500">
            <ActiveIcon className="h-4 w-4" />
            <span className="text-sm">Signing in as {activeTab}</span>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@college.edu"
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <Button type="submit" className="mt-1 w-full" loading={loading}>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
