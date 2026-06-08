import React, { useRef } from 'react'

const QuillFormGroup = ({ col, label, eRef, value, required = false, rows = 3, onChange }) => {
  const textareaRef = useRef(null)

  const emitChange = (nextValue, selectionStart = null, selectionEnd = null) => {
    if (eRef?.current) {
      eRef.current.value = nextValue
    }

    if (typeof onChange === 'function') {
      onChange(nextValue)
    }

    if (selectionStart != null && selectionEnd != null) {
      requestAnimationFrame(() => {
        const el = textareaRef.current
        if (!el) return
        el.focus()
        el.setSelectionRange(selectionStart, selectionEnd)
      })
    }
  }

  const handleChange = (event) => {
    emitChange(event.target.value)
  }

  const wrapSelection = (before, after = before) => {
    const el = textareaRef.current
    if (!el) return

    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0
    const selected = el.value.slice(start, end) || 'Texto'
    const nextValue = `${el.value.slice(0, start)}${before}${selected}${after}${el.value.slice(end)}`
    emitChange(nextValue, start + before.length, start + before.length + selected.length)
  }

  const prefixLines = (prefix) => {
    const el = textareaRef.current
    if (!el) return

    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? start
    const text = el.value
    const lineStart = text.lastIndexOf('\n', Math.max(0, start - 1)) + 1
    const lineEnd = text.indexOf('\n', end)
    const safeLineEnd = lineEnd === -1 ? text.length : lineEnd
    const block = text.slice(lineStart, safeLineEnd)
    const transformed = block
      .split('\n')
      .map((line) => (line.startsWith(prefix) ? line : `${prefix}${line}`))
      .join('\n')

    const nextValue = `${text.slice(0, lineStart)}${transformed}${text.slice(safeLineEnd)}`
    emitChange(nextValue, lineStart + prefix.length, lineStart + transformed.length)
  }

  const toolbarButton = (title, action, icon) => (
    <button
      key={title}
      type="button"
      className="btn btn-sm btn-light border shadow-sm px-3"
      onClick={action}
      title={title}
    >
      <span className="fw-bold">{icon}</span>
    </button>
  )

  return (
    <div className={`form-group ${col} mb-2`} style={{ height: 'max-content' }}>
      <label htmlFor="">
        {label} {required && <b className="text-danger">*</b>}
      </label>
      <div className="d-flex flex-wrap gap-2 mb-2">
        {toolbarButton('Subtitulo 2', () => prefixLines('## '), 'H2')}
        {toolbarButton('Subtitulo 3', () => prefixLines('### '), 'H3')}
        {toolbarButton('Negrita', () => wrapSelection('**'), 'B')}
        {toolbarButton('Cursiva', () => wrapSelection('*'), 'I')}
        {toolbarButton('Lista', () => prefixLines('- '), 'Lista')}
        {toolbarButton('Cita', () => prefixLines('> '), 'Cita')}
      </div>
      <textarea
        ref={textareaRef}
        className="form-control"
        required={required}
        rows={Math.max(rows, 14)}
        style={{ minHeight: '420px' }}
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}

export default QuillFormGroup
