import "../../src/setup"

import { useState } from "react"
import { BaseEditor, BaseText, createEditor } from "slate"
import { withHistory } from "slate-history"
import { ReactEditor, RenderLeafProps, Slate, withReact } from "slate-react"

import {
  AnchorElement,
  AnchorPlugin,
  AnchorPluginCustomTypes,
} from "~/src/anchor-plugin"
import {
  AtomicDeletePlugin,
  AtomicDeletePluginCustomTypes,
} from "~/src/atomic-delete-plugin"
import {
  BlockQuoteElement,
  BlockQuotePlugin,
  BlockQuotePluginCustomTypes,
} from "~/src/block-quote-plugin"
import {
  CodeBlockElement,
  CodeBlockLineElement,
  CodeBlockPlugin,
  CodeBlockPluginCustomTypes,
} from "~/src/code-block-plugin"
import {
  CollapsibleParagraphPlugin,
  CollapsibleParagraphPluginCustomTypes,
  ParagraphElement,
} from "~/src/collapsible-paragraph-plugin"
import {
  HeadingElement,
  HeadingPlugin,
  HeadingPluginCustomTypes,
} from "~/src/heading-plugin"
import {
  HorizontalRuleElement,
  HorizontalRulePlugin,
  HorizontalRulePluginCustomTypes,
} from "~/src/horizontal-rule-plugin"
import { ImagePlugin } from "~/src/image-plugin"
import {
  ImageBlockElement,
  ImageInlineElement,
  ImagePluginCustomTypes,
} from "~/src/image-plugin/types"
import {
  InlineCodePlugin,
  InlineCodePluginCustomTypes,
} from "~/src/inline-code-plugin"
import {
  ListPlugin,
  ListPluginCustomTypes,
  OrderedListItemElement,
  TaskListItemElement,
  UnorderedListItemElement,
} from "~/src/list-plugin"
import { MarksPlugin, MarksPluginCustomTypes } from "~/src/marks-plugin"
import {
  NormalizeAfterDeletePlugin,
  NormalizeAfterDeletePluginCustomTypes,
} from "~/src/normalize-after-delete-plugin"
import { createSink, MergePluginCustomTypes } from "~/src/sink"
import {
  TableCellElement,
  TableContentElement,
  TableElement,
  TablePlugin,
  TablePluginCustomTypes,
  TableRowElement,
} from "~/src/table-plugin"
import { ThemePlugin, ThemePluginCustomTypes } from "~/src/theme-plugin"
import { ToolbarPlugin, ToolbarPluginCustomTypes } from "~/src/toolbar-plugin"
import { TrailingBlockPlugin } from "~/src/trailing-block-plugin"
import {
  UploadAttachmentElement,
  UploadAttachmentPlugin,
  UploadAttachmentPluginCustomTypes,
} from "~/src/upload-attachment-plugin"
import { UploadPlugin, UploadPluginCustomTypes } from "~/src/upload-plugin"

import { initialValue } from "./initial-value"

const Sink = createSink([
  AnchorPlugin(),
  HeadingPlugin(),
  InlineCodePlugin(),
  MarksPlugin(),
  BlockQuotePlugin(),
  CodeBlockPlugin(),
  TablePlugin(),
  HorizontalRulePlugin(),
  TrailingBlockPlugin({
    createTrailingBlock: () => ({
      type: "paragraph",
      children: [{ text: "" }],
    }),
  }),
  ListPlugin(),
  AtomicDeletePlugin(),
  NormalizeAfterDeletePlugin(),
  CollapsibleParagraphPlugin(),
  ThemePlugin(),
  ToolbarPlugin(),
  UploadPlugin({ authToken: process.env.NEXT_PUBLIC_PORTIVE_AUTH_TOKEN }),
  UploadAttachmentPlugin(),
  ImagePlugin(),
])

const { withSink, SinkEditable } = Sink

export type PluginCustomTypes = MergePluginCustomTypes<
  [
    AnchorPluginCustomTypes,
    HeadingPluginCustomTypes,
    MarksPluginCustomTypes,
    InlineCodePluginCustomTypes,
    BlockQuotePluginCustomTypes,
    CodeBlockPluginCustomTypes,
    TablePluginCustomTypes,
    HorizontalRulePluginCustomTypes,
    ListPluginCustomTypes,
    AtomicDeletePluginCustomTypes,
    NormalizeAfterDeletePluginCustomTypes,
    CollapsibleParagraphPluginCustomTypes,
    ThemePluginCustomTypes,
    ToolbarPluginCustomTypes,
    UploadPluginCustomTypes,
    UploadAttachmentPluginCustomTypes,
    ImagePluginCustomTypes
  ]
>

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & PluginCustomTypes["Editor"]
    /**
     * TODO:
     *
     * This doesn't work because of a claim of a circular reference. But, I
     * think I discovered a fix.
     *
     * PluginCustomTypes["Element"]
     *
     * It appears the issue is in MergePluginCustomTypes because of this code:
     *
     * Element: TupleToUnion<MapPropIfExtends<T, { Element: BaseElement },
     *   "Element">
     *
     * The circule reference comes from { Element: BaseElement } which is
     * replaced when the Element value does not exist. This was used primarily
     * so that if the `Element` type does not exist for the plugin, then it
     * defaults to `BaseElement` but `BaseElement` refers to children of type
     * `Descendant` which itself refers back to `CustomTypes`.
     *
     * So a solution that worked when I tried it as a proof of concept was to
     * instead set `Element: never` and when we `|` it together with other
     * elements, it will basically just ignore the `CustomTypes["Element"]` for
     * that particular plugin.
     */
    Element:
      | AnchorElement
      | HeadingElement
      | BlockQuoteElement
      | CodeBlockElement
      | CodeBlockLineElement
      | HorizontalRuleElement
      | TableElement
      | TableRowElement
      | TableCellElement
      | TableContentElement
      | OrderedListItemElement
      | UnorderedListItemElement
      | TaskListItemElement
      | ParagraphElement
      | UploadAttachmentElement
      | ImageBlockElement
      | ImageInlineElement
    Text: BaseText & PluginCustomTypes["Text"]
  }
}

function renderLeaf({ children, attributes }: RenderLeafProps) {
  return <span {...attributes}>{children}</span>
}

export const MyEditor = () => {
  /**
   * TODO:
   *
   * We want to get a new instance of the editor if any of the plugins are
   * updated.
   *
   * In order to get this to work, I think we need to create the Sink inside
   * of the Component. Otherwise, React doesn't recognize the changes in the
   * Editor components.
   */

  // function useEditor<T extends BaseEditor>(fn: () => T, deps: unknown[]): T {
  //   const [editor, setEditor] = useState(fn)
  //   useMemo(() => {
  //     setEditor(fn())
  //   }, deps)
  //   return editor
  // }

  const [editor] = useState(() => {
    const editor = createEditor()
    editor.isConvertible = (element) => element.type === "paragraph"
    return withSink(withReact(withHistory(editor)))
  })

  return (
    <div>
      <Slate editor={editor} value={initialValue}>
        <SinkEditable renderLeaf={renderLeaf} />
      </Slate>
      <div className="">
        {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((x, i) => (
          <p key={i}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        ))}
      </div>
    </div>
  )
}
