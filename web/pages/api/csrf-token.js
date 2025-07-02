// CSRF Token API
import { generateCSRFToken } from '../../lib/security';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const token = generateCSRFToken();
    
    // 在session中存储token (生产环境需要配置session)
    if (req.session) {
      req.session.csrfToken = token;
    }
    
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).json({ 
      token,
      expires: Date.now() + 30 * 60 * 1000 // 30分钟过期
    });
  } catch (error) {
    console.error('CSRF token generation error:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
}