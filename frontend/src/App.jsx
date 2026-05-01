import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RideResults from './pages/RideResults';
import BookRide from './pages/BookRide';
import PostRide from './pages/driver/PostRide';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rides" element={<RideResults />} />
        <Route path="/book/:id" element={<BookRide />} />
        <Route path="/driver/post" element={<PostRide />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
