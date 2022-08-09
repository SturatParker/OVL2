export class MarkdownUtils {
  static codeblock(message: string): string {
    return `\`\`\`${message}\`\`\``;
  }
}
