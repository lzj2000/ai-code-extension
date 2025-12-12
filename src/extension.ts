import * as vscode from "vscode";
import ChatGPTWebviewProvider from "./core/chatgptWebview";

export function activate(context: vscode.ExtensionContext) {
  // 创建ChatGPTWebviewProvider实例并传入context
  const provider = new ChatGPTWebviewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("aiCode-view", provider, {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
    })
  );
}

export function deactivate() {}
