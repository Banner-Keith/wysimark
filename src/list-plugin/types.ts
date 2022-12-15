import { Descendant } from "slate"

/**
 * List Editor
 */

export type ListEditor = {
  supportsList: true
  list: {
    indent: () => boolean
    outdent: () => boolean
  }
}

/**
 * Ordered List Item Element
 */

export type OrderedListItemElement = {
  type: "ordered-list-item"
  depth: number
  number: number
  children: Descendant[]
}

/**
 * Unordered List Item Element
 */

export type UnorderedListItemElement = {
  type: "unordered-list-item"
  depth: number
  children: Descendant[]
}

/**
 * Checkable Task List Item Element
 */

export type TaskListItemElement = {
  type: "task-list-item"
  depth: number
  checked: boolean
  children: Descendant[]
}

/**
 * Any List Item Element
 */

export type ListItemElement =
  | OrderedListItemElement
  | UnorderedListItemElement
  | TaskListItemElement

/**
 * List Plugins Custom Types
 */

export type ListPluginCustomTypes = {
  Name: "list"
  Editor: ListEditor
  Element:
    | OrderedListItemElement
    | UnorderedListItemElement
    | TaskListItemElement
}