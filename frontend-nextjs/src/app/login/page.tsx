'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState(''); // Can be email or username
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { setAuthToken } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('http://localhost:8000/api/iam/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Backend expects 'username'
      });

      const data = await response.json();

      if (!response.ok) {
        // Try to get error message from backend response
        const errorMsg = data?.non_field_errors?.[0] || data?.detail || `Login failed with status: ${response.status}`;
        throw new Error(errorMsg);
      }

      if (data.token) {
        setAuthToken(data.token);
        setSuccessMessage('Login successful! Redirecting...');
        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push('/applied-controls'); // Using Next.js router for client-side navigation
        }, 1000);
      } else {
        throw new Error('Login successful, but no token received.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-xl rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                id="username"
                name="username"
                type="text" // Changed to text to allow username or email
                autoComplete="username" // or "email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username or Email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
              <p>{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-green-50 border-l-4 border-green-400 text-green-700">
              <p>{successMessage}</p>
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="text-white mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
