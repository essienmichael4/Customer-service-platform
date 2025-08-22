import { type TaskType, tools, type HeadingType, headingOptions } from "@/constants"
import {type ChainedCommands, Editor } from "@tiptap/react"
import IconButton from "./IconButton"
import type { ChangeEventHandler } from "react"

interface Props {
    editor: Editor | null
}

const chainMethods = (editor:Editor | null, command: (chain:ChainedCommands)=>ChainedCommands) => {
    if(!editor) return
    return command(editor.chain().focus()).run()
}

const Toolbars = ({editor}:Props) => {
    if(!editor) return null
    
    const handleOnClick = (task:TaskType)=>{
        switch(task){
            case "bold":
                return chainMethods(editor, chain => chain.toggleMark("bold"))
            case "italic":
                return chainMethods(editor, chain => chain.toggleMark("italic"))
            case "underline":
                return chainMethods(editor, chain => chain.toggleUnderline())
            case "strike":
                return chainMethods(editor, chain => chain.toggleStrike())
            case "bulletList":
                return chainMethods(editor, chain => chain.toggleBulletList())
            case "orderedList":
                return chainMethods(editor, chain => chain.toggleOrderedList())
            case "left":
                return chainMethods(editor, chain => chain.setTextAlign("left"))
            case "center":
                return chainMethods(editor, chain => chain.setTextAlign("center"))
            case "right":
                return chainMethods(editor, chain => chain.setTextAlign("right"))
        }
    }

    const handleHeadingSelectionChange: ChangeEventHandler<HTMLSelectElement> = ({target})=>{
        const {value} = target as {value: HeadingType}
        switch(value){
            case "p":
                return chainMethods(editor, chain => chain.setParagraph())
            case "h1":
                return chainMethods(editor, chain => chain.toggleHeading({level: 1}))
            case "h2":
                return chainMethods(editor, chain => chain.toggleHeading({level: 2}))
            case "h3":
                return chainMethods(editor, chain => chain.toggleHeading({level: 3}))
        }
    }

    const getSelectedHeading =():HeadingType=>{
        let result: HeadingType = "p"

        if(editor.isActive("heading", {level: 1})) result = "h1"
        if(editor.isActive("heading", {level: 2})) result = "h2"
        if(editor.isActive("heading", {level: 3})) result = "h3"

        return result
    }

    return (
        <div className="border border-input bg-transparent rounded-md space-x-1 p-1">
            <select value={getSelectedHeading()} className="p-2" onChange={handleHeadingSelectionChange}>
                {headingOptions.map(item=>{
                    return <option key={item.task} value={item.task}>{item.value}</option>
                })}
            </select>
            {tools.map(({icon, task})=>{                
                return <IconButton key={task}
                  active={editor.isActive(task) || editor.isActive({textAlign: task})}
                  onClick={()=>handleOnClick(task)}
                  > {icon} </IconButton>
            })}
        </div>
    )
}

export default Toolbars
