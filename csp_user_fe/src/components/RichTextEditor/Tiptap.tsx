import {useEditor, EditorContent} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Toolbars from "./Toolbars"
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Strike from '@tiptap/extension-strike'
import { BulletList, ListItem, OrderedList } from '@tiptap/extension-list'

interface Props {
    onChange: (richText: string)=> void,
    defaultValue?: string
}

const Tiptap = ({ onChange, defaultValue }: Props) => {
    const editor = useEditor({
        extensions: [StarterKit.configure() as any, Paragraph, Strike, BulletList, OrderedList, ListItem, Underline, Heading, TextAlign.configure({
            types: ['heading', 'paragraph'],
          })],
        content: defaultValue,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none"
            }
        }, onUpdate({editor}){
            onChange(editor.getHTML())
        }
    })

    return (
        <div className="flex flex-col justify-center gap-2">
            <Toolbars editor={editor} />
            <EditorContent editor={editor} className="border rounded-lg"/>
        </div>
    )
}

export default Tiptap
