const fs = require('fs');
const path = require('path');

// 创建一个简单的SVG图标内容
const svgContent = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景圆形 -->
  <circle cx="512" cy="512" r="512" fill="#FFE55C"/>
  
  <!-- 便便主体 -->
  <ellipse cx="512" cy="580" rx="180" ry="140" fill="#8B4513"/>
  
  <!-- 便便顶部 -->
  <ellipse cx="512" cy="440" rx="120" ry="80" fill="#A0522D"/>
  
  <!-- 便便顶部小圆 -->
  <ellipse cx="512" cy="360" rx="60" ry="40" fill="#CD853F"/>
  
  <!-- 眼睛 -->
  <circle cx="480" cy="520" r="15" fill="white"/>
  <circle cx="544" cy="520" r="15" fill="white"/>
  <circle cx="480" cy="520" r="8" fill="black"/>
  <circle cx="544" cy="520" r="8" fill="black"/>
  
  <!-- 高光 -->
  <circle cx="476" cy="516" r="4" fill="white"/>
  <circle cx="540" cy="516" r="4" fill="white"/>
  
  <!-- 嘴巴 -->
  <path d="M 492 550 Q 512 570 532 550" stroke="black" stroke-width="3" fill="none" stroke-linecap="round"/>
  
  <!-- 装饰性小点 -->
  <circle cx="400" cy="480" r="8" fill="#FFD700" opacity="0.8"/>
  <circle cx="624" cy="480" r="8" fill="#FFD700" opacity="0.8"/>
  <circle cx="450" cy="620" r="6" fill="#FFD700" opacity="0.6"/>
  <circle cx="574" cy="620" r="6" fill="#FFD700" opacity="0.6"/>
  
  <!-- 可爱的小手 -->
  <ellipse cx="380" cy="580" rx="20" ry="15" fill="#8B4513" transform="rotate(-30 380 580)"/>
  <ellipse cx="644" cy="580" rx="20" ry="15" fill="#8B4513" transform="rotate(30 644 580)"/>
</svg>
`;

// 保存SVG文件
fs.writeFileSync(path.join(__dirname, 'assets', 'images', 'icon.svg'), svgContent);

console.log('SVG图标已生成！');
console.log('请使用在线工具将SVG转换为PNG格式：');
console.log('1. 访问 https://convertio.co/svg-png/');
console.log('2. 上传 assets/images/icon.svg');
console.log('3. 下载PNG文件并重命名为 icon.png');
console.log('4. 替换 assets/images/icon.png'); 