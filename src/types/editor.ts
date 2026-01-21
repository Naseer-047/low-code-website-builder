import type { LucideIcon } from 'lucide-react';

export type ElementType =
  | 'text' | 'container' | 'section' | 'grid-row' | 'grid-col' | 'card'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'paragraph' | 'blockquote' | 'link' | 'label'
  | 'image' | 'video' | 'avatar'
  | 'button' | 'input' | 'textarea' | 'select' | 'checkbox' | 'radio'
  | 'divider' | 'badge' | 'alert';

export interface CanvasNode {
  id: string;
  type: ElementType;
  name: string;
  props: Record<string, any>;
  style: React.CSSProperties;
  children: CanvasNode[];
}

export interface Block {
  id: string;
  category: string;
  label: string;
  icon?: LucideIcon;
  elements: Partial<CanvasNode>; // Root node of the block template
}

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface EditorState {
  nodes: CanvasNode[];
  selectedId: string | null;
  device: DeviceType;
  history: CanvasNode[][];
  historyIndex: number;
}
