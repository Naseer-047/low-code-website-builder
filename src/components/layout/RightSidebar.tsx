import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Simplified Tab Component
const Tabs = ({ options, value, onChange }: { options: string[], value: string, onChange: (v: string) => void }) => (
  <div className="flex border-b border-border bg-muted/40 p-1">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={cn(
          "flex-1 px-2 py-1 text-xs font-medium rounded-sm transition-colors capitalize",
          value === opt ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {opt}
      </button>
    ))}
  </div>
);

export function RightSidebar() {
  const { selectedId, nodes, updateNodeStyle, updateNode, deleteNode } = useEditorStore();
  const [activeTab, setActiveTab] = useState('layout');

  const selectedNode = selectedId ? findNode(nodes, selectedId) : null;

  function findNode(nodes: any[], id: string): any {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  if (!selectedNode) {
    return (
      <aside className="w-80 border-l border-border bg-background flex flex-col justify-center items-center text-muted-foreground p-4 text-center">
        <p className="text-sm">Select an element to edit styles</p>
      </aside>
    );
  }

  const handleStyleChange = (key: string, value: string) => {
    updateNodeStyle(selectedNode.id, { [key]: value });
  };

  const handlePropChange = (key: string, value: any) => {
    updateNode(selectedNode.id, { props: { ...selectedNode.props, [key]: value } });
  };

  return (
    <aside className="w-80 border-l border-border bg-background flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold truncate w-40">{selectedNode.name}</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">{selectedNode.type}</span>
        </div>
      </div>

      <Tabs
        options={['layout', 'size', 'style', 'text']}
        value={activeTab}
        onChange={setActiveTab}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* LAYOUT TAB */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            <Section title="Display">
              <div className="grid grid-cols-2 gap-2">
                <Select label="Display" value={selectedNode.style.display} onChange={(v) => handleStyleChange('display', v)} options={['block', 'flex', 'grid', 'inline-block', 'none']} />
                <Select label="Flex Dir" value={selectedNode.style.flexDirection} onChange={(v) => handleStyleChange('flexDirection', v)} options={['row', 'column', 'row-reverse', 'col-reverse']} />
              </div>
            </Section>
            <Section title="Alignment">
              <div className="grid grid-cols-2 gap-2">
                <Select label="Justify" value={selectedNode.style.justifyContent} onChange={(v) => handleStyleChange('justifyContent', v)} options={['start', 'center', 'end', 'space-between', 'space-around']} />
                <Select label="Align" value={selectedNode.style.alignItems} onChange={(v) => handleStyleChange('alignItems', v)} options={['start', 'center', 'end', 'stretch']} />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input label="Gap" value={selectedNode.style.gap} onChange={(v) => handleStyleChange('gap', v)} placeholder="0px" />
                <Input label="Flex Wrap" value={selectedNode.style.flexWrap} onChange={(v) => handleStyleChange('flexWrap', v)} placeholder="nowrap" />
              </div>
            </Section>
            <Section title="Position">
              <Select label="Type" value={selectedNode.style.position} onChange={(v) => handleStyleChange('position', v)} options={['static', 'relative', 'absolute', 'fixed', 'sticky']} />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input label="Top" value={selectedNode.style.top} onChange={(v) => handleStyleChange('top', v)} />
                <Input label="Right" value={selectedNode.style.right} onChange={(v) => handleStyleChange('right', v)} />
                <Input label="Bottom" value={selectedNode.style.bottom} onChange={(v) => handleStyleChange('bottom', v)} />
                <Input label="Left" value={selectedNode.style.left} onChange={(v) => handleStyleChange('left', v)} />
                <Input label="Z-Index" value={selectedNode.style.zIndex} onChange={(v) => handleStyleChange('zIndex', v)} />
                <Select label="Overflow" value={selectedNode.style.overflow} onChange={(v) => handleStyleChange('overflow', v)} options={['visible', 'hidden', 'scroll', 'auto']} />
              </div>
            </Section>
            <Section title="Spacing">
              <div className="space-y-2">
                <Label>Padding (T R B L)</Label>
                <Input value={selectedNode.style.padding} onChange={(v) => handleStyleChange('padding', v)} placeholder="10px 20px" />
              </div>
              <div className="space-y-2 mt-2">
                <Label>Margin (T R B L)</Label>
                <Input value={selectedNode.style.margin} onChange={(v) => handleStyleChange('margin', v)} placeholder="0px auto" />
              </div>
            </Section>
          </div>
        )}

        {/* SIZE TAB */}
        {activeTab === 'size' && (
          <div className="space-y-4">
            <Section title="Dimensions">
              <div className="grid grid-cols-2 gap-2">
                <Input label="Width" value={selectedNode.style.width} onChange={(v) => handleStyleChange('width', v)} />
                <Input label="Height" value={selectedNode.style.height} onChange={(v) => handleStyleChange('height', v)} />
                <Input label="Min W" value={selectedNode.style.minWidth} onChange={(v) => handleStyleChange('minWidth', v)} />
                <Input label="Min H" value={selectedNode.style.minHeight} onChange={(v) => handleStyleChange('minHeight', v)} />
                <Input label="Max W" value={selectedNode.style.maxWidth} onChange={(v) => handleStyleChange('maxWidth', v)} />
                <Input label="Max H" value={selectedNode.style.maxHeight} onChange={(v) => handleStyleChange('maxHeight', v)} />
              </div>
            </Section>
          </div>
        )}

        {/* STYLE TAB */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            <Section title="Background">
              <div className="grid grid-cols-2 gap-2 items-center">
                <ColorInput value={selectedNode.style.backgroundColor} onChange={(v) => handleStyleChange('backgroundColor', v)} />
                <Input value={selectedNode.style.backgroundColor} onChange={(v) => handleStyleChange('backgroundColor', v)} />
              </div>
            </Section>
            <Section title="Border">
              <div className="grid grid-cols-2 gap-2">
                <Input label="Width" value={selectedNode.style.borderWidth} onChange={(v) => handleStyleChange('borderWidth', v)} />
                <Select label="Style" value={selectedNode.style.borderStyle} onChange={(v) => handleStyleChange('borderStyle', v)} options={['none', 'solid', 'dashed', 'dotted']} />
              </div>
              <div className="mt-2 text-xs">Color</div>
              <div className="grid grid-cols-2 gap-2 items-center">
                <ColorInput value={selectedNode.style.borderColor} onChange={(v) => handleStyleChange('borderColor', v)} />
                <Input value={selectedNode.style.borderColor} onChange={(v) => handleStyleChange('borderColor', v)} />
              </div>
              <div className="mt-2">
                <Input label="Radius" value={selectedNode.style.borderRadius} onChange={(v) => handleStyleChange('borderRadius', v)} />
              </div>
            </Section>
            <Section title="Effects">
              <Input label="Opacity" value={selectedNode.style.opacity} onChange={(v) => handleStyleChange('opacity', v)} type="number" step="0.1" min="0" max="1" />
              <div className="mt-2">
                <Label>Shadow</Label>
                <Select value={selectedNode.style.boxShadow} onChange={(v) => handleStyleChange('boxShadow', v)} options={['none', 'sm', 'md', 'lg', 'xl']} />
              </div>
              <div className="mt-2">
                <Label>Cursor</Label>
                <Select value={selectedNode.style.cursor} onChange={(v) => handleStyleChange('cursor', v)} options={['auto', 'pointer', 'text', 'move', 'not-allowed']} />
              </div>
            </Section>
          </div>
        )}

        {/* TEXT TAB */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <Section title="Typography">
              <div className="grid grid-cols-2 gap-2">
                <Input label="Size" value={selectedNode.style.fontSize} onChange={(v) => handleStyleChange('fontSize', v)} />
                <Select label="Weight" value={selectedNode.style.fontWeight} onChange={(v) => handleStyleChange('fontWeight', v)} options={['300', '400', '500', '600', '700', 'bold']} />
                <Select label="Align" value={selectedNode.style.textAlign} onChange={(v) => handleStyleChange('textAlign', v)} options={['left', 'center', 'right', 'justify']} />
                <Input label="Line Ht" value={selectedNode.style.lineHeight} onChange={(v) => handleStyleChange('lineHeight', v)} />
                <Input label="Letter Sp" value={selectedNode.style.letterSpacing} onChange={(v) => handleStyleChange('letterSpacing', v)} />
              </div>
              <div className="mt-2">
                <Label>Color</Label>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <ColorInput value={selectedNode.style.color} onChange={(v) => handleStyleChange('color', v)} />
                  <Input value={selectedNode.style.color} onChange={(v) => handleStyleChange('color', v)} />
                </div>
              </div>
            </Section>
            <Section title="Content">
              {selectedNode.type === 'text' || selectedNode.type === 'button' || selectedNode.type.startsWith('h') || selectedNode.type === 'paragraph' || selectedNode.type === 'label' ? (
                <div className="space-y-2">
                  <Label>Text Content</Label>
                  <textarea
                    className="w-full min-h-[80px] bg-muted/50 border border-border rounded p-2 text-xs"
                    value={selectedNode.props.content || ''}
                    onChange={(e) => handlePropChange('content', e.target.value)}
                  />
                </div>
              ) : null}
              {selectedNode.type === 'image' || selectedNode.type === 'video' || selectedNode.type === 'avatar' ? (
                <div className="space-y-2">
                  <Label>Source URL</Label>
                  <Input value={selectedNode.props.src} onChange={(v) => handlePropChange('src', v)} />
                </div>
              ) : null}
              {selectedNode.type === 'input' || selectedNode.type === 'textarea' ? (
                <div className="space-y-2">
                  <Label>Placeholder</Label>
                  <Input value={selectedNode.props.placeholder} onChange={(v) => handlePropChange('placeholder', v)} />
                </div>
              ) : null}
            </Section>
          </div>
        )}
      </div>

      <div className="border-t border-border p-4 bg-muted/10">
        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="w-full h-9 rounded-md bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors border border-destructive/20 flex items-center justify-center gap-2"
        >
          Delete {selectedNode.name}
        </button>
      </div>
    </aside>
  );
}

// Helpers
const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-2">
    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{title}</h3>
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs text-muted-foreground mb-1">{children}</div>
);

interface InputProps {
  label?: string;
  value: any;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  step?: string;
  min?: string;
  max?: string;
}

const Input = ({ label, value, onChange, placeholder, type = "text", step, min, max }: InputProps) => (
  <div>
    {label && <Label>{label}</Label>}
    <input
      type={type} step={step} min={min} max={max}
      className="w-full h-8 bg-background border border-border rounded px-2 text-xs focus:ring-1 focus:ring-primary outline-none"
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

interface SelectProps {
  label?: string;
  value: any;
  onChange: (value: string) => void;
  options: string[];
}

const Select = ({ label, value, onChange, options }: SelectProps) => (
  <div>
    {label && <Label>{label}</Label>}
    <select
      className="w-full h-8 bg-background border border-border rounded px-2 text-xs focus:ring-1 focus:ring-primary outline-none"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Default</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ColorInput = ({ value, onChange }: ColorInputProps) => (
  <input
    type="color"
    className="h-8 w-8 rounded cursor-pointer border-0 p-0"
    style={{ backgroundColor: 'transparent' }}
    value={value || '#000000'}
    onChange={(e) => onChange(e.target.value)}
  />
);
