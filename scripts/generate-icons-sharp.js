/**
 * 使用 Sharp 生成 Flow App 图标
 * Sharp 可以直接将 SVG 转换为 PNG
 * 
 * 运行方式：
 * node scripts/generate-icons-sharp.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// SVG 内容
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

async function generateIcons() {
  const assetsDir = path.join(__dirname, '..', 'assets', 'images');
  
  // 确保目录存在
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  console.log('开始生成 Flow App 图标...\n');
  
  const size = 1024;
  const svgBuffer = Buffer.from(svgContent);
  
  try {
    // 生成主图标
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(assetsDir, 'icon.png'));
    console.log(`✓ 已生成: icon.png (${size}x${size})`);
    
    // 生成自适应图标（Android）
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(assetsDir, 'adaptive-icon.png'));
    console.log(`✓ 已生成: adaptive-icon.png (${size}x${size})`);
    
    // 生成启动画面图标
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(assetsDir, 'splash-icon.png'));
    console.log(`✓ 已生成: splash-icon.png (${size}x${size})`);
    
    console.log('\n✓ 所有图标生成完成！');
    console.log('图标使用鼠尾草绿 (#8FB9A8) 和温暖白色 (#F8F7F2)');
    console.log('\n图标文件位置:');
    console.log(`  - ${path.join(assetsDir, 'icon.png')}`);
    console.log(`  - ${path.join(assetsDir, 'adaptive-icon.png')}`);
    console.log(`  - ${path.join(assetsDir, 'splash-icon.png')}`);
  } catch (error) {
    console.error('生成图标时出错:', error);
    console.error('\n如果 Sharp 无法处理 SVG，请使用在线工具：');
    console.error('1. 打开 assets/images/icon.svg');
    console.error('2. 使用 https://cloudconvert.com/svg-to-png 转换为 PNG');
    console.error('3. 导出为 1024x1024 尺寸');
    process.exit(1);
  }
}

generateIcons();

