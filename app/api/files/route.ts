import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const PROJECT_ROOT = path.resolve(process.cwd())

export interface FileNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileNode[]
}

async function findMarkdownFiles(dir: string, fileList: string[] = []): Promise<string[]> {
  const files = await fs.readdir(dir, { withFileTypes: true })
  const excludedDirs = ['node_modules', '.git', '.cache', '.config', '.npm', '.next']
  
  for (const file of files) {
    const filePath = path.join(dir, file.name)
    
    if (file.isDirectory() && !excludedDirs.includes(file.name)) {
      try {
        await findMarkdownFiles(filePath, fileList)
      } catch (err) {
        continue
      }
    } else if (file.isFile() && file.name.endsWith('.md')) {
      const relativePath = path.relative(PROJECT_ROOT, filePath)
      fileList.push(relativePath)
    }
  }
  
  return fileList
}

function buildTree(paths: string[]): FileNode[] {
  const root = new Map<string, FileNode>()
  const childrenMaps = new Map<FileNode, Map<string, FileNode>>()
  
  paths.forEach((filePath) => {
    const parts = filePath.split(path.sep)
    let currentLevel = root
    
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1
      const currentPath = parts.slice(0, index + 1).join(path.sep)
      
      if (!currentLevel.has(part)) {
        const node: FileNode = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'folder',
        }
        
        currentLevel.set(part, node)
        
        if (!isFile) {
          childrenMaps.set(node, new Map<string, FileNode>())
        }
      }
      
      if (!isFile) {
        const node = currentLevel.get(part)!
        currentLevel = childrenMaps.get(node)!
      }
    })
  })
  
  function convertMapsToArrays(map: Map<string, FileNode>): FileNode[] {
    const nodes: FileNode[] = []
    map.forEach(node => {
      const childMap = childrenMaps.get(node)
      if (childMap) {
        node.children = convertMapsToArrays(childMap)
      }
      nodes.push(node)
    })
    return nodes
  }
  
  const tree = convertMapsToArrays(root)
  return sortNodes(tree)
}

function sortNodes(nodes: FileNode[]): FileNode[] {
  const sorted = nodes.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1
    }
    return a.name.localeCompare(b.name)
  })
  
  sorted.forEach(node => {
    if (node.children) {
      node.children = sortNodes(node.children)
    }
  })
  
  return sorted
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams
    const filePath = searchParams.get('path')

    // If a specific file is requested, return its content
    if (filePath) {
      // Only allow specific documentation files for security
      const allowedFiles = ['replit.md', 'SUPABASE_SETUP.md', '.bmad-core/user-guide.md']
      if (!allowedFiles.includes(filePath)) {
        return NextResponse.json(
          { error: 'File not allowed' },
          { status: 403 }
        )
      }

      // Read file from project root
      const fullPath = path.join(PROJECT_ROOT, filePath)
      const content = await fs.readFile(fullPath, 'utf-8')
      return NextResponse.json({ content })
    }

    // Otherwise, return the tree of all markdown files
    const files = await findMarkdownFiles(PROJECT_ROOT)
    const tree = buildTree(files)
    return NextResponse.json(tree)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
