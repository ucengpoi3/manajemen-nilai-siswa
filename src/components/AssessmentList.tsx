import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { pb, isErrorResponse } from '../lib/pb';
import toast from 'react-hot-toast';
import { EditModal } from './EditModal';

export type Assessment = {
  id: string;
  name: string;
  class: string;
  type: string;
  score: number;
};

type AssessmentListProps = {
  assessments: Assessment[];
  onDelete: () => void;
  error?: string;
};

export function AssessmentList({ assessments, onDelete, error }: AssessmentListProps) {
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);

  const handleDelete = async (id: string) => {
    if (!pb.authStore.isValid) {
      toast.error('Authentication required. Please log in.');
      return;
    }

    if (confirm('Are you sure you want to delete this assessment?')) {
      try {
        await pb.collection('nilai').delete(id);
        toast.success('Assessment deleted successfully');
        onDelete();
      } catch (error: any) {
        if (isErrorResponse(error)) {
          toast.error('Authentication required. Please log in.');
        } else {
          toast.error('Failed to delete assessment');
        }
        console.error('Delete error:', error);
      }
    }
  };

  const handleEdit = async (updatedData: Partial<Assessment>) => {
    if (!editingAssessment || !pb.authStore.isValid) {
      toast.error('Authentication required. Please log in.');
      return;
    }

    try {
      await pb.collection('nilai').update(editingAssessment.id, updatedData);
      toast.success('Assessment updated successfully');
      onDelete(); // Refresh the list
    } catch (error: any) {
      if (isErrorResponse(error)) {
        toast.error('Authentication required. Please log in.');
      } else {
        toast.error('Failed to update assessment');
      }
      console.error('Update error:', error);
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assessments.map((assessment) => (
              <tr key={assessment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{assessment.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{assessment.class}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${assessment.type === 'Quiz' ? 'bg-purple-100 text-purple-800' :
                      assessment.type === 'Homework' ? 'bg-green-100 text-green-800' :
                      assessment.type === 'Exam' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'}`}>
                    {assessment.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`font-medium ${
                    assessment.score >= 80 ? 'text-green-600' :
                    assessment.score >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {assessment.score}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setEditingAssessment(assessment)}
                    className="text-blue-600 hover:text-blue-900"
                    disabled={!pb.authStore.isValid}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(assessment.id)}
                    className="text-red-600 hover:text-red-900 ml-4"
                    disabled={!pb.authStore.isValid}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingAssessment && (
        <EditModal
          assessment={editingAssessment}
          onClose={() => setEditingAssessment(null)}
          onSave={handleEdit}
        />
      )}
    </>
  );
}