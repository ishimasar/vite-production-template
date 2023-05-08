# Viteを用いたHTML・CSS・JavaScriptコーディングテンプレート

## 構成

* ビルドツール
  * [Vite(ヴィート)](https://vitejs.dev/)
  * 以下環境で動作を確認(2023/5)
    * マシン: macOS Ventura 13.1
    * ランタイム: Node.js 16.16.0
    * パッケージマネージャー: npm 8.19.2 / Yarn 1.22.19
    * Node.jsバージョン管理: Volta 1.0.7
* 実制作環境 = コーディングに使用する言語
  * HTML
    * Web template engineにHandlebarsを利用
  * Sass
  * TypeScriptまたはネイティブJavaScript
  * 画像、あればWebフォント
* コンパイル結果 = サイト構成
  * HTML
  * CSS
  * JavaScript
  * 画像、あればWebフォント

---

## 制作環境の構築

### パッケージのインストール

* CLIコマンド
  * `npm install`(`npm`は`yarn`に置き換え可能)

### 利用可能な機能

#### ローカルサーバー = プレビュー画面起動

* CLIコマンド
  * `npm run dev`(`npm run`は`yarn`に置き換え可能)
    * CLI画面/ターミナル上にIPアドレスが発行され開発プレビュー使用できる

#### ビルド = 公開用ファイルの書き出し

* CLIコマンド
  * `npm run build`(`npm run`は`yarn`に置き換え可能)
    * 「dist/」ディレクトリに公開用のファイル一式が書き出される(コンパイルやbundleを自動で行う)

#### JavaScriptの取り回し

##### 選択肢1:TypeScript使用について

* ViteはTypeScriptのJavaScriptトランスパイルを、esbuildを介してデフォルトで行うので、何もせずbuildコマンドを叩けばOK
* 本例はES Modules構成を前提としているが無理に使わなくても良い
* main.jsファイルをbundleおよびminifyで書き出す設定をしている

##### 選択肢2:代替としてネイティブJavaScriptで上書く

* 諸条件からTypeScriptを使用しないほうが良い場合があることを考慮し、ネイティブJSを「src/」からそのまま「dist/」へ書き出す選択肢を用意したので、フォールバックとして利用OK
  * CLIコマンド
    * `npm native-js`(`npm`は`yarn`に置き換え可能)。buildコマンド後に上書きする形で利用すること
  * こちらはbundleやminifyを行わない設定にしている
  