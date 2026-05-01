import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RideResults from './pages/RideResults';
import BookRide from './pages/BookRide';
import PostRide from './pages/driver/PostRide';
import Wallet from './pages/driver/Wallet';
import ActiveRides from './pages/driver/ActiveRides';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/results' element={<RideResults />} />
        <Route path='/book' element={<BookRide />} />
        <Route path='/driver/post' element={<PostRide />} />
        <Route path='/driver/wallet' element={<Wallet />} />
        <Route path='/driver/rides' element={<ActiveRides />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;