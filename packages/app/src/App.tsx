import './App.css'
import { TimeSpanInput } from 'lib'
import 'lib/dist/index.css'

function App() {
  const handleChange = (value: number) => {
    console.log(value)
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
    </>
  )
}

export default App
