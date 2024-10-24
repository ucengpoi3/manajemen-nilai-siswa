import React, { useState } from 'react';
import { pb, isErrorResponse } from '../lib/pb';
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';
import { AutocompleteInput } from './AutocompleteInput';

type AssessmentFormProps = {
  onSuccess: () => void;
};

export function AssessmentForm({ onSuccess }: AssessmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    type: '',
    score: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!pb.authStore.isValid) {
        throw new Error('Authentication required');
      }

      await pb.collection('nilai').create({
        ...formData,
        score: parseFloat(formData.score),
      });
      
      setFormData({ name: '', class: '', type: '', score: '' });
      toast.success('Assessment added successfully!');
      onSuccess();
    } catch (error: any) {
      if (isErrorResponse(error)) {
        toast.error('Authentication required. Please log in.');
      } else {
        toast.error('Failed to add assessment');
      }
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (student: { name: string; class: string }) => {
    setFormData(prev => ({
      ...prev,
      name: student.name,
      class: student.class,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Student Name</label>
        <AutocompleteInput
          value={formData.name}
          onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
          onSelectStudent={handleStudentSelect}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Class</label>
        <input
          type="text"
          required
          value={formData.class}
          onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Assessment Type</label>
        <select
          required
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select type</option>
          <option value="Quiz">Quiz</option>
          <option value="Homework">Homework</option>
          <option value="Exam">Exam</option>
          <option value="Project">Project</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Score</label>
        <input
          type="number"
          required
          min="0"
          max="100"
          value={formData.score}
          onChange={(e) => setFormData(prev => ({ ...prev, score: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !pb.authStore.isValid}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        <PlusCircle size={20} />
        {loading ? 'Adding...' : 'Add Assessment'}
      </button>
    </form>
  );
}