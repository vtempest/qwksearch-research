'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { useEffect, useRef, useState } from 'react';
import { Highlighter, Underline as UnderlineIcon } from 'lucide-react';

type Props = {
  content: string;
};

type MarkMode = 'highlight' | 'underline';

export function TiptapHighlightReader({ content }: Props) {
  const [markMode, setMarkMode] = useState<MarkMode>('highlight');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
    ],
    content,
    editable: false, // make editor read-only from the start
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editor || !containerRef.current) return;

    const el = containerRef.current;

    const handleMouseUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;

      // Ensure selection is inside this editor
      if (!el.contains(sel.anchorNode) || !el.contains(sel.focusNode)) return;

      // Toggle mark based on current mode
      if (markMode === 'highlight') {
        editor.chain().focus().toggleHighlight().run();
      } else {
        editor.chain().focus().toggleUnderline().run();
      }

      // Optional: clear DOM selection so user sees result only
      sel.removeAllRanges();
    };

    el.addEventListener('mouseup', handleMouseUp);
    return () => {
      el.removeEventListener('mouseup', handleMouseUp);
    };
  }, [editor, markMode]);

  return (
    <div className="space-y-3">
      {/* Toggle Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMarkMode('highlight')}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            markMode === 'highlight'
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          <Highlighter className="h-4 w-4" />
          Highlight
        </button>
        <button
          onClick={() => setMarkMode('underline')}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            markMode === 'underline'
              ? 'bg-blue-100 text-blue-800 border border-blue-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          <UnderlineIcon className="h-4 w-4" />
          Underline
        </button>
        <span className="text-xs text-muted-foreground ml-2">
          Select text to {markMode === 'highlight' ? 'highlight' : 'underline'}
        </span>
      </div>

      {/* Editor Content */}
      <div
        ref={containerRef}
        className="prose dark:prose-invert max-w-none text-md text-foreground leading-relaxed"
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
