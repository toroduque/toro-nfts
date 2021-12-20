import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/main"
import Home from "./views/Home";
import Toros from "./views/Toros";
import Toro from "./views/Toro";
import './App.css';

function App() {

  return (
    <MainLayout>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/toros" exact element={<Toros />} />
        <Route path="/toros/:tokenId" exact element={<Toro />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
