import { useRef } from 'react';
import { useEditorStore } from '@/store/editorStore';
import type { CanvasNode } from '@/types/editor';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function Canvas() {
  const { nodes, device, selectNode, selectedId } = useEditorStore();
  const iframeRef = useRef<HTMLDivElement>(null);

  // Main canvas is just a container for the root node, but we also want to drop receiving
  const { setNodeRef, isOver } = useDroppable({
    id: 'main-canvas',
  });

  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <div className="flex-1 flex justify-center py-8 px-4 overflow-auto w-full h-full" onClick={() => selectNode(null)}>
      <div
        ref={(node) => {
          setNodeRef(node);
          if (iframeRef.current !== node) {
            // @ts-ignore
            iframeRef.current = node;
          }
        }}
        className={cn(
          "bg-white shadow-2xl transition-all duration-300 relative overflow-hidden min-h-[800px]",
          device !== 'desktop' && "border border-border/50 rounded-lg",
          isOver && "ring-2 ring-primary/50"
        )}
        style={{ width: getDeviceWidth(), height: 'fit-content' }}
        onClick={(e) => e.stopPropagation()}
      >
        {nodes.map(node => (
          <Renderer key={node.id} node={node} selectedId={selectedId} onSelect={selectNode} />
        ))}
      </div>
    </div>
  );
}

function Renderer({ node, selectedId, onSelect }: { node: CanvasNode; selectedId: string | null; onSelect: (id: string) => void }) {
  const isSelected = selectedId === node.id;
  const isContainer = ['container', 'section', 'grid-row', 'grid-col', 'card'].includes(node.type);

  // Use Sortable for all nodes so they can be moved
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver // Sortable also provides isOver if it's a container
  } = useSortable({
    id: node.id,
    data: { node } // Pass node data for identifying in drag events
  });

  const style = {
    ...node.style,
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    outline: isSelected ? '2px solid #3b82f6' : 'none', // Override outline style here
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id);
  };

  const commonProps = {
    style,
    className: cn(
      "relative transition-all",
      // Hover effect only if not dragging
      !isDragging && !isSelected && "hover:outline hover:outline-1 hover:outline-blue-500/50",
      // Drop target visual
      isContainer && isOver && "ring-2 ring-primary ring-offset-2 bg-primary/5"
    ),
    onClick: handleClick,
    // Add drag listeners to the element (or a handle if we wanted one)
    ...attributes,
    ...listeners
  };

  // Helper to render children wrapped in SortableContext
  const renderChildren = () => {
    if (!node.children || node.children.length === 0) return null;
    return (
      <SortableContext items={node.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {node.children.map(child => (
          <Renderer key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} />
        ))}
      </SortableContext>
    );
  };

  // Typography
  if (node.type === 'h1') return <h1 ref={setNodeRef} {...commonProps}>{node.props.content}</h1>;
  if (node.type === 'h2') return <h2 ref={setNodeRef} {...commonProps}>{node.props.content}</h2>;
  if (node.type === 'h3') return <h3 ref={setNodeRef} {...commonProps}>{node.props.content}</h3>;
  if (node.type === 'h4') return <h4 ref={setNodeRef} {...commonProps}>{node.props.content}</h4>;
  if (node.type === 'h5') return <h5 ref={setNodeRef} {...commonProps}>{node.props.content}</h5>;
  if (node.type === 'h6') return <h6 ref={setNodeRef} {...commonProps}>{node.props.content}</h6>;
  if (node.type === 'paragraph') return <p ref={setNodeRef} {...commonProps}>{node.props.content}</p>;
  if (node.type === 'blockquote') return <blockquote ref={setNodeRef} {...commonProps}>{node.props.content}</blockquote>;
  if (node.type === 'link') return <a ref={setNodeRef} {...commonProps} onClick={(e) => { e.preventDefault(); handleClick(e); }}>{node.props.content}</a>;
  if (node.type === 'text') return <span ref={setNodeRef} {...commonProps}>{node.props.content}</span>;

  // Forms
  if (node.type === 'button') return <button ref={setNodeRef} {...commonProps}>{node.props.content}</button>;
  if (node.type === 'input') return <input ref={setNodeRef} placeholder={node.props.placeholder} {...commonProps} readOnly />;
  if (node.type === 'textarea') return <textarea ref={setNodeRef} placeholder={node.props.placeholder} {...commonProps} readOnly />;
  if (node.type === 'select') return <select ref={setNodeRef} {...commonProps}>{(node.props.options || ['Option']).map((o: string) => <option key={o}>{o}</option>)}</select>;
  if (node.type === 'label') return <label ref={setNodeRef} {...commonProps}>{node.props.content}</label>;
  if (node.type === 'checkbox') return <div ref={setNodeRef} {...commonProps} style={{ ...style, display: 'flex', gap: '8px', alignItems: 'center' }}><input type="checkbox" readOnly checked={node.props.checked} /> <span>{node.props.label}</span></div>;
  if (node.type === 'radio') return <div ref={setNodeRef} {...commonProps} style={{ ...style, display: 'flex', gap: '8px', alignItems: 'center' }}><input type="radio" readOnly checked={node.props.checked} /> <span>{node.props.label}</span></div>;

  // Media
  if (node.type === 'image') return <img ref={setNodeRef} src={node.props.src || 'https://placehold.co/600x400'} alt="img" {...commonProps} />;
  if (node.type === 'avatar') return <img ref={setNodeRef} src={node.props.src || 'https://placehold.co/150'} alt="avatar" {...commonProps} />;
  if (node.type === 'video') return <div ref={setNodeRef} {...commonProps}><iframe width="100%" height="100%" src={node.props.src} className="pointer-events-none" style={{ borderRadius: node.style.borderRadius }} /></div>;

  // UI
  if (node.type === 'divider') return <hr ref={setNodeRef} {...commonProps} />;
  if (node.type === 'badge') return <span ref={setNodeRef} {...commonProps}>{node.props.content}</span>;
  if (node.type === 'alert') return <div ref={setNodeRef} {...commonProps}>{node.props.content}</div>;

  // Layout Wrappers
  // They render children!
  if (isContainer) {
    return (
      <div ref={setNodeRef} {...commonProps}>
        {renderChildren()}
      </div>
    );
  }

  // Fallback
  return (
    <div ref={setNodeRef} {...commonProps}>
      {renderChildren()}
    </div>
  );
}
