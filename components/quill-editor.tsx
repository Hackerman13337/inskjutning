'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface QuillEditorProps {
  initialValue: string
  onChange: (value: string) => void
}

export function QuillEditor({ initialValue, onChange }: QuillEditorProps) {
  return (
    <ReactQuill
      theme="snow"
      value={initialValue}
      onChange={onChange}
    />
  )
}
