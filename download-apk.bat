@echo off
echo Downloading APK file...

echo APK下载地址: https://expo.dev/artifacts/eas/9KnhZKtAbxrWXeMP5aN5Fu.apk

echo.
echo 请手动下载APK文件:
echo 1. 复制上面的链接到浏览器
echo 2. 下载APK文件
echo 3. 将APK文件传输到你的Android手机
echo 4. 在手机上安装APK文件
echo.

echo 或者使用PowerShell下载:
powershell -Command "Invoke-WebRequest -Uri 'https://expo.dev/artifacts/eas/9KnhZKtAbxrWXeMP5aN5Fu.apk' -OutFile 'la-le-mo.apk'"

echo.
echo APK文件已下载完成！
pause 