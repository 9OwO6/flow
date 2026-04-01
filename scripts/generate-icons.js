/**
 * 生成 Flow App 图标
 * 使用 Node.js 和 canvas 库生成 PNG 图标
 * 
 * 运行方式：
 * npm install canvas
 * node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// 检查是否安装了 canvas
let canvas;
try {
  canvas = require('canvas');
} catch (e) {
  console.error('请先安装 canvas: npm install canvas');
  console.error('如果安装失败，请使用在线工具将 assets/images/icon.svg 转换为 PNG');
  process.exit(1);
}

const { createCanvas } = canvas;

// 图标尺寸
const sizes = {
  icon: 1024,
  adaptive: 1024,
  splash: 1024,
};

// 创建图标
function createIcon(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // 背景 - 温暖白色
  ctx.fillStyle = '#F8F7F2';
  ctx.fillRect(0, 0, size, size);
  
  // 绘制圆角矩形背景（可选）
  const cornerRadius = size * 0.2;
  ctx.beginPath();
  ctx.moveTo(cornerRadius, 0);
  ctx.lineTo(size - cornerRadius, 0);
  ctx.quadraticCurveTo(size, 0, size, cornerRadius);
  ctx.lineTo(size, size - cornerRadius);
  ctx.quadraticCurveTo(size, size, size - cornerRadius, size);
  ctx.lineTo(cornerRadius, size);
  ctx.quadraticCurveTo(0, size, 0, size - cornerRadius);
  ctx.lineTo(0, cornerRadius);
  ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
  ctx.closePath();
  ctx.fillStyle = '#F8F7F2';
  ctx.fill();
  
  // 缩放因子
  const scale = size / 1024;
  
  // 主流动曲线
  ctx.strokeStyle = '#8FB9A8';
  ctx.lineWidth = 80 * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(200 * scale, 512 * scale);
  ctx.quadraticCurveTo(350 * scale, 200 * scale, 512 * scale, 512 * scale);
  ctx.quadraticCurveTo(674 * scale, 824 * scale, 824 * scale, 512 * scale);
  ctx.stroke();
  
  // 辅助流动曲线
  ctx.strokeStyle = '#8FB9A8';
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 60 * scale;
  ctx.beginPath();
  ctx.moveTo(200 * scale, 600 * scale);
  ctx.quadraticCurveTo(350 * scale, 300 * scale, 512 * scale, 600 * scale);
  ctx.quadraticCurveTo(674 * scale, 900 * scale, 824 * scale, 600 * scale);
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  
  // 中心点
  ctx.fillStyle = '#8FB9A8';
  ctx.beginPath();
  ctx.arc(512 * scale, 512 * scale, 40 * scale, 0, Math.PI * 2);
  ctx.fill();
  
  // 装饰点
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(300 * scale, 400 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(724 * scale, 624 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;
  
  // 保存文件
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ 已生成: ${outputPath} (${size}x${size})`);
}

// 主函数
function main() {
  const assetsDir = path.join(__dirname, '..', 'assets', 'images');
  
  // 确保目录存在
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  console.log('开始生成 Flow App 图标...\n');
  
  // 生成主图标
  createIcon(sizes.icon, path.join(assetsDir, 'icon.png'));
  
  // 生成自适应图标（Android）
  createIcon(sizes.adaptive, path.join(assetsDir, 'adaptive-icon.png'));
  
  // 生成启动画面图标
  createIcon(sizes.splash, path.join(assetsDir, 'splash-icon.png'));
  
  console.log('\n✓ 所有图标生成完成！');
  console.log('图标使用鼠尾草绿 (#8FB9A8) 和温暖白色 (#F8F7F2)');
}

main();

