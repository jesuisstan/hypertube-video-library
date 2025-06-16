const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('\x1b[36m%s\x1b[0m', '📦 FFmpeg Installer for Hypertube');
console.log('\x1b[36m%s\x1b[0m', '============================================');

// Check if FFmpeg is already installed
try {
  const output = execSync('ffmpeg -version', { encoding: 'utf8' });
  console.log('\x1b[32m%s\x1b[0m', '✅ FFmpeg is already installed!');
  console.log(`Version info: ${output.split('\n')[0]}`);
  process.exit(0);
} catch (e) {
  console.log(
    '\x1b[33m%s\x1b[0m',
    '⚠️  FFmpeg is not installed or not in PATH. Attempting to install...'
  );
}

const platform = os.platform();

try {
  switch (platform) {
    case 'win32':
      console.log('Installing FFmpeg for Windows...');
      console.log('Please download FFmpeg from https://github.com/BtbN/FFmpeg-Builds/releases');
      console.log('Extract the downloaded zip and add the bin folder to your PATH');
      console.log('Instructions:');
      console.log(
        '1. Download the latest release from https://github.com/BtbN/FFmpeg-Builds/releases'
      );
      console.log('2. Look for a file like "ffmpeg-master-latest-win64-gpl.zip"');
      console.log('3. Extract the zip file to a location like C:\\ffmpeg');
      console.log(
        '4. Add the bin folder (e.g., C:\\ffmpeg\\bin) to your PATH environment variable'
      );
      console.log('5. Restart your terminal/command prompt');
      break;

    case 'darwin':
      console.log('Installing FFmpeg for macOS using Homebrew...');
      execSync('brew install ffmpeg', { stdio: 'inherit' });
      console.log('\x1b[32m%s\x1b[0m', '✅ FFmpeg installed successfully!');
      break;

    case 'linux':
      console.log('Installing FFmpeg for Linux...');
      // Detect distribution
      let distribution = '';
      try {
        distribution = execSync('lsb_release -si', { encoding: 'utf8' }).trim();
      } catch (e) {
        try {
          if (fs.existsSync('/etc/debian_version')) {
            distribution = 'Debian';
          } else if (fs.existsSync('/etc/redhat-release')) {
            distribution = 'RedHat';
          }
        } catch (e) {
          distribution = '';
        }
      }

      switch (distribution) {
        case 'Ubuntu':
        case 'Debian':
          execSync('sudo apt-get update && sudo apt-get install -y ffmpeg', { stdio: 'inherit' });
          break;
        case 'Fedora':
          execSync('sudo dnf install -y ffmpeg', { stdio: 'inherit' });
          break;
        case 'CentOS':
        case 'RedHat':
          execSync('sudo yum install -y epel-release && sudo yum install -y ffmpeg', {
            stdio: 'inherit',
          });
          break;
        case 'Arch':
        case 'ManjaroLinux':
          execSync('sudo pacman -S ffmpeg', { stdio: 'inherit' });
          break;
        default:
          console.log('\x1b[33m%s\x1b[0m', '⚠️  Could not automatically install FFmpeg.');
          console.log('Please install FFmpeg manually using your package manager.');
          console.log('For example:');
          console.log('- Ubuntu/Debian: sudo apt-get install ffmpeg');
          console.log('- Fedora: sudo dnf install ffmpeg');
          console.log('- CentOS/RHEL: sudo yum install ffmpeg');
          console.log('- Arch: sudo pacman -S ffmpeg');
          process.exit(1);
      }
      console.log('\x1b[32m%s\x1b[0m', '✅ FFmpeg installed successfully!');
      break;

    default:
      console.log('\x1b[31m%s\x1b[0m', '❌ Unsupported platform:', platform);
      console.log('Please install FFmpeg manually from https://ffmpeg.org/download.html');
      process.exit(1);
  }

  // Verify installation
  try {
    const output = execSync('ffmpeg -version', { encoding: 'utf8' });
    console.log('\x1b[32m%s\x1b[0m', '✅ FFmpeg installation verified!');
    console.log(`Version info: ${output.split('\n')[0]}`);
  } catch (e) {
    console.log('\x1b[31m%s\x1b[0m', '❌ Installation could not be verified.');
    console.log('Please make sure FFmpeg is properly installed and in your PATH.');
    process.exit(1);
  }
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Error during FFmpeg installation:');
  console.error(error.message);
  process.exit(1);
}
