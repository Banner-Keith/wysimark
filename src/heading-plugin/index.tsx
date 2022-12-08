import { isHotkey } from "is-hotkey"
import React from "react"
import { Descendant, Editor, Element, Range } from "slate"

import { createHotkeyHandler, createPlugin, replaceElements } from "~/src/sink"

export type HeadingEditor = {
  supportsHeadings: true
  headingPlugin: {
    toggleHeading: (level: HeadingElement["level"]) => void
  }
}

export type HeadingElement = {
  type: "heading"
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: Descendant[]
}

export type HeadingPluginCustomTypes = {
  Name: "heading"
  Editor: HeadingEditor
  Element: HeadingElement
}

export const HeadingPlugin = () =>
  createPlugin<HeadingPluginCustomTypes>((editor) => {
    editor.supportsHeadings = true
    const p = (editor.headingPlugin = {
      toggleHeading: (level) => {
        replaceElements(editor, (element) => {
          if (element.type === "heading" && element.level === level) {
            return { type: "paragraph", children: element.children }
          } else if (
            element.type === "paragraph" ||
            element.type === "heading"
          ) {
            return { type: "heading", level, children: element.children }
          } else {
            return null
          }
        })
      },
    })
    /**
     * This allows a break to be inserted only if we are at the end of aline
     */
    // const originalInsertBreak = editor.insertBreak
    // editor.insertBreak = () => {
    //   if (editor.selection === null) return false
    //   if (!Range.isCollapsed(editor.selection)) return false
    //   const entry = Editor.above(editor, {
    //     match: (node) => Element.isElement(node) && node.type === "heading",
    //   })
    //   if (entry === undefined) return false
    //   if (Editor.isEnd(editor, editor.selection.anchor, entry[1])) {
    //     originalInsertBreak()
    //     return true
    //   }
    // }
    return {
      name: "heading",
      editor: {
        isInline(element) {
          if (element.type === "heading") return false
        },
        isVoid(element) {
          if (element.type === "heading") return false
        },
      },
      editableProps: {
        renderElement: ({ element, attributes, children }) => {
          if (element.type === "heading") {
            const Heading = `h${element.level}`
            return <Heading {...attributes}>{children}</Heading>
          }
        },
        onKeyDown: createHotkeyHandler({
          "super+1": () => p.toggleHeading(1),
          "super+2": () => p.toggleHeading(2),
          "super+3": () => p.toggleHeading(3),
          "super+4": () => p.toggleHeading(4),
          "super+5": () => p.toggleHeading(5),
          "super+6": () => p.toggleHeading(6),
        }),
      },
    }
  })

function stop(e: KeyboardEvent) {
  e.preventDefault()
  e.stopPropagation()
}
