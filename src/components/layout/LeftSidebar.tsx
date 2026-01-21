import { Type, Image, Square, Layout, MousePointer2, PlaySquare, TextCursorInput, Minus, Heading1, Heading2, Heading3, Pilcrow, Quote, Link as LinkIcon, BoxSelect, CheckSquare, AlignLeft, User, AlertCircle, Badge as BadgeIcon } from 'lucide-react';
import { SidebarItem } from '@/components/editor/SidebarItem';
import { BLOCKS } from '@/lib/blocks';
import type { ElementType } from '@/types/editor';

export function LeftSidebar() {

  // Group BLOCKS by category
  const blockCategories = BLOCKS.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = [];
    }
    acc[block.category].push(block);
    return acc;
  }, {} as Record<string, typeof BLOCKS>);

  const basicElements = [
    {
      title: "Layout",
      items: [
        { type: 'container', icon: Square, label: 'Container' },
        { type: 'section', icon: Layout, label: 'Section' },
        { type: 'grid-row', icon: Layout, label: 'Grid Row' },
        { type: 'grid-col', icon: Layout, label: 'Grid Col' },
        { type: 'card', icon: Square, label: 'Card' },
        { type: 'divider', icon: Minus, label: 'Divider' },
      ]
    },
    {
      title: "Typography",
      items: [
        { type: 'h1', icon: Heading1, label: 'Heading 1' },
        { type: 'h2', icon: Heading2, label: 'Heading 2' },
        { type: 'h3', icon: Heading3, label: 'Heading 3' },
        { type: 'paragraph', icon: Pilcrow, label: 'Paragraph' },
        { type: 'text', icon: Type, label: 'Text' },
        { type: 'blockquote', icon: Quote, label: 'Quote' },
        { type: 'link', icon: LinkIcon, label: 'Link' },
      ]
    },
    {
      title: "Forms",
      items: [
        { type: 'button', icon: MousePointer2, label: 'Button' },
        { type: 'input', icon: TextCursorInput, label: 'Input' },
        { type: 'textarea', icon: AlignLeft, label: 'Textarea' },
        { type: 'label', icon: Type, label: 'Label' },
        { type: 'select', icon: BoxSelect, label: 'Select' },
        { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
        { type: 'radio', icon: CheckSquare, label: 'Radio' },
      ]
    },
    {
      title: "Media",
      items: [
        { type: 'image', icon: Image, label: 'Image' },
        { type: 'video', icon: PlaySquare, label: 'Video' },
        { type: 'avatar', icon: User, label: 'Avatar' },
      ]
    },
    {
      title: "UI Elements",
      items: [
        { type: 'alert', icon: AlertCircle, label: 'Alert' },
        { type: 'badge', icon: BadgeIcon, label: 'Badge' },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm text-foreground">Add Elements</h2>
        <p className="text-xs text-muted-foreground">Drag and drop to canvas</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* Basic Elements */}
        {basicElements.map((category) => (
          <div key={category.title} className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">{category.title}</h3>
            <div className="grid grid-cols-2 gap-2">
              {category.items.map(item => (
                // @ts-ignore
                <SidebarItem key={item.type} type={item.type as ElementType} icon={item.icon} label={item.label} />
              ))}
            </div>
          </div>
        ))}

        <div className="border-t border-border my-4"></div>
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Pre-built Blocks</h3>

        {/* Dynamic Blocks */}
        {Object.entries(blockCategories).map(([category, blocks]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">{category}</h3>
            <div className="grid grid-cols-1 gap-2"> {/* Single col for blocks as they are larger conceptually */}
              {blocks.map(block => (
                <div key={block.id} className="w-full">
                  <SidebarItem
                    type={block.elements.type as ElementType}
                    icon={block.icon || Square}
                    label={block.label}
                    blockId={block.id}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
