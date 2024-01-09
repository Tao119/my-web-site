'use client'
import React, { useState } from 'react'
import { marked } from 'marked'
import { Button } from 'src/components/button'

const Home = () => {
  const [content, setContent] = useState('')

  marked.setOptions({
    gfm: true,
    breaks: true,
  })

  const htmlText = marked.parse(content)

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className="left">
        <textarea
          style={{ height: '90vh', width: '45vw', outline: '1px solid black' }}
          onChange={(e) => {
            setContent(e.target.value)
          }}
          value={content}
        />
      </div>
      <div className="right">
        <div style={{ height: '90vh', width: '45vw' }}>
          <div dangerouslySetInnerHTML={{ __html: htmlText }} />
        </div>
        <Button addClass="c-button--blue" />
      </div>
    </div>
  )
}
export default Home
