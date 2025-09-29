import fs from 'node:fs'
import path from 'node:path'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import styles from './page.module.css'

export default async function Page() {
  const mdPath = path.join(process.cwd(), 'architecture', 'concrete-components.md')
  const content = await fs.promises.readFile(mdPath, 'utf8')

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {content}
        </ReactMarkdown>
      </article>
    </div>
  )
}


