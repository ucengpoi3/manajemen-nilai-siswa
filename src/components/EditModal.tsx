import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Assessment } from './AssessmentList';

type EditModalProps = {
  assessment: Assessment | null;
  onClose: () => void;
  onSave: (assessment: Partial<Assessment>) => Promise<void>;
};

export function EditModal({ assessment, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    type: '',
    score: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assessment) {
      setFormData({
        name: assessment.name,
        class: assessment.class,
        type: assessment.type,
        score: assessment.score.toString(),
      });
    }
  }, [assessment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        ...formData,
        score: parseFloat(formData.score),
      });
      onClose();
    } catch (error) {
      console.error('Edit error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!assessment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Edit Assessment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <input
              type="text"
              value={formData.class}
              onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Assessment Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
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
              min="0"
              max="100"
              value={formData.score}
              onChange={(e) => setFormData(prev => ({ ...prev, score: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}