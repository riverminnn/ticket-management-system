import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './App.css'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
function App() {
  return (
    <div className=''>
      <FontAwesomeIcon icon={faCoffee} />
      <h1 className="text-2xl font-bold underline bg-blue-800">
        Hello world!
      </h1>
    </div>
  )
}
export default App 