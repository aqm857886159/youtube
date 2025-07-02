# YouTube AI 处理服务 - 部署指南

## 🚀 快速部署到 Vercel

### 第一步：准备代码

1. **克隆或下载项目代码**
   ```bash
   # 将 web 文件夹上传到 GitHub 仓库
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/youtube-ai-web.git
   git push -u origin main
   ```

### 第二步：Vercel 部署

1. **访问 Vercel 控制台**
   - 打开 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - Framework Preset 选择 "Next.js"
   - Root Directory 保持默认

3. **环境变量配置**
   在 Vercel 项目设置中添加以下环境变量：

   ```env
   # API密钥 (必需)
   DEEPSEEK_API_KEY=your_deepseek_api_key
   OPENAI_API_KEY=your_openai_api_key_backup
   
   # 邮件服务配置 (必需)
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   EMAIL_ADDRESS=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   
   # 安全配置 (推荐)
   SESSION_SECRET=your_random_32_char_string
   CSRF_SECRET=your_random_32_char_string
   
   # 应用配置 (可选)
   NEXT_PUBLIC_APP_NAME=YouTube AI 处理服务
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约2-3分钟）

### 第三步：域名配置

1. **自定义域名**（可选）
   - 在 Vercel 项目设置 > Domains
   - 添加你的域名
   - 按提示配置 DNS

2. **SSL 证书**
   - Vercel 自动提供免费 SSL
   - 支持自动续期

## 🔧 本地开发

### 环境要求
- Node.js 18+
- npm 8+

### 安装依赖
```bash
cd web
npm install
```

### 环境变量配置
创建 `.env.local` 文件：
```env
DEEPSEEK_API_KEY=your_api_key
EMAIL_ADDRESS=your_email
EMAIL_PASSWORD=your_password
SESSION_SECRET=your_secret
```

### 开发服务器
```bash
npm run dev
```

访问 `http://localhost:3000`

## 📧 邮件服务配置

### Gmail 配置
1. **启用两步验证**
2. **生成应用专用密码**
   - Google 账户 > 安全性 > 应用专用密码
   - 选择"邮件"应用
   - 复制生成的16位密码

3. **环境变量**
   ```env
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   EMAIL_ADDRESS=your.email@gmail.com
   EMAIL_PASSWORD=your_16_digit_app_password
   ```

### 其他邮件服务
- **QQ邮箱**: smtp.qq.com:587
- **163邮箱**: smtp.163.com:587
- **Outlook**: smtp-mail.outlook.com:587

## 💰 支付集成

### 微信支付/支付宝
由于是个人服务，建议采用以下方式：

1. **二维码收款**
   - 生成固定金额（6.66元）收款码
   - 在邮件中包含收款码图片
   - 手动确认到账

2. **第三方支付**
   - 易支付、码支付等个人友好的接口
   - 配置 webhook 自动确认

## 🔍 监控和日志

### Vercel Analytics
- 在项目设置中启用 Analytics
- 查看访问量、性能指标

### 错误监控
推荐集成 Sentry：
```bash
npm install @sentry/nextjs
```

### 安全监控
- 定期检查 Vercel 部署日志
- 监控异常请求频率
- 设置告警规则

## 📊 成本分析

### Vercel 费用
- **免费版**: 适合个人使用
  - 100GB 带宽/月
  - 100次构建/月
  - 无限静态文件

- **Pro版**: $20/月
  - 1TB 带宽/月
  - 无限构建
  - 优先支持

### API 调用费用
- **DeepSeek**: $0.0007/视频 (平均)
- **邮件服务**: 免费 (Gmail) 或 $0.01/邮件

### 预估月成本
- **100个视频**: $0.07 (API) + $0 (Vercel免费版) = $0.07
- **1000个视频**: $0.70 (API) + $20 (Vercel Pro) = $20.70

## 🛡️ 安全检查清单

### 部署前
- [ ] 所有环境变量已配置
- [ ] API 密钥安全存储
- [ ] HTTPS 强制启用
- [ ] 安全头配置正确

### 运行时
- [ ] 监控异常请求
- [ ] 定期更新依赖
- [ ] 备份重要数据
- [ ] 检查访问日志

## 🚨 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本
   - 清理 node_modules 重新安装
   - 查看构建日志详情

2. **API 调用失败**
   - 验证 API 密钥有效性
   - 检查网络连接
   - 查看 Vercel 函数日志

3. **邮件发送失败**
   - 确认邮箱设置正确
   - 检查应用专用密码
   - 验证 SMTP 配置

4. **表单提交失败**
   - 检查 CSRF 配置
   - 验证客户端网络
   - 查看浏览器控制台错误

### 调试技巧
```bash
# 查看 Vercel 日志
vercel logs

# 本地调试
npm run dev
# 查看 Network 选项卡

# 检查环境变量
vercel env ls
```

## 📞 支持

- **文档问题**: 查看 Next.js 官方文档
- **部署问题**: 查看 Vercel 文档
- **代码问题**: 检查浏览器控制台和 Vercel 日志

---

🎉 **恭喜！你的 YouTube AI 处理服务已上线！**

现在你可以：
1. 分享网站链接给用户
2. 开始接收订单
3. 逐步优化服务质量
4. 扩展更多功能