import React from 'react'
import TaskManager from '../components/task-manager'
import Header from '../components/header/header'

const TaskManagerPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 mt-20">
        <TaskManager />
      </div>
    </div>
  )
}

export default TaskManagerPage