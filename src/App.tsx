import { v4 as uuidV4 } from 'uuid';
import { FormEvent, useEffect, useState } from 'react'
import { FiPlusCircle, FiCircle, FiCheckCircle, FiTrash2 } from 'react-icons/fi'
import styles from './App.module.css'
import logo from './assets/Logo.svg'
import clipboard from './assets/Clipboard.svg'
import { TaskInformation } from './components/TaskInformation'

type Task = {
  id: string
  title: string
  finished: boolean
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskTitle, setTaskTitle] = useState('')

  const finishedTasks = tasks.reduce((acc, task) => task.finished ? acc + 1 : acc, 0)

  function handleCreateTask(event: FormEvent) {
    event.preventDefault()
    const newTask: Task = {
      title: taskTitle,
      finished: false,
      id: uuidV4()
    }

    setTasks(oldState => {
      const newTaskList = [...oldState, newTask]
      localStorage.setItem("@todo/tasks", JSON.stringify(newTaskList));
      return newTaskList
    })
    setTaskTitle('')
  }

  function handleChangeTaskStatus(id: string) {
    const tasksWithTaskStatusChanged = tasks.map(task => {
      if (task.id === id) {
        task.finished = !task.finished
      }
      return task
    })

    setTasks(tasksWithTaskStatusChanged)
    localStorage.setItem("@todo/tasks", JSON.stringify(tasksWithTaskStatusChanged));
  }

  function handleDeleteTask(id: string) {
    const tasksWithoutDeletedTask = tasks.filter(task => task.id !== id)
    setTasks(tasksWithoutDeletedTask)
    localStorage.setItem("@todo/tasks", JSON.stringify(tasksWithoutDeletedTask));
  }

  useEffect(() => {
    const taskList = JSON.parse(localStorage.getItem("@todo/tasks")!);
    setTasks(taskList)
  }, [])

  return (
    <div className={styles.app}>
      <header>
        <img src={logo} alt="Logo da aplicação" />
      </header>
      <main>
        <div className={styles.container}>
          <form>
            <input
              type="text"
              placeholder="Adicione uma nova tarefa"
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
            />
            <button onClick={handleCreateTask}>
              Criar <FiPlusCircle />
            </button>
          </form>
          <div className={styles.taskList}>
            <header>
              <TaskInformation
                text='Tarefas criadas'
                information={String(tasks.length)}
              />
              <TaskInformation
                text='Concluídas'
                color='purple'
                information={tasks.length === 0 ? '0' : `${finishedTasks} de ${tasks.length}`}
              />
            </header>
            {tasks.length === 0 ? (
              <section className={styles.noTasksMessage}>
                <img src={clipboard} alt="Imagem de uma prancheta de tarefas" className={styles.clipboardImg} />
                <strong>Você ainda não tem tarefas cadastradas</strong>
                <span>Crie tarefas e organize seus itens a fazer</span>
              </section>
            ) : tasks.map(task => (
              <section key={task.id} className={styles.task}>
                <button
                  onClick={() => handleChangeTaskStatus(task.id)}
                  className={task.finished ? styles.activateButton : styles.finishButton}
                >
                  {task.finished ? (
                    <FiCheckCircle />
                  ) : (
                    <FiCircle />
                  )}
                </button>
                <span className={task.finished ? styles.taskFinishedTitle : styles.taskTitle}>
                  {task.title}
                </span>
                <button onClick={() => handleDeleteTask(task.id)} className={styles.trashButton}>
                  <FiTrash2 />
                </button>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
