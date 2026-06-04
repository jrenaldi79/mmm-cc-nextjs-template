// Shared TypeScript type definitions

export interface MarkdownFile {
  path: string
  name: string
}

export interface MarkdownContent {
  content: string
  html: string
  file: string
}

export interface ApiError {
  error: string
}