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
        <TimeSpanInput value={70} onChangeValue={handleChange}/>
        <TimeSpanInput onChangeValue={handleChange}/>
        <TimeSpanInput value={NaN} onChangeValue={handleChange}/>
        <TimeSpanInput value='' onChangeValue={handleChange}/>
      </div>
      <p>Some text Some text Some text Some text Some text</p>
    </>
  )
}

export default App
