import React, { useEffect, useState } from 'react';
import { pb, isErrorResponse, logout } from './lib/pb';
import { AssessmentForm } from './components/AssessmentForm';
import { AssessmentList } from './components/AssessmentList';
import { Auth } from './components/Auth';
import { Toaster } from 'react-hot-toast';
import { GraduationCap, LogOut } from 'lucide-react';

function App() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const fetchAssessments = async () => {
    try {
      if (!pb.authStore.isValid) {
        setAssessments([]);
        setError('Please log in to view assessments');
        return;
      }

      const records = await pb.collection('nilai').getFullList({
        sort: '-created',
      });
      setAssessments(records);
      setError(undefined);
    } catch (error: any) {
      console.error('Error fetching assessments:', error);
      if (isErrorResponse(error)) {
        setError('Authentication required. Please ensure you have proper access.');
      } else {
        setError('Failed to fetch assessments. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
    pb.authStore.onChange(() => {
      fetchAssessments();
    });
  }, []);

  const handleLogout = () => {
    logout();
    setAssessments([]);
    setError('Please log in to view assessments');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <GraduationCap size={32} className="text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Student Assessment Manager</h1>
            </div>
            {pb.authStore.isValid && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-800"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>

          {!pb.authStore.isValid ? (
            <div className="max-w-md mx-auto">
              <Auth onAuthSuccess={fetchAssessments} />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <AssessmentForm onSuccess={fetchAssessments} />
              </div>
              
              <div className="md:col-span-2">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <AssessmentList 
                    assessments={assessments}
                    onDelete={fetchAssessments}
                    error={error}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;