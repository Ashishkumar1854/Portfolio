/**
 * A safe, lightweight Markdown-to-HTML parser utility for rich text formatting
 * in community discussions, blogs, and comments.
 */
export const parseMarkdownToHtml = (markdown) => {
  if (!markdown) return '';
  
  // If the content is raw HTML (contains tags like <p>, <h3>, etc.), bypass markdown rendering
  const isHtml = /<[a-z][\s\S]*>/i.test(markdown);
  if (isHtml) {
    return markdown;
  }
  
  // Escape HTML tags to prevent XSS, but preserve custom formatting
  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Multi-line Code blocks: ```language ... ```
  html = html.replace(/```(\w*)\n([\s\S]*?)```/gm, (match, lang, code) => {
    return `<pre class="bg-bg-primary/90 border border-border-subtle rounded-xl p-4 my-4 overflow-x-auto text-xs font-mono text-text-primary"><code class="language-${lang}">${code.trim()}</code></pre>`;
  });

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-bg-elevated px-1.5 py-0.5 rounded text-xs font-mono text-accent-cyan">$1</code>');

  // Headers: # Header, ## Header, etc.
  html = html.replace(/^### (.*$)/gim, '<h4 class="text-sm font-bold text-text-primary mt-4 mb-2">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 class="text-base font-bold text-text-primary mt-5 mb-2">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 class="text-lg font-bold text-text-primary mt-6 mb-2">$1</h2>');

  // Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-text-primary">$1</strong>');
  
  // Italic: *text*
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-text-secondary">$1</em>');

  // Bullet lists: - item or * item
  html = html.replace(/^\s*[-*]\s+(.*)$/gim, '<li class="ml-4 list-disc text-xs text-text-secondary leading-relaxed mb-1">$1</li>');

  // Paragraphs / line breaks: split by double newline
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs.map(p => {
    const trimmed = p.trim();
    // If it's already a code block, header, list item, don't wrap in p tag
    if (trimmed.startsWith('<pre') || trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<ul')) {
      return p;
    }
    return `<p class="text-xs md:text-sm text-text-secondary leading-relaxed mb-3 whitespace-pre-line">${p}</p>`;
  }).join('\n');

  return html;
};
