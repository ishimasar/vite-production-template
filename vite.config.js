import { defineConfig } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import fs from 'fs';
import path from 'path';

const files = [];
function readDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath, item);

    if (fs.statSync(itemPath).isDirectory()) {
      // componentsディレクトリを除外する
      if (item === 'components' || item === 'js') {
        continue;
      }

      readDirectory(itemPath);
    } else {
      // htmlファイル以外を除外する
      if (path.extname(itemPath) !== '.html') {
        continue;
      }

      // nameを決定する
      let name;
      if (dirPath === path.resolve(__dirname, 'src')) {
        name = path.parse(itemPath).name;
      } else {
        const relativePath = path.relative(path.resolve(__dirname, 'src'), dirPath);
        const dirName = relativePath.replace(/\//g, '_');
        name = `${dirName}_${path.parse(itemPath).name}`;
      }

      // pathを決定する
      const relativePath = path.relative(path.resolve(__dirname, 'src'), itemPath);
      const filePath = `/${relativePath}`;

      files.push({ name, path: filePath });
    }
  }
}
readDirectory(path.resolve(__dirname, 'src'));
const inputFiles = {};
for (let i = 0; i < files.length; i++) {
  const file = files[i];
  inputFiles[file.name] = resolve(__dirname, './src' + file.path );
}

// Handlebars=HTML上で出し分けたい各ページごとの情報
const pageData = {
  '/index.html': {
    isHome: true,
    title: 'Main Page',
  },
  '/other.html': {
    isHome: false,
    title: 'Other Page',
  },
};

// Cache busting CSS and JS files
const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      // build時のみ動作させる
      if(process.env.NODE_ENV !== 'production') {
        return;
      }
      const date = new Date();
      const param = date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
      let setParamHtml = html.replace(/(?=.*<link)(?=.*css).*$/gm, match => {
        return match.replace(/\.css/, '.css?' + param);
      });
      return setParamHtml.replace(/(?=.*<script)(?=.*js).*$/gm, match => {
        return match.replace(/\.js/, '.js?' + param);
      });
    }
  }
}

export default defineConfig({
  server: {
    host: true
  },
  base: './',
  root: './src', // 開発ディレクトリ
  build: {
    outDir: '../dist', // 出力ディレクトリ
    rollupOptions: { // 出力設定
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.')[1];
          // Webフォントファイル振り分け
          if (/ttf|otf|woff|woff2/i.test(extType)) {
            extType = 'font';
          }
          if (/png|jpe?g|webp|avif|svg|gif|ico/i.test(extType)) {
            extType = 'image';
          }
          if(extType === 'css') {
            return `assets/css/style.css`;
          }
          return `assets/${extType}/[name][extname]`;
        },
        chunkFileNames: 'assets/js/main.js',
        entryFileNames: 'assets/js/[name].js',
      },
      input: {
        index: resolve(__dirname, './src/index.html'),
        other: resolve(__dirname, './src/other.html'),
      },
    },
  },
  plugins: [
    htmlPlugin(),
    handlebars({
      partialDirectory: resolve(__dirname, './src/components'),
      context(pagePath) {
        return pageData[pagePath];
      },
    }),
  ],
});