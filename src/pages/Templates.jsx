import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';
import TemplateEditor from '../components/TemplateEditor';

export default function Templates() {
  const { templates, deleteTemplate, duplicateTemplate } = useAppData();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Get stats from actual templates
  const stats = {
    total: templates.length,
    email: templates.filter(t => t.type === 'email').length,
    sms: templates.filter(t => t.type === 'sms').length,
    active: templates.filter(t => t.usage > 0).length
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setShowEditor(true);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setShowEditor(true);
  };
  
  // Production-ready template actions
  const handlePreviewTemplate = (template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };
  
  const handleDuplicateTemplate = (template) => {
    duplicateTemplate(template.id);
  };
  
  const handleDeleteTemplate = (template) => {
    if (confirm(`Are you sure you want to delete "${template.name}"?\n\nThis action cannot be undone.`)) {
      deleteTemplate(template.id);
    }
  };

  // Template preview modal
  const PreviewModal = ({ template, onClose }) => {
    if (!template) return null;

    const sampleContent = template.content
      ?.replace(/{customer_name}/g, 'John Doe')
      ?.replace(/{invoice_number}/g, 'INV-001')
      ?.replace(/{amount}/g, '$1,250.00')
      ?.replace(/{due_date}/g, '2025-07-30')
      ?.replace(/{days_overdue}/g, '5')
      ?.replace(/{company_name}/g, 'PayPing Solutions') || template.description;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Template Preview: {template.name}</h3>
          </div>
          <div className="p-6">
            {template.type === 'email' && template.subject && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                <div className="bg-gray-50 p-2 rounded border">{template.subject}</div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content:</label>
              <div className="bg-gray-50 p-4 rounded border whitespace-pre-wrap">{sampleContent}</div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (showEditor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setShowEditor(false)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Templates
            </button>
          </div>
          <TemplateEditor template={selectedTemplate} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Message Templates</h1>
              <p className="text-gray-600 mt-2">Create and manage your payment reminder templates</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create New Template
            </button>
          </div>
        </div>

        {/* Template Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Email Templates</p>
                <p className="text-2xl font-bold text-gray-900">{templates.filter(t => t.type === 'email').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">SMS Templates</p>
                <p className="text-2xl font-bold text-gray-900">{templates.filter(t => t.type === 'sms').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold text-gray-900">147</p>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                        template.type === 'email' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {template.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <p className="text-sm font-medium text-gray-900 mb-4">"{template.subject}"</p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Used {template.usage} times</span>
                      <span className="mx-2">•</span>
                      <span>Last used {template.lastUsed}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handlePreviewTemplate(template)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Preview
                    </button>
                    <button 
                      onClick={() => handleDuplicateTemplate(template)}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Duplicate
                    </button>
                  </div>
                  <button 
                    onClick={() => handleDeleteTemplate(template)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Templates */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Start Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleCreateNew}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 className="font-medium text-gray-900">Payment Reminder</h3>
              <p className="text-sm text-gray-600 mt-1">Standard payment due reminder</p>
            </button>
            <button
              onClick={handleCreateNew}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 className="font-medium text-gray-900">Follow-up Email</h3>
              <p className="text-sm text-gray-600 mt-1">Professional follow-up message</p>
            </button>
            <button
              onClick={handleCreateNew}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 className="font-medium text-gray-900">Payment Confirmation</h3>
              <p className="text-sm text-gray-600 mt-1">Thank you message template</p>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal 
          template={previewTemplate} 
          onClose={() => {
            setShowPreview(false);
            setPreviewTemplate(null);
          }} 
        />
      )}

      {/* Template Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <TemplateEditor 
              template={selectedTemplate}
              onClose={() => {
                setShowEditor(false);
                setSelectedTemplate(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
