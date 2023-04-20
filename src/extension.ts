// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

require("module-alias/register");
import * as vscode from "vscode";
import ChatGPTApi from "./chatgpt-api";
import { EXTENSION_CONSTANT } from "constant";
import { LeftPanelWebview } from "providers/left-webview-provider";

async function formatPythonDocstring(highlighted: string): Promise<string> {
  const api = new ChatGPTApi();

  const prompt = "Reformat the following python docstring: ";
  const res = await api.getCompletion(prompt + highlighted);

  return res.choices[0].message.content;
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("Pydoc Extension is now active");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let helloWorldCommand = vscode.commands.registerCommand(
    "pydoc-reformat.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from pydoc-reformat!");
    }
  );

  context.subscriptions.push(helloWorldCommand);

  let printStringCommand = vscode.commands.registerCommand(
    "pydoc-reformat.printString",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const selection = editor.selection;
      if (selection && !selection.isEmpty) {
        const selectionRange = new vscode.Range(
          selection.start.line,
          selection.start.character,
          selection.end.line,
          selection.end.character
        );
        const highlighted = editor.document.getText(selectionRange);
        console.log(highlighted);
        vscode.window.showInformationMessage(highlighted);
        const formatted = await formatPythonDocstring(highlighted);
        console.log(formatted);
        vscode.window.showInformationMessage(formatted);
      }
    }
  );

  context.subscriptions.push(printStringCommand);

  // Register view
  const leftPanelWebViewProvider = new LeftPanelWebview(
    context?.extensionUri,
    {}
  );

  let view = vscode.window.registerWebviewViewProvider(
    EXTENSION_CONSTANT.LEFT_PANEL_WEBVIEW_ID,
    leftPanelWebViewProvider
  );
  context.subscriptions.push(view);
}
// This method is called when your extension is deactivated
export function deactivate() {}
