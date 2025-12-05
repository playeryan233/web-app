import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ArticleForm.css'

function ArticleForm() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容')
      return
    }

    setIsSubmitting(true)
    
    // 这里将来可以调用后端API
    const article = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      type: 'article',
      createdAt: new Date().toISOString()
    }

    // 保存到本地存储（临时方案）
    const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]')
    existingPosts.unshift(article)
    localStorage.setItem('posts', JSON.stringify(existingPosts))

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    setIsSubmitting(false)
    alert('文章发布成功！')
    navigate('/')
  }

  return (
    <div className="article-form-container">
      <div className="form-card">
        <h2>发布文章</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">标题</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入文章标题"
              className="form-input"
              maxLength={100}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">内容</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入文章内容..."
              className="form-textarea"
              rows={15}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => navigate('/')}
            >
              取消
            </button>
            <button
              type="submit"
              className="btn btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? '发布中...' : '发布'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ArticleForm
