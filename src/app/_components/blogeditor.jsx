"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { BLOG_CONTENT_CLASS } from "./blogcontentstyles";

function ToolbarButton({ onClick, active, disabled, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium border transition-all duration-200 whitespace-nowrap ${
        active
          ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/30"
          : "bg-gray-900/60 text-gray-200 border-orange-500/30 hover:border-orange-500/70 hover:bg-orange-500/10 hover:-translate-y-0.5"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  );
}

export default function BlogEditor({ value, onChange }) {
  const [toolbarState, setToolbarState] = useState({
    bold: false,
    italic: false,
    h2: false,
    h3: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
    link: false,
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: "Write your blog content...",
      }),
    ],
    content: value?.html || "<p></p>",
    onUpdate: ({ editor: currentEditor }) => {
      const json = currentEditor.getJSON();
      const html = currentEditor.getHTML();
      onChange({ json, html });
    },
    editorProps: {
      attributes: {
        class: `w-full rounded-lg border border-orange-500/30 bg-[#0f0f0f] p-4 text-gray-100 focus:outline-none min-h-[360px] max-h-[70vh] overflow-y-auto ${BLOG_CONTENT_CLASS}`,
      },
    },
  });

  useEffect(() => {
    if (!editor || !value) {
      return;
    }

    const incomingHtml = value.html || "<p></p>";
    if (incomingHtml !== editor.getHTML()) {
      editor.commands.setContent(incomingHtml, false);
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const syncToolbarState = () => {
      setToolbarState({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        h2: editor.isActive("heading", { level: 2 }),
        h3: editor.isActive("heading", { level: 3 }),
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
        blockquote: editor.isActive("blockquote"),
        link: editor.isActive("link"),
      });
    };

    syncToolbarState();
    editor.on("selectionUpdate", syncToolbarState);
    editor.on("transaction", syncToolbarState);
    editor.on("focus", syncToolbarState);
    editor.on("blur", syncToolbarState);

    return () => {
      editor.off("selectionUpdate", syncToolbarState);
      editor.off("transaction", syncToolbarState);
      editor.off("focus", syncToolbarState);
      editor.off("blur", syncToolbarState);
    };
  }, [editor]);

  const setLink = () => {
    if (!editor) {
      return;
    }

    const previous = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", previous);
    if (url === null) {
      return;
    }

    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  if (!editor) {
    return <div className="text-gray-400">Loading editor...</div>;
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto pb-1">
        <div className="flex flex-nowrap sm:flex-wrap gap-2 min-w-max sm:min-w-0">
        <ToolbarButton
          label="Bold"
          active={toolbarState.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          active={toolbarState.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="H2"
          active={toolbarState.h2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="H3"
          active={toolbarState.h3}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <ToolbarButton
          label="Bullet List"
          active={toolbarState.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Numbered List"
          active={toolbarState.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Quote"
          active={toolbarState.blockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          label="Link"
          active={toolbarState.link}
          onClick={setLink}
        />
        <ToolbarButton
          label="Clear"
          active={false}
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        />
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
