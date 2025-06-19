import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, X, Filter, Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Worker } from '../types/database';

const WorkerOverview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; worker: Worker | null }>({
    show: false,
    worker: null
  });
  const [newWorker, setNewWorker] = useState({
    name: '',
    email: '',
    department: '',
    title: '',
    secret_code: '',
    profile_picture_url: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchWorkers();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const { data, error } = await supabase
      .from('workers')
      .select('department');

    if (error) {
      console.error('Error fetching departments:', error);
      return;
    }

    const uniqueDepartments = Array.from(new Set(data.map((item: { department: string }) => item.department))).sort();
    setDepartments(uniqueDepartments);
  };

  const fetchWorkers = async () => {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workers:', error);
      return;
    }

    setWorkers(data || []);
  };

  const handleCreateWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const { data, error } = await supabase
      .from('workers')
      .insert([newWorker])
      .select()
      .single();

    if (error) {
      setError('Error creating worker: ' + error.message);
      return;
    }

    setSuccessMessage('Worker created successfully!');
    setIsCreating(false);
    setNewWorker({
      name: '',
      email: '',
      department: '',
      title: '',
      secret_code: '',
      profile_picture_url: ''
    });
    fetchWorkers();
    fetchDepartments(); // Refresh departments in case a new one was added
  };

  const handleDeleteWorker = async () => {
    if (!deleteConfirm.worker) return;
    
    setIsDeleting(true);
    setError('');
    
    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', deleteConfirm.worker.id);

    if (error) {
      setError('Error deleting worker: ' + error.message);
      setIsDeleting(false);
      return;
    }

    setSuccessMessage(`Worker ${deleteConfirm.worker.name} deleted successfully!`);
    setDeleteConfirm({ show: false, worker: null });
    setIsDeleting(false);
    fetchWorkers();
    fetchDepartments(); // Refresh departments list
  };

  const openDeleteConfirm = (worker: Worker) => {
    setDeleteConfirm({ show: true, worker });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ show: false, worker: null });
  };

  const filteredWorkers = workers.filter(worker =>
    (selectedDepartment ? worker.department === selectedDepartment : true) &&
    (searchTerm ? 
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.worker_id.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    )
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-gray-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Workers Overview</h1>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search workers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Worker</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">{successMessage}</div>
      )}

      {/* Create Worker Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Worker</h2>
              <button
                onClick={() => setIsCreating(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateWorker}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newWorker.email}
                    onChange={(e) => setNewWorker({ ...newWorker, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newWorker.department}
                    onChange={(e) => setNewWorker({ ...newWorker, department: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newWorker.title}
                    onChange={(e) => setNewWorker({ ...newWorker, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
                  <input
                    type="url"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newWorker.profile_picture_url || ''}
                    onChange={(e) => setNewWorker({ ...newWorker, profile_picture_url: e.target.value })}
                    placeholder="https://example.com/profile.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Secret Code</label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={newWorker.secret_code}
                    onChange={(e) => setNewWorker({ ...newWorker, secret_code: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && deleteConfirm.worker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Delete Worker</h2>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete <span className="font-semibold">{deleteConfirm.worker.name}</span>?
              </p>
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">ID:</span> {deleteConfirm.worker.worker_id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Department:</span> {deleteConfirm.worker.department}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWorker}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Worker</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredWorkers.map((worker) => (
          <div
            key={worker.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 group"
          >
            <div className="relative">
              {worker.profile_picture_url ? (
                <img
                  src={worker.profile_picture_url}
                  alt={`${worker.name}'s profile`}
                  className="object-cover w-full h-32"
                />
              ) : (
                <div className="flex items-center justify-center h-32 bg-gray-100">
                  <div className="rounded-full bg-gray-200 p-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
              )}
              <button
                onClick={() => openDeleteConfirm(worker)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                title="Delete worker"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{worker.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{worker.title}</p>
                </div>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
                  {worker.worker_id}
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <p className="truncate">
                  <span className="font-medium">Dept:</span> {worker.department}
                </p>
                <p className="truncate">
                  <span className="font-medium">Email:</span> {worker.email}
                </p>
                <p>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(worker.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedDepartment
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding a new worker.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkerOverview;