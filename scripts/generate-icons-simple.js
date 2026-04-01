/**
 * 简化版图标生成脚本
 * 如果 canvas 安装失败，可以使用这个脚本生成 SVG，然后手动转换为 PNG
 */

const fs = require('fs');
const path = require('path');

const svgContent = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景 -->
  <rect width="1024" height="1024" fill="#F8F7F2" rx="200"/>
  
  <!-- 流动曲线 - 主曲线 -->
  <path d="M 200 512 Q 350 200, 512 512 T 824 512" 
        stroke="#8FB9A8" 
        stroke-width="80" 
        fill="none" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
  
  <!-- 流动曲线 - 辅助曲线 -->
  <path d="M 200 600 Q 350 300, 512 600 T 824 600" 
        stroke="#8FB9A8" 
        stroke-width="60" 
        fill="none" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        opacity="0.6"/>
  
  <!-- 中心点 - 代表记录点 -->
  <circle cx="512" cy="512" r="40" fill="#8FB9A8"/>
  
  <!-- 小装饰点 -->
  <circle cx="300" cy="400" r="20" fill="#8FB9A8" opacity="0.5"/>
  <circle cx="724" cy="624" r="20" fill="#8FB9A8" opacity="0.5"/>
</svg>`;

function main() {
  const assetsDir = path.join(__dirname, '..', 'assets', 'images');
  
  // 确保目录存在
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  // 保存 SVG
  const svgPath = path.join(assetsDir, 'icon.svg');
  fs.writeFileSync(svgPath, svgContent);
  console.log('✓ SVG 图标已生成:', svgPath);
  console.log('\n下一步：');
  console.log('1. 使用在线工具将 SVG 转换为 PNG: https://cloudconvert.com/svg-to-png');
  console.log('2. 或者使用设计工具（Figma/Sketch）打开 SVG 并导出为 PNG');
  console.log('3. 需要生成以下尺寸的 PNG:');
  console.log('   - icon.png: 1024x1024');
  console.log('   - adaptive-icon.png: 1024x1024');
  console.log('   - splash-icon.png: 1024x1024');
}

main();

