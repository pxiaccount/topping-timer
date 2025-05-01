import { useState, useRef, useEffect } from 'react'
import './App.css'

interface Sticker {
  id: number;
  type: string;
  x: number;
  y: number;
  size: number;
}

interface StickerMenuProps {
  onAddSticker: (type: string) => void;
  stickerTypes: readonly string[];
  onImageUpload: (file: File) => void;
}

interface TodoItem {
  id: number;
  content: string;
  due: string;
  description: string;
  checked: boolean;
  timer: {
    hours: string;
    minutes: string;
    seconds: string;
  };
}

const StickerMenu: React.FC<StickerMenuProps> = ({ onAddSticker, stickerTypes, onImageUpload }) => {
  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white-800 p-4 flex flex-col gap-2 border-2 rounded-lg border-gray-500">
      {stickerTypes.map(type => (
        <button
          key={type}
          onClick={() => onAddSticker(type)}
          className="w-12 h-12 hover:opacity-80"
        >
          <img
            src={`/stickers/${type}`}
            alt={type}
            className="w-full h-full object-contain"
            draggable={false}
          />
        </button>
      ))}
    </div>
  )
}

function App() {
  const [stickers, setStickers] = useState<Sticker[]>(() => {
    const saved = localStorage.getItem('stickers')
    return saved ? JSON.parse(saved) : []
  })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<{ id: number | null; startX: number; startY: number }>({
    id: null,
    startX: 0,
    startY: 0
  })

  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ id: number | null; startSize: number; startY: number }>({
    id: null,
    startSize: 0,
    startY: 0
  });

  const STICKER_TYPES = [
    'star.png',
    'heart.png',
    'smile.png',
  ] as const

  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const [text, setText] = useState("")
  const [data, setData] = useState<TodoItem[]>(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos)
        return parsedTodos.map((todo: TodoItem) => ({
          ...todo,
          timer: todo.timer || {
            hours: '00',
            minutes: '00',
            seconds: '00'
          }
        }))
      } catch (error) {
        console.error('Error loading todos:', error)
        localStorage.removeItem('todos')
        return []
      }
    }
    return []
  })
  const [popup, setPopup] = useState<number | null>(null)
  const [date, setDate] = useState("")
  const [desc, setDesc] = useState("")
  const [customColor, setCustomColor] = useState("#ffffff")

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

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(data))
    } catch (error) {
      console.error('Error saving todos:', error)
    }
  }, [data])

  useEffect(() => {
    localStorage.setItem('stickers', JSON.stringify(stickers))
  }, [stickers])

  useEffect(() => {
    const savedColor = localStorage.getItem('bgColor')
    if (savedColor) {
      setCustomColor(savedColor)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('bgColor', customColor)
  }, [customColor])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const num = parseInt(value)
    const formattedValue = num < 10 ? `0${num}` : String(num)

    setTime(prev => ({
      ...prev,
      [name]: formattedValue
    }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStickers(prev => [...prev, {
            id: Date.now(),
            type: event.target.result as string,
            x: e.clientX,
            y: e.clientY,
            size: 48
          }]);
        }
      };
      reader.readAsDataURL(file);
    }
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
          timer: time
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
    setPopup(popup === id ? null : id);
  }

  const handleStickerDragStart = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    setIsDragging(true)
    const sticker = stickers.find(s => s.id === id)
    if (!sticker) return

    dragRef.current = {
      id,
      startX: e.clientX - sticker.x,
      startY: e.clientY - sticker.y
    }
  }

  const handleStickerDrag = (e: React.MouseEvent) => {
    if (!isDragging || dragRef.current.id === null) return

    setStickers(prev => prev.map(sticker => {
      if (sticker.id === dragRef.current.id) {
        return {
          ...sticker,
          x: e.clientX - dragRef.current.startX,
          y: e.clientY - dragRef.current.startY
        }
      }
      return sticker
    }))
  }

  const handleStickerDragEnd = () => {
    setIsDragging(false)
    dragRef.current.id = null
  }

  const handleResizeStart = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    const sticker = stickers.find(s => s.id === id);
    if (!sticker) return;

    resizeRef.current = {
      id,
      startSize: sticker.size || 48,
      startY: e.clientY
    };
  };

  const handleResize = (e: React.MouseEvent) => {
    if (!isResizing || resizeRef.current.id === null) return;

    const deltaY = e.clientY - resizeRef.current.startY;
    const newSize = Math.max(24, Math.min(200, resizeRef.current.startSize + deltaY));

    setStickers(prev => prev.map(sticker => {
      if (sticker.id === resizeRef.current.id) {
        return {
          ...sticker,
          size: newSize
        };
      }
      return sticker;
    }));
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    resizeRef.current.id = null;
  };

  const addSticker = (type: string) => {
    setStickers(prev => [...prev, {
      id: Date.now(),
      type,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      size: 48
    }]);
  };

  const deleteSticker = (id: number) => {
    setStickers(prev => prev.filter(sticker => sticker.id !== id))
  }

  return (
    <div
      className={`min-h-screen relative`}
      onMouseMove={(e) => {
        handleStickerDrag(e);
        handleResize(e);
      }}
      style={{
        backgroundColor: customColor,
        color: customColor === '#ffffff' ? '#000000' : '#ffffff'
      }}
      onMouseUp={() => {
        handleStickerDragEnd();
        handleResizeEnd();
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="absolute top-4 left-4">
        <input
          type="color"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
          title="Change background color"
        />
      </div>
      <div className='text-center text-6xl py-10 font-bold'>Topping Timer!</div>
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white-800 p-8 mb-8">
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

        <div className="bg-white-800 p-8">
          <div className="flex justify-between mb-4">
            <input
              className="bg-white-700  px-4 py-2 rounded-lg flex-1 mr-4"
              type="text"
              value={text}
              style={{
                backgroundColor: customColor,
                color: customColor === '#ffffff' ? '#000000' : '#ffffff'
              }}
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
            {data.filter(item => item.content).map((item) => (
              <li key={item.id} className="bg-white-700 p-4 rounded-lg flex items-center relative">
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
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white z-10 popup-menu">
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

      <StickerMenu
        onAddSticker={addSticker}
        stickerTypes={STICKER_TYPES}
        onImageUpload={(file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              addSticker(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        }}
      />

      {
        stickers.map(sticker => (
          <div
            key={sticker.id}
            className="absolute cursor-move group"
            style={{
              left: `${sticker.x}px`,
              top: `${sticker.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: isDragging && dragRef.current.id === sticker.id ? 1000 : 1,
            }}
            onMouseDown={(e) => handleStickerDragStart(e, sticker.id)}
          >
            <div className="relative border-2 border-transparent hover:border-gray-500 transition-colors">
              <img
                src={sticker.type.startsWith('data:') ? sticker.type : `/stickers/${sticker.type}`}
                alt="sticker"
                className="select-none object-contain"
                style={{
                  width: `${sticker.size}px`,
                  height: `${sticker.size}px`
                }}
                draggable={false}
              />
              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 
                 flex items-center justify-center text-xs 
                 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSticker(sticker.id);
                }}
              >
                ×
              </button>
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize
                 opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => handleResizeStart(e, sticker.id)}
              >
                <div className="w-2 h-2 bg-white rounded-full transform translate-x-1 translate-y-1" />
              </div>
            </div>
          </div>
        ))
      }
    </div >
  )
}

export default App
