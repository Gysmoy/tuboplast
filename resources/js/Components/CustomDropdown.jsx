import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Dropdown custom (estilo dashboard Tuboplast). El menú se renderiza en un
 * portal con position fixed para no recortarse dentro de contenedores con
 * overflow (ej. el scroll de la tabla).
 *
 * Props: value, options [{value,label}], onChange, placeholder, minWidth, menuWidth, compact
 */

const CSS = `
.cdd-wrap{position:relative;display:inline-block;}
.cdd-btn{height:34px;border:1px solid #dce5f0;border-radius:9px;background:#fff;font-size:12.5px;font-weight:600;color:#0f2540;padding:0 10px;display:inline-flex;align-items:center;justify-content:space-between;gap:6px;cursor:pointer;width:100%;}
.cdd-btn.compact{height:30px;font-size:12px;padding:0 8px;}
.cdd-btn.bare{border:0;border-radius:0;background:transparent;height:auto;padding:8px 12px;font-weight:500;}
.cdd-btn.bare:hover{border-color:transparent;background:#f9fbfe;}
.cdd-btn:hover{border-color:#004991;}
.cdd-btn .cdd-lbl{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cdd-btn .cdd-chev{color:#8a93a6;font-size:14px;flex-shrink:0;}
.cdd-menu{position:fixed;z-index:2000;max-height:260px;overflow-y:auto;background:#fff;border:1px solid #e7edf5;border-radius:10px;box-shadow:0 12px 30px rgba(15,37,64,.16);padding:5px;}
.cdd-menu::-webkit-scrollbar{width:6px;}.cdd-menu::-webkit-scrollbar-thumb{background:#cfdcec;border-radius:9px;}
.cdd-opt{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 9px;border-radius:7px;font-size:12.5px;color:#1f2a44;cursor:pointer;border:0;background:none;width:100%;text-align:left;white-space:nowrap;}
.cdd-opt:hover{background:#f4f8fd;}
.cdd-opt.sel{background:#e6effa;color:#004991;font-weight:700;}
.cdd-opt i{font-size:14px;color:#004991;}
.cdd-search{position:sticky;top:0;background:#fff;padding:2px 2px 6px;}
.cdd-search input{width:100%;height:32px;border:1px solid #dce5f0;border-radius:8px;padding:0 10px;font-size:12.5px;outline:none;}
.cdd-search input:focus{border-color:#004991;}
.cdd-empty{padding:10px;text-align:center;color:#8a93a6;font-size:12px;}
`

let injected = false
const ensureStyle = () => {
  if (injected || typeof document === 'undefined') return
  injected = true
  const el = document.createElement('style')
  el.textContent = CSS
  document.head.appendChild(el)
}

const CustomDropdown = ({ value, options = [], onChange, placeholder = 'Seleccionar', minWidth = 120, menuWidth, compact = false, bare = false, searchable = false }) => {
  ensureStyle()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [pos, setPos] = useState({ left: 0, top: 0, width: 0 })
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  const selected = options.find((o) => String(o.value) === String(value))
  const term = query.trim().toLowerCase()
  const shown = searchable && term
    ? options.filter((o) => `${o.label} ${o.search || ''}`.toLowerCase().includes(term))
    : options

  useEffect(() => { if (!open) setQuery('') }, [open])

  const place = () => {
    const r = btnRef.current?.getBoundingClientRect()
    if (r) setPos({ left: r.left, top: r.bottom + 4, width: r.width })
  }

  useLayoutEffect(() => { if (open) place() }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => { if (!btnRef.current?.contains(e.target) && !menuRef.current?.contains(e.target)) setOpen(false) }
    // No cerrar si el scroll ocurre dentro del propio menú (su lista con overflow).
    const onMove = (e) => { if (menuRef.current?.contains(e.target)) return; setOpen(false) }
    // Captura: dispara aunque un contenedor (ej. modal) haga stopPropagation en bubble.
    document.addEventListener('mousedown', onDoc, true)
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
    return () => {
      document.removeEventListener('mousedown', onDoc, true)
      window.removeEventListener('scroll', onMove, true)
      window.removeEventListener('resize', onMove)
    }
  }, [open])

  return (
    <div className={`cdd-wrap ${open ? 'open' : ''}`} style={{ minWidth, width: '100%' }}>
      <button ref={btnRef} type='button' className={`cdd-btn ${compact ? 'compact' : ''} ${bare ? 'bare' : ''}`} onClick={() => setOpen((o) => !o)}>
        <span className='cdd-lbl'>{selected ? selected.label : placeholder}</span>
        <i className='mdi mdi-chevron-down cdd-chev'></i>
      </button>
      {open && createPortal(
        <div ref={menuRef} className='cdd-menu' style={{ left: pos.left, top: pos.top, minWidth: menuWidth || pos.width }}>
          {searchable && (
            <div className='cdd-search'>
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Buscar...' />
            </div>
          )}
          {shown.map((o) => (
            <button key={o.value} type='button' className={`cdd-opt ${String(o.value) === String(value) ? 'sel' : ''}`} onClick={() => { onChange(o.value); setOpen(false) }}>
              {o.label}
              {String(o.value) === String(value) && <i className='mdi mdi-check'></i>}
            </button>
          ))}
          {searchable && shown.length === 0 && <div className='cdd-empty'>Sin resultados</div>}
        </div>,
        document.body,
      )}
    </div>
  )
}

export default CustomDropdown
