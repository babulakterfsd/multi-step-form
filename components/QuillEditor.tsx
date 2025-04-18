/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function QuillEditor({
  value,
  onChange,
  placeholder,
}: QuillEditorProps) {
  const quillRef = useRef<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (editorRef.current && !quillRef.current && !isMounted.current) {
      isMounted.current = true;
      import("quill").then((QuillModule) => {
        const Quill = QuillModule.default;

        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }

        const container = document.createElement("div");
        editorRef.current?.appendChild(container);

        quillRef.current = new Quill(container, {
          modules: {
            toolbar: [
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
            ],
          },
          theme: "snow",
          placeholder: placeholder || "Write something...",
        });

        // Handle text change
        quillRef.current.on("text-change", () => {
          if (quillRef.current) {
            onChange(quillRef.current.root.innerHTML);
          }
        });

        // Set initial value
        if (value) {
          quillRef.current.root.innerHTML = value;
        }
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.off("text-change");
        const editorElement = editorRef.current;
        if (editorElement) {
          editorElement.innerHTML = "";
        }
        quillRef.current = null;
      }
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && quillRef.current.root.innerHTML !== value) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);

  return <div ref={editorRef} className="h-[150px]" />;
}
