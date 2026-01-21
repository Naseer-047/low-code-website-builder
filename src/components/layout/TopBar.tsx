
import { Monitor, Smartphone, Tablet, Download, Play, EyeOff } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';
import { generateCode } from '@/lib/codeGenerator';

export function TopBar() {
  const { device, setDevice, isPreview, setPreview, nodes } = useEditorStore();

  const handleExport = () => {
    // Actually standard export usually involves the whole tree.
    // nodes[0] is our "Body" container in this specific data model.
    // Let's pass the whole root's children to avoid double body tag.
    const html = generateCode(nodes[0].children); // We only export content of the "Body" node usually. 
    // Actually generateCode wraps in html/body again.
    // Let's fix generateCode usage or implementation.
    // If generateCode creates <html>...</html>, we should pass the full nodes list or just the body's children.
    // Let's pass nodes[0].children since nodes[0] is the internal "Body" wrapper.

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isPreview) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setPreview(false)}
          className="bg-black text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-zinc-800 transition-all"
        >
          <EyeOff size={16} /> Exit Preview
        </button>
      </div>
    );
  }

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
        <span className="font-semibold text-lg tracking-tight">AetherBuilder</span>
      </div>

      <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50">
        <DeviceBtn active={device === 'desktop'} onClick={() => setDevice('desktop')} icon={<Monitor size={16} />} />
        <DeviceBtn active={device === 'tablet'} onClick={() => setDevice('tablet')} icon={<Tablet size={16} />} />
        <DeviceBtn active={device === 'mobile'} onClick={() => setDevice('mobile')} icon={<Smartphone size={16} />} />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setPreview(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Play size={16} />
          Preview
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <Download size={16} />
          Export Code
        </button>
      </div>
    </header>
  );
}

function DeviceBtn({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-md transition-all",
        active ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
    </button>
  );
}
