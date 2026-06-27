import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Date-picker custom (calendario en popover, portal con position fixed).
 * value: 'YYYY-MM-DD' | ''   onChange: (str) => void
 */

const CSS = `
.cdp-wrap{position:relative;display:inline-block;width:100%;}
.cdp-btn{height:30px;border:1px solid #dce5f0;border-radius:9px;background:#fff;font-size:12px;font-weight:600;color:#0f2540;padding:0 8px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;width:100%;white-space:nowrap;}
.cdp-btn:hover{border-color:#004991;}
.cdp-btn i{color:#8a93a6;font-size:14px;}
.cdp-btn.empty{color:#b6c0cf;font-weight:500;}
.cdp-pop{position:fixed;z-index:2000;width:248px;background:#fff;border:1px solid #e7edf5;border-radius:12px;box-shadow:0 12px 30px rgba(15,37,64,.16);padding:10px;}
.cdp-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.cdp-title{font-weight:700;color:#0f2540;font-size:13px;text-transform:capitalize;}
.cdp-nav{width:28px;height:28px;border:0;border-radius:8px;background:#f4f8fd;color:#004991;display:inline-flex;align-items:center;justify-content:center;}
.cdp-nav:hover{background:#e6effa;}
.cdp-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}
.cdp-wd{font-size:10px;font-weight:700;color:#b6c0cf;text-align:center;padding:4px 0;}
.cdp-day{height:30px;border:0;border-radius:7px;background:none;font-size:12px;color:#1f2a44;cursor:pointer;}
.cdp-day:hover{background:#f4f8fd;}
.cdp-day.today{box-shadow:inset 0 0 0 1px #cfdcec;}
.cdp-day.sel{background:#004991;color:#fff;font-weight:700;}
.cdp-day.empty{visibility:hidden;cursor:default;}
.cdp-foot{display:flex;justify-content:space-between;margin-top:8px;}
.cdp-link{border:0;background:none;font-size:12px;font-weight:600;color:#004991;cursor:pointer;padding:4px 6px;border-radius:6px;}
.cdp-link:hover{background:#f4f8fd;}
.cdp-link.muted{color:#8a93a6;}
`

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const WEEK = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

let injected = false
const ensureStyle = () => {
  if (injected || typeof document === 'undefined') return
  injected = true
  const el = document.createElement('style')
  el.textContent = CSS
  document.head.appendChild(el)
}

const pad = (n) => String(n).padStart(2, '0')
const toStr = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`
const parse = (str) => {
  if (!str || typeof str !== 'string') return null
  const [y, m, d] = str.split('-').map(Number)
  if (!y || !m || !d) return null
  return { y, m: m - 1, d }
}

const CustomDatePicker = ({ value, onChange, placeholder = 'Fecha' }) => {
  ensureStyle()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ left: 0, top: 0 })
  const today = new Date()
  const parsed = parse(value)
  const [nav, setNav] = useState({ y: parsed?.y ?? today.getFullYear(), m: parsed?.m ?? today.getMonth() })
  const btnRef = useRef(null)
  const popRef = useRef(null)

  const place = () => {
    const r = btnRef.current?.getBoundingClientRect()
    if (r) setPos({ left: Math.min(r.left, window.innerWidth - 258), top: r.bottom + 4 })
  }

  useLayoutEffect(() => { if (open) { place(); const p = parse(value); if (p) setNav({ y: p.y, m: p.m }) } }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => { if (!btnRef.current?.contains(e.target) && !popRef.current?.contains(e.target)) setOpen(false) }
    const onMove = () => setOpen(false)
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('scroll', onMove, true)
      window.removeEventListener('resize', onMove)
    }
  }, [open])

  const label = parsed ? `${pad(parsed.d)} ${MONTHS_SHORT[parsed.m]} ${parsed.y}` : placeholder

  const daysInMonth = new Date(nav.y, nav.m + 1, 0).getDate()
  const leading = (new Date(nav.y, nav.m, 1).getDay() + 6) % 7 // lunes primero
  const cells = [...Array(leading).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const pick = (d) => { onChange(toStr(nav.y, nav.m, d)); setOpen(false) }
  const shift = (delta) => setNav((n) => {
    const m = n.m + delta
    if (m < 0) return { y: n.y - 1, m: 11 }
    if (m > 11) return { y: n.y + 1, m: 0 }
    return { y: n.y, m }
  })

  return (
    <div className='cdp-wrap'>
      <button ref={btnRef} type='button' className={`cdp-btn ${parsed ? '' : 'empty'}`} onClick={() => setOpen((o) => !o)}>
        <i className='mdi mdi-calendar-blank-outline'></i>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      </button>
      {open && createPortal(
        <div ref={popRef} className='cdp-pop' style={{ left: pos.left, top: pos.top }}>
          <div className='cdp-head'>
            <button type='button' className='cdp-nav' onClick={() => shift(-1)}><i className='mdi mdi-chevron-left'></i></button>
            <span className='cdp-title'>{MONTHS[nav.m]} {nav.y}</span>
            <button type='button' className='cdp-nav' onClick={() => shift(1)}><i className='mdi mdi-chevron-right'></i></button>
          </div>
          <div className='cdp-grid'>
            {WEEK.map((w) => <div key={w} className='cdp-wd'>{w}</div>)}
            {cells.map((d, i) => {
              if (d === null) return <span key={`e-${i}`} className='cdp-day empty'></span>
              const isSel = parsed && parsed.y === nav.y && parsed.m === nav.m && parsed.d === d
              const isToday = today.getFullYear() === nav.y && today.getMonth() === nav.m && today.getDate() === d
              return <button key={d} type='button' className={`cdp-day ${isSel ? 'sel' : ''} ${isToday ? 'today' : ''}`} onClick={() => pick(d)}>{d}</button>
            })}
          </div>
          <div className='cdp-foot'>
            <button type='button' className='cdp-link muted' onClick={() => { onChange(''); setOpen(false) }}>Limpiar</button>
            <button type='button' className='cdp-link' onClick={() => { onChange(toStr(today.getFullYear(), today.getMonth(), today.getDate())); setOpen(false) }}>Hoy</button>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}

export default CustomDatePicker
