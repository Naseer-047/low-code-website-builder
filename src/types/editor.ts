import type { CSSProperties } from "react";
import type { UniqueIdentifier } from '@dnd-kit/core';
import type { LucideIcon } from 'lucide-react';

export type ElementType =
  // Layout
  | 'container' | 'section' | 'grid-row' | 'grid-col' | 'card' | 'divider'
  // Typography
  | 'text' | 'h1' | 'h2' | 'h3' | 'paragraph' | 'blockquote' | 'link' | 'label'
  // Forms
  | 'button' | 'input' | 'textarea' | 'select' | 'checkbox' | 'radio'
  // Media
  | 'image' | 'video' | 'avatar'
  // UI
  | 'badge' | 'alert';

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
