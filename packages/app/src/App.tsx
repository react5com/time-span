import './App.css'
import { TimeSpanInput, DateInput, TimeInput } from 'lib'
import 'lib/dist/index.css'
import { useState } from 'react'

function App() {
  const [date1, setDate1] = useState(new Date());
  const handleChange = (value: number) => {
    console.log(value)
  }
  const handleDateChange = (value: Date) => {
    console.log(value);
    setDate1(value);
  }
  return (
    <>
      <h2>Time span</h2>
      <div>
        <TimeSpanInput value={70} onChange={handleChange}/>
        <TimeSpanInput onChange={handleChange}/>
        <TimeSpanInput value={NaN} onChange={handleChange}/>
        <TimeSpanInput value='' onChange={handleChange}/>
      </div>
      <p>Some text Some text Some text Some text Some text</p>

      <h2>Date</h2>
      <div>
        <DateInput value={date1} onChange={handleDateChange}/>
      </div>

      <h2>Time</h2>
      <div>
        <TimeInput value={70} onChange={handleChange}/>
        <TimeInput onChange={handleChange}/>
        <TimeInput value={NaN} onChange={handleChange}/>
        <TimeInput value='' onChange={handleChange}/>
      </div>
    </>
  )
}

export default App
