import './App.css'
import { TimeSpanInput, DateInput } from 'lib'
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
      <div>
        <TimeSpanInput value={70} onChange={handleChange}/>
        <TimeSpanInput onChange={handleChange}/>
        <TimeSpanInput value={NaN} onChange={handleChange}/>
        <TimeSpanInput value='' onChange={handleChange}/>
      </div>
      <p>Some text Some text Some text Some text Some text</p>

      <div>
        <DateInput value={date1} onChange={handleDateChange}/>
      </div>
    </>
  )
}

export default App
