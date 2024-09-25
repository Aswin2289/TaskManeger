import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaPlus } from 'react-icons/fa'; 
import Modal from './modal';
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); 
  const [modalMode, setModalMode] = useState('add'); 


  const fetchTasks = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/tasks/list_tasks/?searchKeyword=${searchKeyword}&size=${limit}&page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      setTasks(data.tasks);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/tasks/delete_task/?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchTasks(page); // Refetch tasks after deletion
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add or Edit task
  const handleSaveTask = async (task) => {
    setLoading(true);
    const url = modalMode === 'add' ? 'http://localhost:8000/tasks/add_task/' : `http://localhost:8000/tasks/edit_task/${selectedTask.id}`;
    const method = modalMode === 'add' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (response.ok) {
        fetchTasks(page); // Refetch tasks after add/edit
        setIsModalOpen(false); // Close modal
      } else {
        console.error('Failed to save task');
      }
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for adding a new task
  const handleAddTask = () => {
    setSelectedTask(null); // Clear selected task
    setModalMode('add'); // Set modal mode to 'add'
    setIsModalOpen(true); // Open modal
  };

  // Open modal for editing a task
  const handleEditTask = (task) => {
    setSelectedTask(task); // Set selected task
    setModalMode('edit'); // Set modal mode to 'edit'
    setIsModalOpen(true); // Open modal
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page, searchKeyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on search
    fetchTasks(1);
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Task Manager</h1>

      <form onSubmit={handleSearch} className="mb-6 flex justify-center space-x-2">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search tasks..."
          className="border border-gray-300 rounded-md p-3 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 transition">
          Search
        </button>
      </form>

      <div className="flex justify-end mb-4">
        <button onClick={handleAddTask} className="bg-green-600 text-white rounded-md p-3 flex items-center space-x-2 hover:bg-green-700 transition">
          <FaPlus />
          <span>Add Task</span>
        </button>
      </div>

      <div className='w-1/2 mx-auto'>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <ul className="border border-gray-300 rounded-md shadow-md">
            {tasks.map((task) => (
              <li key={task.id} className="p-4 border-b border-gray-200 hover:bg-gray-50 transition flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">{task.task_name}</h2>
                  <p className="text-gray-600">{task.task_description}</p>
                  <p className="text-gray-500">Due Date: <span className="font-medium">{task.due_date}</span></p>
                  <p className={`text-sm font-semibold ${task.status ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {task.status ? 'Completed' : 'Pending'}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-blue-500 hover:text-blue-700 transition"
                    aria-label="Edit Task"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    aria-label="Delete Task"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`bg-gray-300 rounded-md p-2 ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400 transition'}`}
          >
            Previous
          </button>
          <span className="font-medium text-lg">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`bg-gray-300 rounded-md p-2 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400 transition'}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Add/Edit Task */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
          onSave={handleSaveTask}
          mode={modalMode}
        />
      )}
    </div>
  );
};

export default TaskManager;
