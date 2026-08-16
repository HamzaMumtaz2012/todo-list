'use client'
import { useState, useEffect, useRef } from 'react'

// Custom hook to check if component is hydrated
function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

const Page = () => {
  const isHydrated = useIsHydrated()

  const [dateInfo, setDateInfo] = useState({
    day: '',
    date: '',
    month: '',
  })

  const [todoes, setTodoes] = useState([])
  const [value, setValue] = useState('')
  const [priority, setPriority] = useState('MED')
  const [filter, setFilter] = useState('ALL')
  const [editingId, setEditingId] = useState(null)

  const ref = useRef(null)
  const allRef = useRef(null)

  // Load from localStorage after hydration
  useEffect(() => {
    if (!isHydrated) return
    try {
      const stored = localStorage.getItem('todos')
      if (stored) {
        setTodoes(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to parse todos from localStorage', e)
    }
  }, [isHydrated])

  // Sync to localStorage when todos change (only after hydration)
  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem('todos', JSON.stringify(todoes))
  }, [todoes, isHydrated])

  // Set Date Data
  useEffect(() => {
    const today = new Date()

    setDateInfo({
      day: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today),
      date: new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(today),
      month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(today),
    })

    allRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!ref.current) return
    
    ref.current.style.color = value ? 'white' : '#5b6478'
  }, [value])

  const addTodo = () => {
    const nextValue = value.trim()

    if (!nextValue) return

    if (editingId !== null) {
      setTodoes((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === editingId
            ? {
                ...todo,
                text: nextValue,
                priority,
              }
            : todo
        )
      )

      setEditingId(null)
      setValue('')
      ref.current?.blur()
      
      return
    }

    setTodoes((currentTodos) => [
      ...currentTodos,
      {
        id: Date.now(),
        text: nextValue,
        completed: false,
        priority,
      },
    ])

    setValue('')
  }

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTodo()
    }
  }

  const handleDelete = (id) => {
    setTodoes((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== id)
    )
  }

  const handleEditClick = (id, text, taskPriority) => {
    setEditingId(id)
    setValue(text)
    setPriority(taskPriority)
    ref.current?.focus()
  }

  const toggleTodo = (id) => {
    setTodoes((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo
      )
    )
  }

  const openCount = todoes.filter(
    (todo) => !todo.completed
  ).length

  const doneCount = todoes.filter(
    (todo) => todo.completed
  ).length

  const filteredTodos = todoes.filter((todo) => {
    if (filter === 'ACTIVE') {
      return !todo.completed
    }

    if (filter === 'COMPLETED') {
      return todo.completed
    }

    return true
  })

  const getPriorityStyle = (taskPriority) => {
    if (taskPriority === 'LOW') {
      return 'bg-white/10 text-white border border-white/10'
    }

    if (taskPriority === 'HIGH') {
      return 'bg-red-400/10 text-red-300 border border-red-400/10'
    }

    return 'bg-[#e0a63d]/10 text-[#e0c56f] border border-[#e0a63d]/10'
  }
const handleDeleteCompleted = () => {
  const updatedTodoes = todoes.filter((todo) => !todo.completed)
  setTodoes(updatedTodoes)
}

const handleDownload = async () => {

    const text = JSON.stringify(todoes, null, 2)
    const file = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'todoes.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setTimeout(() => URL.revokeObjectURL(url), 100)
setTimeout(() => alert('Your file has been downloaded successfully'), 3000 )
  

}


