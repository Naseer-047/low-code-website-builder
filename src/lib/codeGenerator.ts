import type { CanvasNode } from "@/types/editor";

export function generateCode(nodes: CanvasNode[]): string {
  const css: string[] = [];
  const html = nodes.map(node => renderNode(node, css)).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aether Project</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
       /* Custom generated styles if any */
       body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
    </style>
</head>
<body>
${html}
</body>
</html>`;
}

function renderNode(node: CanvasNode, css: string[]): string {
  const styleString = Object.entries(node.style)
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ');

  const styleAttr = styleString ? ` style="${styleString}"` : '';

  // Map internal types to HTML tags
  let tag = 'div';
  const voidTags = ['img', 'input', 'hr', 'br'];
  let content = '';
  let extraAttrs = '';

  switch (node.type) {
    case 'container': tag = 'div'; break;
    case 'section': tag = 'section'; break;
    case 'text': tag = 'span'; content = node.props.content; break;
    case 'paragraph': tag = 'p'; content = node.props.content; break;
    case 'h1': tag = 'h1'; content = node.props.content; break;
    case 'h2': tag = 'h2'; content = node.props.content; break;
    case 'h3': tag = 'h3'; content = node.props.content; break;
    case 'blockquote': tag = 'blockquote'; content = node.props.content; break;
    case 'link': tag = 'a'; content = node.props.content; extraAttrs = ` href="${node.props.href || '#'}"`; break;
    case 'button': tag = 'button'; content = node.props.content; break;
    case 'image': tag = 'img'; extraAttrs = ` src="${node.props.src}" alt="Image"`; break;
    case 'video':
      return `<div${styleAttr}><iframe src="${node.props.src}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe></div>`;
    case 'input': tag = 'input'; extraAttrs = ` placeholder="${node.props.placeholder || ''}"`; break;
    case 'divider': tag = 'hr'; break;
    case 'label': tag = 'label'; content = node.props.content; break;
    case 'textarea': tag = 'textarea'; extraAttrs = ` placeholder="${node.props.placeholder || ''}"`; break;
    case 'select': tag = 'select'; content = (node.props.options || []).map((o: string) => `<option>${o}</option>`).join(''); break;
    case 'checkbox': tag = 'input'; extraAttrs = ` type="checkbox" ${node.props.checked ? 'checked' : ''}`; break;
    case 'radio': tag = 'input'; extraAttrs = ` type="radio" ${node.props.checked ? 'checked' : ''}`; break;
    case 'card': tag = 'div'; break;
    // ... add others as generic divs for now
    default: tag = 'div';
  }

  if (voidTags.includes(tag)) {
    return `<${tag}${extraAttrs}${styleAttr} />`;
  }

  const childrenHtml = node.children.map(child => renderNode(child, css)).join('\n');

  // If content is present, it overrides children for text-like nodes, 
  // but usually text nodes don't have children in this model.
  const inner = content || childrenHtml;

  return `<${tag}${extraAttrs}${styleAttr}>${inner}</${tag}>`;
}

function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}
