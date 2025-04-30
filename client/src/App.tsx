import { useState, useRef, useEffect } from 'react'
import './App.css'

interface TodoItem {
  content: string;
  id: number;
  due: string;
  description: string;
  checked: boolean;
  timer?: {
    hours: string;
    minutes: string;
    seconds: string;
  };
}

function App() {
  // Timer states
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const intervalRef = useRef<number | null>(null)

  // Todo states
  const [text, setText] = useState("")
  const [data, setData] = useState<TodoItem[]>([])
  const [popup, setPopup] = useState<number | null>(null)
  const [descNum, setDescNum] = useState<number | null>(null)
  const [date, setDate] = useState("")
  const [desc, setDesc] = useState("")
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (isFinished) {
      alert("Time's up")
      setIsFinished(false)
    }
  }, [isFinished])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popup !== null && !(event.target as HTMLElement).closest('.popup-menu')) {
        setPopup(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popup]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const num = parseInt(value)
    const formattedValue = num < 10 ? `0${num}` : String(num)

    setTime(prev => ({
      ...prev,
      [name]: formattedValue
    }))
  }

  const startTimer = () => {
    if (intervalRef.current !== null) return

    setIsRunning(true)
    intervalRef.current = window.setInterval(() => {
      setTime(prev => {
        let hours = parseInt(prev.hours)
        let minutes = parseInt(prev.minutes)
        let seconds = parseInt(prev.seconds)

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          intervalRef.current = null
          setIsFinished(true)
          return prev
        }

        return {
          hours: hours < 10 ? `0${hours}` : String(hours),
          minutes: minutes < 10 ? `0${minutes}` : String(minutes),
          seconds: seconds < 10 ? `0${seconds}` : String(seconds)
        }
      })
    }, 1000)
  }

  const resetTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setTime({
      hours: '00',
      minutes: '00',
      seconds: '00'
    })
  }

  const stopTimer = () => {
    if (intervalRef.current === null) return
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsRunning(false)
  }

  const update = () => {
    if (text !== "") {
      setData([
        ...data,
        {
          id: data.length,
          content: text,
          due: date,
          description: desc,
          checked: false,
          timer: time // Add current timer settings to todo item
        },
      ])
    }
    setText("")
    setDate("")
    setDesc("")
    resetTimer()
  }

  const handleCheck = (id: number) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const showPopup = (id: number) => {
    setPopup(popup === id ? null : id);  // Toggle popup
  }

  return (
    <div className="min-h-screen bg-white-900">
      {/* Timer Section */}
      <div className='text-center text-6xl py-10 font-bold'>Topping Timer!</div>
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white-800 p-8 mb-8"> {/* Removed shadow-xl and rounded-lg */}
          <div className='flex flex-row justify-center items-center'>
            <input
              type="number"
              name="hours"
              min={0}
              max={23}
              value={time.hours}
              onChange={handleChange}
              disabled={isRunning}
              style={{ width: '50px' }}
              className={`mx-1 text-5xl`}
            />
            <input
              type="number"
              name="minutes"
              min={0}
              max={59}
              value={time.minutes}
              onChange={handleChange}
              disabled={isRunning}
              style={{ width: '50px' }}
              className={`mx-1 text-5xl`}
            />
            <input
              type="number"
              name="seconds"
              min={0}
              max={59}
              value={time.seconds}
              onChange={handleChange}
              disabled={isRunning}
              style={{ width: '50px' }}
              className={`mx-1 text-5xl`}
            />
          </div>
          <div className='flex flex-row justify-center items-center text-white mt-4'>
            <button onClick={startTimer} disabled={isRunning} className={`bg-blue-500 rounded-lg mx-2 p-1 my-2`}>
              Start
            </button>
            <button onClick={stopTimer} disabled={!isRunning} className={`bg-blue-500 rounded-lg mx-2 p-1 my-2`}>
              Stop
            </button>
            <button onClick={resetTimer} className={`bg-blue-500 rounded-lg mx-2 p-1 my-2`}>
              Reset
            </button>
          </div>
        </div>

        {/* Todo Section */}
        <div className="bg-white-800 p-8"> {/* Removed shadow-xl and rounded-lg */}
          <div className="flex justify-between mb-4">
            <input
              className="bg-white-700  px-4 py-2 rounded-lg flex-1 mr-4"
              type="text"
              value={text}
              placeholder="Add a new task..."
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
              onClick={update}
            >
              Add Task
            </button>
          </div>

          <ul className="space-y-4">
            {data.filter(item => item.content.includes(query)).map((item) => (
              <li key={item.id} className="bg-white-700 p-4 rounded-lg flex items-center relative"> {/* Add relative positioning */}
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheck(item.id)}
                  className="mr-4"
                />
                <div className="flex-1">
                  <p className={` ${item.checked ? 'line-through' : ''}`}>
                    {item.content}
                  </p>
                </div>
                <button
                  onClick={() => showPopup(item.id)}
                  className="text-gray-600 hover:text-gray-800 px-2"
                >
                  •••
                </button>

                {popup === item.id && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white z-10 popup-menu"> {/* Removed shadow-lg, rounded-md, and ring styles */}
                    <div className="py-1">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setData(prevData => prevData.filter(x => x.id !== item.id));
                          setPopup(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
