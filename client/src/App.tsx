import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DataGridView from './views/DataGridView'
import ShowDetailsComponent from './components/ShowDetailsComponent'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DataGridView />} />
        <Route path="/details/:tableName/:id" element={<ShowDetailsComponent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
