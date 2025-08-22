import { Bold, Italic, List, ListOrdered, MoveLeft, MoveRight, MoveVertical, Strikethrough, Underline } from "lucide-react";

export type TaskType = (typeof tools)[number]["task"]
export const tools = [
  { task: "bold", icon: <Bold size={20}/>},
  { task: "italic", icon: <Italic size={20}/>},
  { task: "underline", icon: <Underline size={20}/>},
  { task: "strike", icon: <Strikethrough size={20}/>},
  { task: "bulletList", icon: <List size={20}/>},
  { task: "orderedList", icon: <ListOrdered size={20}/>},
  { task: "left", icon: <MoveLeft size={20}/>},
  { task: "center", icon: <MoveVertical size={20}/>},
  { task: "right", icon: <MoveRight size={20}/>},
] as const

export const headingOptions = [
    { task: "p", value: "Paragraph"},
    { task: "h1", value: "Heading 1"},
    { task: "h2", value: "Heading 2"},
    { task: "h3", value: "Heading 3"}
] as const

export type HeadingType = (typeof headingOptions)[number]["task"]
