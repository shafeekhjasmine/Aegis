'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout/Layout';
import Sidebar from '@/components/Sidebar/Sidebar';
import SidebarItem from '@/components/Sidebar/SidebarItem';
import Button from '@/components/Button/Button';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';

const DashboardIcon = () => <span>D</span>;
const ControlsIcon = () => <span>C</span>;

interface AppliedControl {
  id: string;
  name: string;
  ref_id?: string | null;
  status: 'to_do' | 'in_progress' | 'on_hold' | 'active' | 'deprecated' | '--' | string;
  priority: 1 | 2 | 3 | 4 | number;
  description?: string | null;
  updated_at?: string;
}

interface PaginatedAppliedControlsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AppliedControl[];
}

const priorityMapping: { [key: number]: string } = {
  1: 'P1 - Critical',
  2: 'P2 - High',
  3: 'P3 - Medium',
  4: 'P4 - Low',
};

const statusColorMapping: { [key: string]: string } = {
  'active': 'bg-green-100 text-green-800',
  'in_progress': 'bg-yellow-100 text-yellow-800',
  'to_do': 'bg-blue-100 text-blue-800',
  'on_hold': 'bg-orange-100 text-orange-800',
  'deprecated': 'bg-gray-100 text-gray-500',
  '--': 'bg-gray-100 text-gray-500',
};

const AppliedControlsPage: React.FC = () => {
  const [controls, setControls] = useState<AppliedControl[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated, setAuthToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This effect now handles both auth check and data fetching
    if (!isAuthenticated) {
      // Only redirect if not loading. This prevents redirecting
      // if a parallel auth check is happening or if loading has just started.
      if (!isLoading) router.push('/login');
      setIsLoading(false); // Stop loading if not authenticated
      return; // Don't proceed to fetch
    }

    const fetchAppliedControls = async () => {
      setIsLoading(true); // Ensure loading is true before fetch
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/api/applied-controls/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setError('Authentication failed. Please login again.');
            setAuthToken(null); // Clear invalid token
            router.push('/login');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return; // Stop processing if response not ok
        }
        
        const data: PaginatedAppliedControlsResponse = await response.json();
        setControls(data.results || []); // Ensure controls is an array even if results is undefined
      } catch (e: any) {
        console.error('Failed to fetch applied controls:', e);
        // Avoid setting error if it was an auth error already handled (redirected)
        if (!(e.message.includes('401') || e.message.includes('403') || error === 'Authentication failed. Please login again.')) {
            setError(e.message || 'Failed to fetch applied controls. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) { // Only fetch if authenticated
        fetchAppliedControls();
    } else {
        // If not authenticated and useEffect runs (e.g. on mount),
        // ensure loading is stopped and potentially redirect.
        // The check at the start of useEffect handles redirection for subsequent runs.
        setIsLoading(false); 
        router.push('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, router, setAuthToken]); // Add dependencies: router, setAuthToken

  const sidebarContent = (
    <Sidebar>
      <SidebarItem href="/dashboard" label="Dashboard" icon={<DashboardIcon />} />
      <SidebarItem href="/applied-controls" label="Applied Controls" icon={<ControlsIcon />} />
    </Sidebar>
  );

  // Conditional rendering based on authentication before attempting to show page content
  // This prevents a flash of "Loading controls..." if the user is immediately redirected.
  if (!isAuthenticated && isLoading) { // Show loading spinner briefly if initial auth check is pending
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <LoadingSpinner size="lg" color="text-indigo-600" />
            <p className="mt-3 text-lg text-gray-600">Checking authentication...</p>
        </div>
    );
  }
  
  if (!isAuthenticated && !isLoading) { // If after checks, still not authenticated, show minimal or redirect (handled by useEffect)
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <p className="mt-3 text-lg text-gray-600">Redirecting to login...</p>
            <LoadingSpinner size="lg" color="text-indigo-600" />
        </div>
    );
  }

  // If authenticated, show the page content
  return (
    <Layout sidebar={sidebarContent}>
      <div className="p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applied Controls</h1>
          <p className="mt-1 text-sm text-gray-600">Manage and track your organization's applied security controls.</p>
        </header>

        {isLoading && ( // This loading is for data fetching after auth is confirmed
          <div className="flex flex-col justify-center items-center h-80">
            <LoadingSpinner size="lg" color="text-indigo-600" />
            <p className="mt-3 text-lg text-gray-600">Loading controls, please wait...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-md" role="alert">
            <div className="flex">
              <div className="py-1">
                <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H10a1 1 0 0 1-1-1zm1-8a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-red-700">Error Fetching Data</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
            {controls.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ref ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {controls.map((control) => (
                    <tr key={control.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{control.ref_id || control.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{control.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColorMapping[control.status.toLowerCase()] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {control.status.replace(/_/g, ' ').replace(/^--$/, 'Undefined').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{priorityMapping[control.priority] || `P${control.priority}`}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {control.updated_at ? new Date(control.updated_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button size="sm" variant="secondary" onClick={() => alert('View details for ' + control.name)}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applied controls</h3>
                <p className="mt-1 text-sm text-gray-500">No data to display or you may not have permission to view this resource.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AppliedControlsPage;
