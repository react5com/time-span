import './App.css'
import { TimeSpanInput } from 'lib'
import 'lib/dist/index.css'

function App() {
  const handleChange = (value: number) => {
    console.log(value)
  }
  return (
    <>
      <TimeSpanInput value={70} onChange={handleChange}/>
    </>
  )
}

export default App
