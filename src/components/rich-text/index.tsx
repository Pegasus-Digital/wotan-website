import React from 'react'
import { createEditor, BaseEditor, Editor, Element as SlateElement, Transforms } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory, HistoryEditor } from 'slate-history'
import { slateEditor } from '@payloadcms/richtext-slate'
import { Icons } from '@/components/icons'

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: {
      type: string
      align?: string
      url?: string
    }
  }
}

interface RichTextProps {
  value: any[]
  onChange: (value: any[]) => void
  className?: string
}

const initialValue = [
  {
    children: [{ text: '' }],
  },
]

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

export function RichText({ value, onChange, className }: RichTextProps) {
  const editor = React.useMemo(() => withHistory(withReact(createEditor())), [])
  
  const toggleBlock = (editor: CustomEditor, format: string) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)
    const isAlign = TEXT_ALIGN_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPES.includes(n.type as string),
      split: true,
    })

    let newProperties: Partial<SlateElement>
    if (isAlign) {
      newProperties = {
        align: isActive ? undefined : format,
      }
    } else {
      newProperties = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
      }
    }
    Transforms.setNodes<SlateElement>(editor, newProperties)

    if (!isActive && isList) {
      const block = { type: format, children: [] }
      Transforms.wrapNodes(editor, block)
    }
  }

  const toggleMark = (editor: CustomEditor, format: string) => {
    const isActive = isMarkActive(editor, format)
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }

  const isBlockActive = (editor: CustomEditor, format: string) => {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === format,
      })
    )

    return !!match
  }

  const isMarkActive = (editor: CustomEditor, format: string) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
  }

  const renderElement = React.useCallback(({ attributes, children, element }: any) => {
    const style = { textAlign: element.align }
    switch (element.type) {
      case 'h3':
        return <h3 style={style} {...attributes}>{children}</h3>
      case 'h4':
        return <h4 style={style} {...attributes}>{children}</h4>
      case 'h5':
        return <h5 style={style} {...attributes}>{children}</h5>
      case 'h6':
        return <h6 style={style} {...attributes}>{children}</h6>
      case 'link':
        return (
          <a href={element.url} style={style} {...attributes}>
            {children}
          </a>
        )
      case 'bulleted-list':
        return <ul style={style} {...attributes}>{children}</ul>
      case 'numbered-list':
        return <ol style={style} {...attributes}>{children}</ol>
      case 'list-item':
        return <li style={style} {...attributes}>{children}</li>
      default:
        return <p style={style} {...attributes}>{children}</p>
    }
  }, [])

  const renderLeaf = React.useCallback(({ attributes, children, leaf }: any) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>
    }
    if (leaf.italic) {
      children = <em>{children}</em>
    }
    if (leaf.underline) {
      children = <u>{children}</u>
    }
    if (leaf.strikethrough) {
      children = <s>{children}</s>
    }
    return <span {...attributes}>{children}</span>
  }, [])

  return (
    <div className={className}>
      <Slate
        editor={editor}
        value={value || initialValue}
        onChange={onChange}
      >
        <div className="border rounded-md">
          <div className="border-b p-2 flex flex-wrap gap-2">
            <div className="flex gap-1 border-r pr-2">
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded"
                onMouseDown={(e) => {
                  e.preventDefault()
                  toggleMark(editor, 'bold')
                }}
                title="Negrito"
              >
                <Icons.Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded"
                onMouseDown={(e) => {
                  e.preventDefault()
                  toggleMark(editor, 'italic')
                }}
                title="Itálico"
              >
                <Icons.Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded"
                onMouseDown={(e) => {
                  e.preventDefault()
                  toggleMark(editor, 'underline')
                }}
                title="Sublinhado"
              >
                <Icons.Underline className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded"
                onMouseDown={(e) => {
                  e.preventDefault()
                  toggleMark(editor, 'strikethrough')
                }}
                title="Tachado"
              >
                <Icons.Strikethrough className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded"
                onMouseDown={(e) => {
                  e.preventDefault()
                  toggleBlock(editor, 'left')
                }}
                title="Alinhar à esquerda"
              >
                <Icons.AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded"
                onMouseDown={(e) => {
                  e.preventDefault()
                  toggleBlock(editor, 'center')
                }}
                title="Centralizar"
              >
                <Icons.AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded"
                onMouseDown={(e) => {
                  e.preventDefault()
                  toggleBlock(editor, 'right')
                }}
                title="Alinhar à direita"
              >
                <Icons.AlignRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-100 rounded"
                onMouseDown={(e) => {
                  e.preventDefault()
                  toggleBlock(editor, 'justify')
                }}
                title="Justificar"
              >
                <Icons.AlignJustify className="w-4 h-4" />
              </button>
            </div>
          </div>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Digite seu conteúdo aqui..."
            className="p-4 min-h-[200px] prose prose-sm max-w-none"
            spellCheck
            autoFocus
          />
        </div>
      </Slate>
    </div>
  )
} 