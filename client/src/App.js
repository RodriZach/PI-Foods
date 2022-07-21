import './App.css';
import React from 'react';
import Inicio from './components/Inicio/inicio.jsx';
import Home from './components/Home/home';
import { Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Route exact path='/'>
        <Inicio />
      </Route>
      <Route path='/home'>
        <Home />
      </Route>
    </div>
  );
}

export default App;
