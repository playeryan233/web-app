import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import ArticleForm from './components/ArticleForm'
import ImageForm from './components/ImageForm'
import Feed from './components/Feed'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/article/new" element={<ArticleForm />} />
            <Route path="/image/new" element={<ImageForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function Navbar() {
  const navigate = useNavigate()
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h1>个人空间</h1>
        </Link>
        <div className="navbar-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/article/new')}
          >
            发布文章
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/image/new')}
          >
            发布图片
          </button>
        </div>
      </div>
    </nav>
  )
}

export default App
