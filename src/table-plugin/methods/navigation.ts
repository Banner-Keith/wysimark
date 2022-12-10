import { Editor, Path } from "slate"

import { selectStartOfElement } from "~/src/sink"

import { getTableInfo } from "./get-table-info"

/**
 * arrow down
 */
export function down(editor: Editor): boolean {
  const t = getTableInfo(editor)
  /**
   * exit if we're not in a table
   */
  if (!t) return false
  const { cellIndex, rowIndex, rowCount, tablePath } = t
  /**
   * if we aren't in the last row of a table, move down a row
   */
  if (rowIndex < rowCount - 1) {
    selectStartOfElement(editor, [...tablePath, rowIndex + 1, cellIndex])
    return true
  }
  /**
   * If we are in the last row of a table, move to the start of the Element
   * after the table
   */
  try {
    selectStartOfElement(editor, Path.next(tablePath))
    return true
  } catch (e) {
    return false
  }
}

/**
 * arrow up
 */
export function up(editor: Editor): boolean {
  const t = getTableInfo(editor)
  /**
   * exit if we're not in a table
   */
  if (!t) return false
  const { cellIndex, rowIndex, tablePath } = t
  /**
   * If we aren't in the first row of a table, move up a row
   */
  if (rowIndex > 0) {
    selectStartOfElement(editor, [...tablePath, rowIndex - 1, cellIndex])
    return true
  }
  /**
   * If we are in the first row of a table, move to the start of the Element
   * before the table.
   */
  try {
    selectStartOfElement(editor, Path.previous(tablePath))
    return true
  } catch (e) {
    return false
  }
}