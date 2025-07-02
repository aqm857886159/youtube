// 苹果风格主页面
import Head from 'next/head';
import { useState } from 'react';
import SecureForm from '../components/SecureForm';

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "提交链接",
      description: "提交YouTube视频链接，我们免费检查处理可行性",
      icon: "📤",
      time: "立即"
    },
    {
      title: "预览分析",
      description: "AI分析视频内容，计算准确成本，发送预览到邮箱",
      icon: "🔍", 
      time: "5分钟内"
    },
    {
      title: "确认付费",
      description: "满意预览效果后，支付6.66元开始完整处理",
      icon: "💳",
      time: "用户决定"
    },
    {
      title: "完整交付",
      description: "24小时内发送双语文档、深度分析到邮箱",
      icon: "📧",
      time: "24小时内"
    }
  ];

  const features = [
    {
      title: "先试后买",
      description: "免费预览效果，满意再付费",
      icon: "🎯"
    },
    {
      title: "统一定价",
      description: "所有视频统一6.66元，透明无隐藏费用",
      icon: "💎"
    },
    {
      title: "专业品质",
      description: "AI+人工校对，确保翻译准确度",
      icon: "⚡"
    }
  ];

  return (
    <>
      <Head>
        <title>YouTube视频AI处理 - 先试后买，6.66元统一定价</title>
        <meta name="description" content="YouTube视频AI智能处理服务。免费预览，满意后6.66元获得完整双语翻译、内容总结。24小时内邮箱交付。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="YouTube翻译,视频翻译,AI翻译,双语字幕,视频总结" />
        
        {/* 安全相关meta标签 */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com;" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        
        {/* 图标 */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph */}
        <meta property="og:title" content="YouTube视频AI处理 - 6.66元统一定价" />
        <meta property="og:description" content="免费预览，满意后付费。专业AI翻译YouTube视频" />
        <meta property="og:type" content="website" />
      </Head>

      <main className="min-h-screen bg-secondary">
        {/* 导航栏 */}
        <nav className="bg-secondary border-b border-gray-100">
          <div className="container">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-primary">
                  YouTube AI
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <span className="text-sm text-gray-600">安全</span>
                <span className="text-sm text-gray-600">快速</span>
                <span className="text-sm text-gray-600">可靠</span>
              </div>
            </div>
          </div>
        </nav>

        {/* 英雄区域 */}
        <section className="py-16 md:py-24">
          <div className="container text-center">
            <div className="fade-in">
              <h2 className="text-4xl md:text-6xl font-light text-primary mb-6 leading-tight">
                YouTube视频
                <br />
                <span className="font-medium">智能处理</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-4 font-light max-w-3xl mx-auto leading-relaxed">
                免费预览效果，满意后仅需
                <span className="font-medium text-primary mx-2">6.66元</span>
                获得完整处理结果
              </p>
              
              <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
                专业AI翻译 + 深度内容分析，24小时内邮箱交付
              </p>

              {/* 核心价值主张 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
                {features.map((feature, index) => (
                  <div key={index} className="card text-center slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 表单区域 */}
        <section className="py-16 bg-gray-50">
          <div className="container-sm">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-light text-primary mb-4">
                开始免费预览
              </h3>
              <p className="text-gray-600">
                提交YouTube链接，立即获得免费预览分析
              </p>
            </div>
            
            <div className="slide-up">
              <SecureForm />
            </div>
          </div>
        </section>

        {/* 流程说明 */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-light text-primary mb-4">
                简单四步流程
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                我们不提供实时处理，而是通过异步处理确保最高质量
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* 桌面端流程 */}
              <div className="hidden md:block">
                <div className="relative">
                  {/* 连接线 */}
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-0.5"></div>
                  
                  <div className="grid grid-cols-4 gap-8 relative z-10">
                    {steps.map((step, index) => (
                      <div key={index} className="text-center">
                        <div 
                          className={`w-16 h-16 mx-auto mb-4 rounded-full border-2 flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 ${
                            index <= activeStep 
                              ? 'bg-primary border-primary text-secondary' 
                              : 'bg-secondary border-gray-200 text-gray-400'
                          }`}
                          onClick={() => setActiveStep(index)}
                        >
                          {step.icon}
                        </div>
                        <h4 className="font-semibold text-primary mb-2">{step.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 leading-relaxed">{step.description}</p>
                        <span className="text-xs text-gray-500 font-medium">{step.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 移动端流程 */}
              <div className="md:hidden space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-secondary flex items-center justify-center text-xl flex-shrink-0">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                      <span className="text-xs text-gray-500">{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 定价区域 */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-3xl font-light text-primary mb-6">
                透明定价
              </h3>
              
              <div className="card">
                <div className="text-center">
                  <div className="text-6xl font-light text-primary mb-4">
                    ¥6.66
                  </div>
                  <p className="text-gray-600 mb-6">
                    所有视频统一价格，无隐藏费用
                  </p>
                  
                  <div className="text-left space-y-3 mb-8">
                    <div className="flex items-center">
                      <span className="text-primary mr-3">✓</span>
                      <span className="text-gray-700">免费预览分析</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary mr-3">✓</span>
                      <span className="text-gray-700">完整双语翻译文档</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary mr-3">✓</span>
                      <span className="text-gray-700">深度内容分析文章</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary mr-3">✓</span>
                      <span className="text-gray-700">24小时内邮箱交付</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-primary mr-3">✓</span>
                      <span className="text-gray-700">AI+人工双重校对</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    💡 不满意预览效果？完全免费，无需付款
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ区域 */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-light text-primary mb-12 text-center">
                常见问题
              </h3>
              
              <div className="space-y-6">
                <div className="card">
                  <h4 className="font-semibold text-primary mb-2">为什么不是实时处理？</h4>
                  <p className="text-gray-600 leading-relaxed">
                    我们采用异步处理模式确保最高质量。AI翻译后会经过人工校对，保证准确性和专业性。实时处理往往质量不稳定。
                  </p>
                </div>
                
                <div className="card">
                  <h4 className="font-semibold text-primary mb-2">预览包含什么内容？</h4>
                  <p className="text-gray-600 leading-relaxed">
                    预览包含视频前3-5分钟的翻译样本、内容摘要、处理可行性分析。让您在付费前就能评估效果。
                  </p>
                </div>
                
                <div className="card">
                  <h4 className="font-semibold text-primary mb-2">支持哪些视频类型？</h4>
                  <p className="text-gray-600 leading-relaxed">
                    支持所有有英文字幕的YouTube视频。包括自动生成字幕和人工添加字幕。视频长度不限。
                  </p>
                </div>
                
                <div className="card">
                  <h4 className="font-semibold text-primary mb-2">如何付费？</h4>
                  <p className="text-gray-600 leading-relaxed">
                    支持微信支付、支付宝。收到预览邮件后，如果满意效果，按邮件中的付费链接支付即可。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA区域 */}
        <section className="py-16 bg-primary text-secondary">
          <div className="container text-center">
            <h3 className="text-3xl font-light mb-4">
              准备开始了吗？
            </h3>
            <p className="text-xl mb-8 text-gray-300">
              免费预览，满意后仅需6.66元
            </p>
            <a href="#form" className="btn btn-secondary">
              立即免费预览
            </a>
          </div>
        </section>

        {/* 页脚 */}
        <footer className="bg-secondary border-t border-gray-100 py-8">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-500 text-sm">
                  © 2024 YouTube AI. 专业视频处理服务
                </p>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  安全加密
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  隐私保护
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  24h交付
                </span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}