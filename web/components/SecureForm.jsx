// 苹果风格安全表单组件
import { useState, useEffect } from 'react';
import { YouTubeSubmissionSchema } from '../lib/security';

export default function SecureForm() {
  const [formData, setFormData] = useState({
    url: '',
    email: '',
    _honeypot: '', // Honeypot字段，对用户隐藏
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [submitCount, setSubmitCount] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // 获取CSRF Token
  useEffect(() => {
    fetch('/api/csrf-token')
      .then(res => res.json())
      .then(data => setCsrfToken(data.token))
      .catch(err => console.error('Failed to get CSRF token:', err));
  }, []);
  
  // 客户端输入验证
  const validateInput = (name, value) => {
    try {
      if (name === 'url') {
        YouTubeSubmissionSchema.shape.url.parse(value);
      } else if (name === 'email') {
        YouTubeSubmissionSchema.shape.email.parse(value);
      }
      return null;
    } catch (error) {
      return error.issues[0]?.message || '输入格式错误';
    }
  };
  
  // 实时验证
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // 更新表单数据
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 实时验证
    const error = validateInput(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  // 防止快速重复提交
  const canSubmit = () => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    
    // 5秒内不能重复提交
    if (timeSinceLastSubmit < 5000) {
      return false;
    }
    
    // 每分钟最多3次提交
    if (submitCount >= 3 && timeSinceLastSubmit < 60000) {
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canSubmit()) {
      setErrors({ submit: '提交过于频繁，请稍后再试' });
      return;
    }
    
    if (!csrfToken) {
      setErrors({ submit: '安全验证失败，请刷新页面重试' });
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // 客户端完整验证
      const validationResult = YouTubeSubmissionSchema.safeParse({
        ...formData,
        csrfToken
      });
      
      if (!validationResult.success) {
        const newErrors = {};
        validationResult.error.issues.forEach(issue => {
          const field = issue.path[0];
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
        return;
      }
      
      // 提交数据
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(validationResult.data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        if (result.details) {
          // 服务器验证错误
          const newErrors = {};
          result.details.forEach(detail => {
            newErrors[detail.field] = detail.message;
          });
          setErrors(newErrors);
        } else {
          setErrors({ submit: result.message || '提交失败' });
        }
        return;
      }
      
      // 提交成功
      setFormData({ url: '', email: '', _honeypot: '' });
      setErrors({});
      setSubmitCount(prev => prev + 1);
      setLastSubmitTime(Date.now());
      setShowSuccess(true);
      
      // 3秒后隐藏成功消息
      setTimeout(() => setShowSuccess(false), 5000);
      
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: '网络错误，请检查连接后重试' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (showSuccess) {
    return (
      <div className="card text-center fade-in">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-semibold text-primary mb-4">
          提交成功！
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          我们正在分析您的视频，预览结果将在5分钟内发送到您的邮箱。
          <br />
          请留意查收邮件（包括垃圾邮件文件夹）。
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="text-3xl mr-3">📧</div>
            <div>
              <h4 className="font-semibold text-primary">接下来的步骤</h4>
              <p className="text-sm text-gray-600">
                查收预览邮件 → 评估效果 → 满意后支付¥6.66 → 获得完整结果
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowSuccess(false)}
          className="btn btn-secondary"
        >
          处理另一个视频
        </button>
      </div>
    );
  }
  
  return (
    <div id="form" className="card">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-primary mb-2">
          免费预览处理
        </h3>
        <p className="text-gray-600">
          提交YouTube链接，立即获得免费分析预览
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* YouTube URL输入 */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            YouTube视频链接 *
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`input ${errors.url ? 'border-red-500' : ''}`}
            required
            disabled={isSubmitting}
          />
          {errors.url && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.url}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            支持所有有英文字幕的YouTube视频
          </p>
        </div>
        
        {/* 邮箱输入 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            邮箱地址 *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            required
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.email}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            预览结果将发送到此邮箱
          </p>
        </div>
        
        {/* Honeypot字段 - 隐藏 */}
        <input
          type="text"
          name="_honeypot"
          value={formData._honeypot}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          tabIndex="-1"
          autoComplete="off"
        />
        
        {/* 流程说明 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-3 flex items-center">
            <span className="mr-2">🔍</span>
            处理流程
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="w-5 h-5 bg-primary text-secondary rounded-full text-xs flex items-center justify-center mr-3 flex-shrink-0">1</span>
              <span>免费检查视频和字幕可用性</span>
            </div>
            <div className="flex items-center">
              <span className="w-5 h-5 bg-primary text-secondary rounded-full text-xs flex items-center justify-center mr-3 flex-shrink-0">2</span>
              <span>生成预览样本（前3-5分钟翻译）</span>
            </div>
            <div className="flex items-center">
              <span className="w-5 h-5 bg-primary text-secondary rounded-full text-xs flex items-center justify-center mr-3 flex-shrink-0">3</span>
              <span>邮件发送预览 + 付费链接（¥6.66）</span>
            </div>
            <div className="flex items-center">
              <span className="w-5 h-5 bg-primary text-secondary rounded-full text-xs flex items-center justify-center mr-3 flex-shrink-0">4</span>
              <span>满意后付费，24小时内交付完整结果</span>
            </div>
          </div>
        </div>
        
        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isSubmitting || !canSubmit() || !csrfToken}
          className={`btn btn-primary w-full py-4 text-lg ${
            isSubmitting || !canSubmit() || !csrfToken
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="loading-spinner mr-3"></div>
              正在分析视频...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <span className="mr-2">🚀</span>
              获取免费预览
            </span>
          )}
        </button>
        
        {/* 错误信息 */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm flex items-center">
              <span className="mr-2">❌</span>
              {errors.submit}
            </p>
          </div>
        )}
        
        {/* 速率限制提示 */}
        {submitCount >= 2 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-700 text-sm flex items-center">
              <span className="mr-2">⏱️</span>
              为防止滥用，每分钟最多提交3次请求
            </p>
          </div>
        )}
        
        {/* 安全和隐私说明 */}
        <div className="border-t border-gray-100 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              SSL加密传输
            </div>
            <div className="flex items-center justify-center text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              数据不存储
            </div>
            <div className="flex items-center justify-center text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              隐私保护
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}