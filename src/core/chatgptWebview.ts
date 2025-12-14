import * as path from 'node:path'
import * as vscode from 'vscode'

class ChatGPTWebviewProvider implements vscode.WebviewViewProvider {
  constructor(private context: vscode.ExtensionContext) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    // 启用脚本和本地资源访问
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this.context.extensionPath, 'dist')),
      ],
    }

    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview)

    // 监听来自webview的消息
    webviewView.webview.onDidReceiveMessage(
      async () => {

      },
      undefined,
      [],
    )
  }

  private async getAIResponse(message: string): Promise<string> {
    // 这是一个示例方法，实际应该调用真实的AI API
    // 你可以根据VS Code扩展配置获取API密钥
    return `已收到您的消息: "${message}"。请实现实际的API调用逻辑。`
  }

  private getHtmlForWebview(webview: vscode.Webview) {
    // 获取webview.js的URI
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.file(
        path.join(this.context.extensionPath, 'dist', 'webview.js'),
      ),
    )

    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Code Assistant</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            padding: 0;
            margin: 0;
          }
          #root {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
         <script>
         console.log("初始化")</script>
        <script src="${scriptUri}"></script>
      </body>
      </html>
    `
  }
}

export default ChatGPTWebviewProvider
