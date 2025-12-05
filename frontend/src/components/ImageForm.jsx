import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ImageForm.css'

function ImageForm() {
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过10MB')
        return
      }

      setImageFile(file)
      
      // 创建预览
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!imageFile) {
      alert('请选择一张图片')
      return
    }

    setIsSubmitting(true)

    // 将图片转换为base64（临时方案，实际应该上传到服务器）
    const reader = new FileReader()
    reader.onloadend = async () => {
      const imageData = reader.result

      const imagePost = {
        id: Date.now(),
        description: description.trim(),
        image: imageData,
        type: 'image',
        createdAt: new Date().toISOString()
      }

      // 保存到本地存储（临时方案）
      const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]')
      existingPosts.unshift(imagePost)
      localStorage.setItem('posts', JSON.stringify(existingPosts))

      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))

      setIsSubmitting(false)
      alert('图片发布成功！')
      navigate('/')
    }
    reader.readAsDataURL(imageFile)
  }

  return (
    <div className="image-form-container">
      <div className="form-card">
        <h2>发布图片</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image">选择图片</label>
            <div className="image-upload-area">
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="预览" className="image-preview" />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label htmlFor="image-input" className="image-upload-label">
                  <div className="upload-icon">📷</div>
                  <div>点击或拖拽图片到这里</div>
                  <div className="upload-hint">支持 JPG、PNG、GIF，最大10MB</div>
                </label>
              )}
              <input
                type="file"
                id="image-input"
                accept="image/*"
                onChange={handleFileChange}
                className="image-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">描述（可选）</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="为这张图片添加描述..."
              className="form-textarea"
              rows={4}
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
              disabled={isSubmitting || !imageFile}
            >
              {isSubmitting ? '发布中...' : '发布'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ImageForm
