import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BackendProvider } from './context/BackendContext';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Feed from './pages/Feed';
import Evaluate from './pages/Evaluate';
import IdeaDetails from './pages/IdeaDetails';
import Leaderboard from './pages/Leaderboard';
import Community from './pages/Community';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <AuthProvider>
      <BackendProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/evaluate" element={<Evaluate />} />
            <Route path="/idea/:id" element={<IdeaDetails />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
          </Routes>
        </Router>
      </BackendProvider>
    </AuthProvider>
  );
}

export default App;
