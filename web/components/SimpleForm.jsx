// 简化的YouTube提交表单
import { useState } from 'react';
import { YouTubeSubmissionSchema } from '../lib/validation';

export default function SimpleForm() {
  const [formData, setFormData] = useState({
    url: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  
  // 输入验证
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
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // 客户端验证
      const validationResult = YouTubeSubmissionSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const newErrors = {};
        validationResult.error.issues.forEach(issue => {
          const field = issue.path[0];
          newErrors[field] = issue.message;
        });
        setErrors(newErrors);
        return;
      }
      
      // 提交到API
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validationResult.data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        if (result.details) {
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
      setFormData({ url: '', email: '' });
      setErrors({});
      setSubmitCount(prev => prev + 1);
      setShowSuccess(true);
      
      // 5秒后隐藏成功页面
      setTimeout(() => setShowSuccess(false), 8000);
      
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: '网络错误，请检查连接后重试' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 成功页面
  if (showSuccess) {
    return (
      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto', 
        padding: '2rem', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#000', marginBottom: '1rem' }}>
          提交成功！
        </h3>
        <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          感谢您的提交！我们会在<strong>24小时内</strong>将预览版和收款码发送到您的邮箱。
          <br />
          请留意查收邮件（包括垃圾邮件文件夹）。
        </p>
        
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px', 
          padding: '1rem', 
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          <h4 style={{ fontWeight: '600', color: '#000', marginBottom: '0.75rem' }}>
            📋 处理流程
          </h4>
          <div style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.5' }}>
            <div>• 检查视频和字幕可用性</div>
            <div>• 生成预览样本和收款码</div>
            <div>• 发送到您的邮箱</div>
            <div>• 满意后付费 <strong>¥6.66</strong></div>
            <div>• 1小时内交付完整结果</div>
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '8px', 
          padding: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          <p style={{ color: '#856404', fontSize: '0.875rem', margin: 0 }}>
            💡 如有问题或需要帮助，请联系：<strong>2373272608@qq.com</strong>
          </p>
        </div>
        
        <button 
          onClick={() => setShowSuccess(false)}
          style={{
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          处理另一个视频
        </button>
      </div>
    );
  }
  
  // 表单页面
  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '0 auto', 
      padding: '2rem', 
      backgroundColor: 'white', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#000', marginBottom: '0.5rem' }}>
          YouTube AI 处理服务
        </h3>
        <p style={{ color: '#666' }}>
          提交视频链接，获得智能分析和翻译服务
        </p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* YouTube URL输入 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            YouTube视频链接 *
          </label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              lineHeight: '1.5',
              color: '#000',
              backgroundColor: '#fff',
              border: errors.url ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none'
            }}
            required
            disabled={isSubmitting}
          />
          {errors.url && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.25rem' }}>⚠️</span>
              {errors.url}
            </p>
          )}
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            支持有英文字幕的YouTube视频
          </p>
        </div>
        
        {/* 邮箱输入 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            邮箱地址 *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              lineHeight: '1.5',
              color: '#000',
              backgroundColor: '#fff',
              border: errors.email ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none'
            }}
            required
            disabled={isSubmitting}
          />
          {errors.email && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.25rem' }}>⚠️</span>
              {errors.email}
            </p>
          )}
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            预览和付费链接将发送到此邮箱
          </p>
        </div>
        
        {/* 服务说明 */}
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '1rem' }}>
          <h4 style={{ fontWeight: '600', color: '#000', marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>💰</span>
            服务价格
          </h4>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span>预览处理</span>
              <span style={{ color: '#10b981', fontWeight: '600' }}>免费</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>完整版本</span>
              <span style={{ color: '#000', fontWeight: '600', fontSize: '1rem' }}>¥6.66</span>
            </div>
          </div>
        </div>
        
        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            backgroundColor: isSubmitting ? '#9ca3af' : '#000',
            color: '#fff',
            border: 'none',
            padding: '1rem',
            fontSize: '1.125rem',
            borderRadius: '8px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isSubmitting ? (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #fff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '0.75rem'
              }}></div>
              正在提交...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.5rem' }}>🚀</span>
              免费提交处理
            </span>
          )}
        </button>
        
        {/* 错误信息 */}
        {errors.submit && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ color: '#dc2626', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.5rem' }}>❌</span>
              {errors.submit}
            </p>
          </div>
        )}
        
        {/* 提交统计 */}
        {submitCount > 0 && (
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6b7280' }}>
            今日已提交 {submitCount} 个视频
          </div>
        )}
      </form>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}