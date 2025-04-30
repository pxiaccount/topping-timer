import { useRef, useState } from 'react'
import './App.css'

function App() {
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)
  const [second, setSecond] = useState(0)

  const handleKeyDown = (e, setter) => {
    if (e.key >= '0' && e.key <= '9') {
      const newValue = Math.max(0, Math.min(59, parseInt(e.target.value + e.key, 10)))
      setter(newValue)
      e.preventDefault() // Prevent default to avoid double input
    }
  }

  return (
    <>
      <div className="timer">
        <input
          type='number'
          value={hour === 0 ? "00" : hour}
          onChange={(e) => setHour(Math.max(0, Math.min(59, parseInt(e.target.value, 10))))}
          onKeyDown={(e) => handleKeyDown(e, setHour)}
          min={0}
          max={59}
          className="h p-2 w-10 border rounded-lg mx-1"
        />
        <input
          type='number'
          value={minute === 0 ? "00" : minute}
          onChange={(e) => setMinute(Math.max(0, Math.min(59, parseInt(e.target.value, 10))))}
          onKeyDown={(e) => handleKeyDown(e, setMinute)}
          min={0}
          max={59}
          className="m p-2 w-10 border rounded-lg mx-1"
        />
        <input
          type='number'
          value={second === 0 ? "00" : second}
          onChange={(e) => setSecond(Math.max(0, Math.min(59, parseInt(e.target.value, 10))))}
          onKeyDown={(e) => handleKeyDown(e, setSecond)}
          min={0}
          max={59}
          className="s p-2 w-10 border rounded-lg mx-1"
        />
      </div>
    </>
  )
}

export default App