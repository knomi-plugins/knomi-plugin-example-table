// ============================================================
// 示例表格能力包（Knomi 能力包市场示例，UX-DESIGN P2）
// 演示：
//   1. context.registerViewSchema —— 声明视图 Schema（数据如何呈现）
//   2. context.registerAgentTool —— 工具返回 { output, ui }
//      ui.intent = 'show_view' → 中枢将内容区切换为表格渲染
// 能力包不自带 UI，界面由 knomi-agent 中枢统一渲染。
// ============================================================

module.exports = {
  id: 'example-table',
  name: '示例表格能力包',
  version: '0.1.2',
  description: '演示能力包机制：工具返回结构化数据，中枢渲染为表格视图（show_view）',

  async activate(context) {
    // 1. 注册视图 Schema（声明性：中枢据此知道该能力包可产生表格视图）
    context.registerViewSchema({
      name: 'doc_table',
      description: '文档清单表格视图',
      schemaType: 'table',
    })

    // 2. 注册 Agent 工具：返回 { output, ui }，ui 声明 show_view 意图
    context.registerAgentTool(
      {
        name: 'list_docs_table',
        description: '演示意图协议 show_view + 视图 Schema 的示例工具（产出为演示数据形态）。仅当用户明确说「演示表格视图」时使用；用户想真实列出/查看自己的文档时不要使用本工具。',
        parameters: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      async () => {
        const docs = (context.getDocuments && (await context.getDocuments())) || []
        return {
          output: `已获取 ${docs.length} 篇文档，并以表格视图展示${docs.length > 50 ? `（视图仅展示前 50 条）` : ''}。`,
          ui: {
            intent: 'show_view',
            view: {
              title: '文档清单',
              columns: [
                { key: 'title', label: '标题' },
                { key: 'filePath', label: '路径', width: 320 },
                { key: 'wordCount', label: '字数', width: 90 },
              ],
              rows: docs.slice(0, 50).map((d) => ({
                title: d.title || '-',
                filePath: d.filePath || '',
                wordCount: d.wordCount ?? 0,
              })),
            },
          },
        }
      }
    )
    context.log('示例表格能力包已激活：工具 list_docs_table 可用')
  },

  async deactivate() {
    // 工具注销由 PluginHost 兜底（getToolsByPlugin → unregisterTool）
  },
}
