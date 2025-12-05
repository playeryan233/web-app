import { useState, useEffect } from 'react'
import './Feed.css'

function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从本地存储加载文章和图片
    const loadPosts = () => {
      const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]')
      // 按时间倒序排列
      const sortedPosts = savedPosts.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
      setPosts(sortedPosts)
      setLoading(false)
    }

    loadPosts()

    // 监听存储变化（如果多个标签页打开）
    const handleStorageChange = () => {
      loadPosts()
    }
    window.addEventListener('storage', handleStorageChange)
    
    // 定期检查（用于同一标签页内的更新）
    const interval = setInterval(loadPosts, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="feed-container">
        <div className="loading">加载中...</div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="feed-container">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>还没有内容</h3>
          <p>发布你的第一篇文章或图片吧！</p>
        </div>
      </div>
    )
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2>动态</h2>
        <span className="post-count">{posts.length} 条内容</span>
      </div>
      
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            {post.type === 'article' ? (
              <ArticlePost post={post} formatDate={formatDate} />
            ) : (
              <ImagePost post={post} formatDate={formatDate} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ArticlePost({ post, formatDate }) {
  return (
    <>
      <div className="post-header">
        <span className="post-type">📄 文章</span>
        <span className="post-date">{formatDate(post.createdAt)}</span>
      </div>
      <h3 className="post-title">{post.title}</h3>
      <div className="post-content">{post.content}</div>
    </>
  )
}

function ImagePost({ post, formatDate }) {
  return (
    <>
      <div className="post-header">
        <span className="post-type">🖼️ 图片</span>
        <span className="post-date">{formatDate(post.createdAt)}</span>
      </div>
      {post.image && (
        <div className="post-image-container">
          <img src={post.image} alt={post.description || '图片'} className="post-image" />
        </div>
      )}
      {post.description && (
        <div className="post-description">{post.description}</div>
      )}
    </>
  )
}

export default Feed
