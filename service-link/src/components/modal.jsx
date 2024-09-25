import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, task, onSave, mode }) => {
  const [taskData, setTaskData] = useState({
    task_name: '',
    task_description: '',
    due_date: '',
    status: 0,
  });

  // Populate task data when editing
  useEffect(() => {
    if (task && mode === 'edit') {
      setTaskData({
        task_name: task.task_name,
        task_description: task.task_description,
        due_date: task.due_date,
        status: task.status,
      });
    } else {
      setTaskData({
        task_name: '',
        task_description: '',
        due_date: '',
        status: 0,
      });
    }
  }, [task, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(taskData);
  };

  return (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-md shadow-md w-1/3 p-6">
        <h2 className="text-2xl font-bold mb-4">{mode === 'edit' ? 'Edit Task' : 'Add Task'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Task Name</label>
            <input
              type="text"
              name="task_name"
              value={taskData.task_name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Task Description</label>
            <textarea
              name="task_description"
              value={taskData.task_description}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={taskData.due_date}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select
              name="status"
              value={taskData.status}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Pending</option>
              <option value={1}>Completed</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
