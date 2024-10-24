import React, { useState } from 'react';
import { login, signup } from '../lib/pb';
import toast from 'react-hot-toast';
import { LogIn, UserPlus } from 'lucide-react';

type AuthProps = {
  onAuthSuccess: () => void;
};

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password, formData.passwordConfirm);
        await login(formData.email, formData.password);
      }
      toast.success(isLogin ? 'Logged in successfully!' : 'Account created and logged in!');
      onAuthSuccess();
    } catch (error: any) {
      toast.error(error?.response?.message || 'Authentication failed');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? 'Login' : 'Create Account'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              value={formData.passwordConfirm}
              onChange={(e) => setFormData(prev => ({ ...prev, passwordConfirm: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800"
      >
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
      </button>
    </div>
  );
}