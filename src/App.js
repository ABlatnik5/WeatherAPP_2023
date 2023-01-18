import './App.css';
import MapChart from './components/MapChart';
import City from './components/City';
import Navigation from './components/Navigation';
import {
  BrowserRouter as Router,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";
import Favorite from './components/Favorite';

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation></Navigation>
        <div className="container">
          <Routes>
            <Route path="/" element={<MapChart />} />
            <Route path="city/:cityId" element={<City />} />
            <Route path="favorite" element={<Favorite />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
