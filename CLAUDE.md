# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指导。

## 命令

- `npm run dev` - 启动开发服务器 (Vite)
- `npm run build` - TypeScript 检查并构建生产版本
- `npm run preview` - 预览生产构建

## 架构

基于 React + TypeScript + Vite 的待办事项应用，使用 localStorage 持久化存储。

**状态管理**: 自定义 Hook `src/hooks/useTodos.ts` 管理所有待办状态和 localStorage 同步。组件通过 props 接收状态和回调函数。

**组件结构**: `src/App.tsx` 组合 Header、TodoInput、FilterBar、TodoList 和 Footer 组件。TodoList 为每个待办项渲染 TodoItem。

**类型定义**: `src/types/todo.ts` 定义 `Todo` 接口和 `FilterType` 联合类型。
