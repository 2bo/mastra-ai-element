---
name: Mastra Research
description: Research Mastra.ai framework specifications and provide accurate, up-to-date information using prioritized information sources
---

# Mastra Research Skill

When the user asks about Mastra features, functionality, APIs, or requests Mastra-related coding tasks, follow this prioritized information gathering strategy:

## Information Source Priority

### 1. Mastra MCP (HIGHEST PRIORITY)

Use the Mastra Docs MCP tools first:

- **`mcp__mastra-docs__mastraDocs`**: For official documentation
  - Use `paths` parameter to explore specific documentation sections
  - Use `queryKeywords` to find relevant content when unsure of exact path
  - Check both general docs AND reference docs (e.g., for evals, check `evals/` and `reference/evals/`)
  - Always mention which file path contains the information in your response

- **`mcp__mastra-docs__mastraExamples`**: For code examples
  - Without `example` parameter: lists all available examples
  - With `example` parameter: returns full source code
  - Use `queryKeywords` to search when unsure of exact example name

- **`mcp__mastra-docs__mastraChanges`**: For changelog and version information
  - Specify `package` parameter for specific package changes
  - Omit parameter to list all available packages

- **`mcp__mastra-docs__mastraBlog`**: For announcements, changelogs, and feature posts
  - Without `url`: lists all blog posts
  - With `url`: returns specific post content in markdown

### 2. DeepWiki MCP (SECONDARY)

If Mastra Docs MCP doesn't have sufficient information, use DeepWiki:

- **`mcp__deepwiki__read_wiki_structure`**: Get documentation topics

  ```
  repoName: "mastra-ai/mastra"
  ```

- **`mcp__deepwiki__read_wiki_contents`**: View repository documentation

  ```
  repoName: "mastra-ai/mastra"
  ```

- **`mcp__deepwiki__ask_question`**: Ask specific questions about the repository
  ```
  repoName: "mastra-ai/mastra"
  question: "your specific question"
  ```

### 3. GitHub MCP (TERTIARY)

If documentation is insufficient, search the actual codebase:

- **`mcp__github__search_code`**: Search for specific code patterns

  ```
  query: "language:TypeScript repo:mastra-ai/mastra [your search terms]"
  ```

- **`mcp__github__get_file_contents`**: Read specific files

  ```
  owner: "mastra-ai"
  repo: "mastra"
  path: "path/to/file"
  ```

- **`mcp__github__list_issues`**: Check for related issues or discussions
  ```
  owner: "mastra-ai"
  repo: "mastra"
  ```

### 4. Web Search (LAST RESORT)

Only use web search if all MCP tools fail to provide information:

- **`WebSearch`**: For general web search
- **`WebFetch`**: For specific URLs (e.g., external blog posts, Stack Overflow)

## Best Practices

1. **Start specific, then broaden**: Begin with Mastra Docs using specific paths, then use keywords if needed
2. **Provide code examples**: Always include practical examples from mastraExamples when available
3. **Check multiple sources**: For features, check both guide docs and reference docs
4. **Cite sources**: Always mention which tool/file provided the information
5. **Install commands**: If packages need installation, provide `pnpm install` commands with latest tag
6. **Stay concise**: Be concise initially; users will ask for more details if needed

## Example Workflow

```
User asks: "How do I use Mastra agents with memory?"

1. ✓ Call mcp__mastra-docs__mastraDocs with paths: ["agents/", "memory/", "reference/agents/", "reference/memory/"]
2. ✓ Call mcp__mastra-docs__mastraExamples with queryKeywords: ["agent", "memory"]
3. ✓ Provide answer with code examples and source citations
4. If insufficient, use DeepWiki mcp__deepwiki__ask_question
5. If still insufficient, use GitHub mcp__github__search_code
6. Only if all else fails, use WebSearch
```

## When to Invoke This Skill

Automatically use this skill when the user:

- Asks about Mastra features, APIs, or concepts
- Requests code examples using Mastra
- Asks "how do I..." questions related to Mastra
- Needs information about Mastra versions or changes
- Wants to implement Mastra functionality
- Troubleshoots Mastra-related issues
