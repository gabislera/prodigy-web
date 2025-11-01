import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Code,
	Italic,
	List,
	ListOrdered,
	Redo,
	Strikethrough,
	Underline as UnderlineIcon,
	Undo,
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
}

export function RichTextEditor({
	content,
	onChange,
	placeholder,
}: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				orderedList: {
					HTMLAttributes: {
						class: "list-decimal ml-4",
					},
				},
				bulletList: {
					HTMLAttributes: {
						class: "list-disc ml-4",
					},
				},
				code: {
					HTMLAttributes: {
						class: "bg-muted rounded px-1 py-0.5 font-mono text-sm",
					},
				},
				codeBlock: {
					HTMLAttributes: {
						class: "bg-muted rounded p-4 font-mono text-sm my-2",
					},
				},
				heading: false,
				strike: {
					HTMLAttributes: {
						class: "line-through",
					},
				},
			}),
			Underline,
			TextStyle,
			Placeholder.configure({
				placeholder: placeholder || "Digite aqui...",
				emptyEditorClass:
					"before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:h-0 before:pointer-events-none",
			}),
		],
		content,
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class:
					"prose prose-sm prose-invert max-w-none focus:outline-none min-h-[200px] max-h-[400px] overflow-y-auto px-3 py-2 text-foreground scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-600 scrollbar-track-transparent",
			},
		},
	});

	// Sync content with external state
	useEffect(() => {
		if (!editor) return;

		const currentContent = editor.getHTML();
		const normalizedCurrent =
			currentContent === "<p></p>" ? "" : currentContent;
		const normalizedContent = content || "";

		// Only update if the normalized content is actually different
		if (normalizedContent !== normalizedCurrent) {
			editor.commands.setContent(normalizedContent);
		}
	}, [content, editor]);

	if (!editor) {
		return null;
	}

	const ToolbarButton = ({
		onClick,
		active,
		disabled,
		children,
		title,
	}: {
		onClick: () => void;
		active?: boolean;
		disabled?: boolean;
		children: React.ReactNode;
		title: string;
	}) => (
		<Button
			type="button"
			variant="ghost"
			size="sm"
			onClick={onClick}
			disabled={disabled}
			title={title}
			className={cn(
				"h-8 w-8 p-0",
				active && "bg-accent text-accent-foreground",
			)}
		>
			{children}
		</Button>
	);

	return (
		<div className="border border-border rounded-md bg-background overflow-hidden">
			<div className="flex items-center gap-1 p-1 border-b border-border bg-muted/50">
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					active={editor.isActive("bold")}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					title="Negrito (Ctrl+B)"
				>
					<Bold className="h-4 w-4" />
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleItalic().run()}
					active={editor.isActive("italic")}
					disabled={!editor.can().chain().focus().toggleItalic().run()}
					title="Itálico (Ctrl+I)"
				>
					<Italic className="h-4 w-4" />
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					active={editor.isActive("underline")}
					disabled={!editor.can().chain().focus().toggleUnderline().run()}
					title="Sublinhado (Ctrl+U)"
				>
					<UnderlineIcon className="h-4 w-4" />
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleStrike().run()}
					active={editor.isActive("strike")}
					disabled={!editor.can().chain().focus().toggleStrike().run()}
					title="Riscado"
				>
					<Strikethrough className="h-4 w-4" />
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleCode().run()}
					active={editor.isActive("code")}
					disabled={!editor.can().chain().focus().toggleCode().run()}
					title="Código (Ctrl+E)"
				>
					<Code className="h-4 w-4" />
				</ToolbarButton>

				<div className="w-px h-6 bg-border mx-1" />

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					active={editor.isActive("bulletList")}
					title="Lista com marcadores"
				>
					<List className="h-4 w-4" />
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					active={editor.isActive("orderedList")}
					title="Lista numerada"
				>
					<ListOrdered className="h-4 w-4" />
				</ToolbarButton>

				<div className="w-px h-6 bg-border mx-1" />

				<ToolbarButton
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
					title="Desfazer (Ctrl+Z)"
				>
					<Undo className="h-4 w-4" />
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
					title="Refazer (Ctrl+Y)"
				>
					<Redo className="h-4 w-4" />
				</ToolbarButton>
			</div>

			<EditorContent editor={editor} />
		</div>
	);
}
