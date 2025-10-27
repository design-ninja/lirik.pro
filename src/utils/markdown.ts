export function getFirstParagraphFromMarkdown(markdown: string): string {
  if (!markdown) return '';
  // remove ESM import/export lines that may appear in MDX
  const withoutEsModules = markdown.replace(/^\s*(import|export)[^\n]*\n/gm, '');
  const firstBlock = withoutEsModules.trim().split(/\n\s*\n/)[0] || '';
  const withoutImages = firstBlock.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  const withoutLinks = withoutImages.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  const withoutFormatting = withoutLinks.replace(/[\\*_`~>]/g, '');
  return withoutFormatting.trim();
}