return (
  
     <div className="container w-[33vw] min-w-125 border border-[#2b3242] rounded-xl relative mx-auto mt-14 shrink">

      <div className="header flex flex-col gap-1 p-6 px-7 bg-[#1b212c]">
        <span className="text-[#e0a63d] text-sm">
          DAILY WORK ORDER
        </span>

        <div className="flex justify-between">
          <h1 className="text-[1.6rem] font-sans font-semibold">
            Tasks
          </h1>

          <span className="text-[#5b6478] text-sm">
            {dateInfo.day &&
              `${dateInfo.day}, ${dateInfo.month} ${dateInfo.date}`}
          </span>
        </div>

        <div className="flex gap-4 px-1 py-3">
          <div className="flex flex-col">
            <strong className="text-[#e0a63d]" suppressHydrationWarning>
              {openCount}
            </strong>

            <span className="text-[#5b6478] tracking-wider uppercase text-[10px]">
              Open
            </span>
          </div>

          <div className="flex flex-col">
            <strong className="text-[#5fa88a]" suppressHydrationWarning>
              {doneCount}
            </strong>

            <span className="text-[#5b6478] tracking-wider uppercase text-[10px]">
              Done
            </span>
          </div>

          <div className="flex flex-col">
            <strong className="text-white" suppressHydrationWarning>
              {todoes.length}
            </strong>

            <span className="text-[#5b6478] tracking-wider uppercase text-[10px]">
              Total
            </span>
          </div>
        </div>

        <div className="h-2 w-[90%] mx-auto rounded-xl bg-[#5b6478]/10 overflow-hidden" suppressHydrationWarning>
          <div
            className="h-full rounded-xl bg-[#5fa88a] transition-all duration-300"
            style={{
              width:
                todoes.length > 0
                  ? `${(doneCount / todoes.length) * 100}%`
                  : '0%',
            }}
          />
        </div>
      </div>

      <div className="middle bg-[#212836] p-6 px-8 border border-[#2b3242]">
        <div className="flex w-full">
          <input
            type="text"
            value={value}
            placeholder="Add A Task..."
            className="border-b-2 transition-all duration-300 pb-1 border-b-white/20 w-full focus:outline-none focus:border-b-[#e0a63d] bg-transparent"
            ref={ref}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleEnter}
          />

          <button
            type="button"
            className="h-9.5 w-10 rounded-full bg-[#e0a63d] hover:bg-[#e0a63d]/80 text-black cursor-pointer ml-2 text-xl"
            onClick={addTodo}
          >
            {editingId !== null ? '✓' : '+'}
          </button>
        </div>

        <div className="flex items-center gap-2 mt-4">

          <button
            type="button"
            onClick={() => setPriority('LOW')}
            className={`text-xs border-2 rounded-full px-2 py-1 cursor-pointer transition-all duration-200 ${
              priority === 'LOW'
                ? 'border-white/40 bg-white/10 text-white'
                : 'border-[#2b3242] text-[#5b6478] hover:border-white/20 hover:text-white/70'
            }`}
          >
            LOW
          </button>

          <button
            type="button"
            onClick={() => setPriority('MED')}
            className={`text-xs border-2 rounded-full px-2 py-1 cursor-pointer transition-all duration-200 ${
              priority === 'MED'
                ? 'border-[#e0a63d]/50 bg-[#e0a63d]/10 text-[#e0c56f]'
                : 'border-[#2b3242] text-[#5b6478] hover:border-[#e0a63d]/30 hover:text-[#e0c56f]/70'
            }`}
          >
            MED
          </button>

          <button
            type="button"
            onClick={() => setPriority('HIGH')}
            className={`text-xs border-2 rounded-full px-2 py-1 cursor-pointer transition-all duration-200 ${
              priority === 'HIGH'
                ? 'border-red-400/50 bg-red-400/10 text-red-300'
                : 'border-[#2b3242] text-[#5b6478] hover:border-red-400/30 hover:text-red-300/70'
            }`}
          >
            HIGH
          </button>

        </div>
      </div>

      <div className="Bottom bg-[#1b212c] border border-[#2b3242]">

        <div className="flex gap-4 items-center p-6 px-7 py-4">

          <button
            ref={allRef}
            type="button"
            onClick={() => setFilter('ALL')}
            className={`border-b text-xs tracking-wider rounded-lg p-1.5 px-3 cursor-pointer focus:outline-none ${
              filter === 'ALL'
                ? 'border-b-[#e0a63d] text-[#e0a63d]'
                : 'border-b-[#1b212c] text-[#5b6478]'
            }`}
          >
            ALL
          </button>

          <button
            type="button"
            onClick={() => setFilter('ACTIVE')}
            className={`border-b text-xs tracking-wider rounded-lg p-1.5 px-3 cursor-pointer focus:outline-none ${
              filter === 'ACTIVE'
                ? 'border-b-[#e0a63d] text-[#e0a63d]'
                : 'border-b-[#1b212c] text-[#5b6478]'
            }`}
          >
            ACTIVE
          </button>

          <button
            type="button"
            onClick={() => setFilter('COMPLETED')}
            className={`border-b text-xs tracking-wider rounded-lg p-1.5 px-3 cursor-pointer focus:outline-none ${
              filter === 'COMPLETED'
                ? 'border-b-[#e0a63d] text-[#e0a63d]'
                : 'border-b-[#1b212c] text-[#5b6478]'
            }`}
          >
            COMPLETED
          </button>

        </div>

        <div className="border border-[#2b3242] w-full p-6 px-7" >

          {filteredTodos.length > 0 ? (

            <ul className="flex flex-col gap-3" >

              {filteredTodos.map((todo, index) => (

                <li
                  key={todo.id}
                  className="flex items-center gap-3 rounded-lg border border-[#2b3242] bg-[#1b212c] p-3 shadow-sm transition hover:border-[#3a4355]"
                >

                  <button
                    type="button"
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
                      todo.completed
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-[#5b6478] bg-transparent text-transparent'
                    }`}
                    aria-label="Mark task complete"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </button>

                  <span className="shrink-0 text-xs font-semibold text-[#5b6478]">
                    T-{String(index + 1).padStart(3, '0')}
                  </span>

                  <div className="min-w-0 flex-1">

                    <p
                      className={`truncate text-sm font-medium ${
                        todo.completed
                          ? 'line-through text-[#5b6478]'
                          : 'text-white'
                      }`}
                    >
                      {todo.text}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityStyle(
                          todo.priority
                        )}`}
                      >
                        {todo.priority}
                      </span>
                    </div>

                  </div>

                  <div className="flex shrink-0 items-center gap-1">

                    <button
                      type="button"
                      className="rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600 focus:outline-none"
                      aria-label="Edit task"
                      onClick={() =>
                        handleEditClick(
                          todo.id,
                          todo.text,
                          todo.priority
                        )
                      }
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="rounded-md p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none"
                      aria-label="Delete task"
                      onClick={() => handleDelete(todo.id)}
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                      </svg>
                    </button>

                  </div>

                </li>

              ))}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleDownload}
                  className="mx-auto px-6 rounded-lg text-[#e0c56f] border border-[#e0a63d]/30 font-medium text-sm py-2 transition-all duration-500 hover:-translate-y-2 hover:cursor-pointer hover:bg-[#e0a63d]/10 hover:border-[#e0a63d] hover:text-white hover:shadow-[0_0_20px_rgba(224,166,61,0.2)]"
                >
                  Download Your Todos
                </button>
               
              </div>

            </ul>

          ) : (

            
  <div className="empty-state flex flex-col mx-auto text-center items-center gap-2 py-15 text-[#5b6478]">

              <svg
                className="h-9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>

              <p className="text-sm">
                Nothing on the log. Add your first task
                <br />
                above.
              </p>
</div>

          )}
          <div className="flex justify-between items-center mt-6 text-[#5b6478] text-sm">
  <samp>
  {todoes.length} items left
  </samp>
  <samp onClick={handleDeleteCompleted}>Clear Completed</samp>
 
</div>

        </div>

      </div>

    </div>

  )
}

export default Page