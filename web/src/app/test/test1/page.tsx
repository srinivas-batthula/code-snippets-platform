import { jsxCodeSample } from '@/codeSamples/jsx'
import PrismHighlighter from '@/components/PrismHighlighter'
import React from 'react'

const page = () => {
  return (
    <div>
      <PrismHighlighter 

      code={jsxCodeSample}
      language="jsx"
      showLineNumbers={true}
      className="my-4"
      />
    </div>
  )
}

export default page