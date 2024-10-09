import { Routes, Route } from 'react-router-dom';
import CommentSection from './components/CommentSection';

function App() {
  return (
    <div className='flex max-w-6xl mx-auto'>
      <Routes>
        <Route path='/' element={<CommentSection />} />
      </Routes>
    </div>
  )
}

export default App
