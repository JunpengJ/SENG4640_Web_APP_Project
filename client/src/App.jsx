import { useState } from 'react'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import ProductList from './components/ProductList'
import './App.css'
import './components/Home.css'

function App() {

  return(
        <div>
            <Navbar />
            <Banner />
            <ProductList />
        </div>
    );
}

export default App
