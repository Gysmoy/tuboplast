import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Filtro de fecha como un solo control (parece input). Al click abre un
 * popover con: tipo de operador (= ↔ > < ≥ ≤) + calendario; "↔" pide 2 fechas.
 * Al aplicar, el control muestra un resumen corto (no agranda la columna).
 *
 * value: { op, from, to } | null    onChange(value|null)
 */

const CSS = `
.drf-trigger{width:100%;border:0;background:transparent;font-size:12px;font-weight:400;padding:8px 12px;outline:none;color:#1f2a44;cursor:pointer;text-align:left;display:flex;align-items:center;gap:6px;}
.drf-trigger.empty{color:#c2ccda;}
.drf-trigger i{color:#8a93a6;font-size:14px;flex-shrink:0;}
.drf-trigger .drf-txt{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.drf-pop{position:fixed;z-index:2000;width:264px;background:#fff;border:1px solid #e7edf5;border-radius:12px;box-shadow:0 12px 30px rgba(15,37,64,.16);padding:12px;}
.drf-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#8a93a6;margin:0 0 6px;}
.drf-ops{display:flex;gap:4px;margin-bottom:10px;}
.drf-op{flex:1;height:30px;border:1px solid #dce5f0;border-radius:8px;background:#fff;color:#5b6577;font-size:13px;font-weight:700;cursor:pointer;}
.drf-op:hover{border-color:#004991;}
.drf-op.on{background:#004991;border-color:#004991;color:#fff;}
.drf-tabs{display:flex;gap:6px;margin-bottom:8px;}
.drf-tab{flex:1;border:1px solid #dce5f0;border-radius:8px;background:#fff;font-size:12px;font-weight:700;color:#5b6577;cursor:pointer;padding:5px 8px;text-align:left;}
.drf-tab.on{border-color:#004991;color:#004991;background:#e6effa;}
.drf-tab span{display:block;font-size:9px;font-weight:700;color:#b6c0cf;text-transform:uppercase;}
.drf-tab.on span{color:#5b8fc4;}
.drf-chead{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
.drf-ctitle{font-weight:700;font-size:12.5px;color:#0f2540;text-transform:capitalize;}
.drf-nav{width:26px;height:26px;border:0;border-radius:7px;background:#f4f8fd;color:#004991;display:inline-flex;align-items:center;justify-content:center;}
.drf-nav:hover{background:#e6effa;}
.drf-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}
.drf-wd{font-size:9px;font-weight:700;color:#b6c0cf;text-align:center;padding:3px 0;}
.drf-day{height:28px;border:0;border-radius:7px;background:none;font-size:12px;color:#1f2a44;cursor:pointer;}
.drf-day:hover{background:#f4f8fd;}
.drf-day.inrange{background:#e6effa;}
.drf-day.sel{background:#004991;color:#fff;font-weight:700;}
.drf-day.today{box-shadow:inset 0 0 0 1px #cfdcec;}
.drf-day.empty{visibility:hidden;cursor:default;}
.drf-foot{display:flex;justify-content:space-between;align-items:center;margin-top:10px;}
.drf-btn{height:32px;padding:0 16px;border-radius:8px;border:0;font-size:12.5px;font-weight:600;cursor:pointer;}
.drf-btn.apply{background:#004991;color:#fff;}.drf-btn.apply:hover{background:#003b7a;}
.drf-btn.apply:disabled{opacity:.5;cursor:not-allowed;}
.drf-btn.clear{background:none;color:#8a93a6;padding:0 8px;}.drf-btn.clear:hover{color:#e24b4a;}
`

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const WEEK = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
const OPS = [['=', '='], ['between', '↔'], ['>', '>'], ['<', '<'], ['>=', '≥'], ['<=', '≤']]
const OPSYM = { '=': '=', between: '↔', '>': '>', '<': '<', '>=': '≥', '<=': '≤' }

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
const parse = (s) => {
  if (!s || typeof s !== 'string') return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return { y, m: m - 1, d }
}
const fmt = (s) => { const p = parse(s); return p ? `${pad(p.d)} ${MONTHS_SHORT[p.m]} ${p.y}` : '' }
const fmtShort = (s) => { const p = parse(s); return p ? `${pad(p.d)} ${MONTHS_SHORT[p.m]}` : '' }

export const summarizeDate = (value) => {
  if (!value || !value.from) return null
  if (value.op === 'between') return value.to ? `${fmtShort(value.from)} ↔ ${fmtShort(value.to)}` : null
  return `${OPSYM[value.op] || '='} ${fmt(value.from)}`
}

const DateRangeFilter = ({ value, onChange }) => {
  ensureStyle()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ left: 0, top: 0 })
  const [draft, setDraft] = useState({ op: '=', from: '', to: '' })
  const [target, setTarget] = useState('from')
  const [nav, setNav] = useState(() => ({ y: new Date().getFullYear(), m: new Date().getMonth() }))
  const trigRef = useRef(null)
  const popRef = useRef(null)
  const today = new Date()

  const place = () => {
    const r = trigRef.current?.getBoundingClientRect()
    if (r) setPos({ left: Math.min(r.left, window.innerWidth - 276), top: r.bottom + 4 })
  }

  const openPop = () => {
    const v = value || { op: '=', from: '', to: '' }
    setDraft({ op: v.op || '=', from: v.from || '', to: v.to || '' })
    setTarget('from')
    const base = parse(v.from) || { y: today.getFullYear(), m: today.getMonth() }
    setNav({ y: base.y, m: base.m })
    setOpen(true)
  }

  useLayoutEffect(() => { if (open) place() }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => { if (!trigRef.current?.contains(e.target) && !popRef.current?.contains(e.target)) setOpen(false) }
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

  const summary = summarizeDate(value)
  const isBetween = draft.op === 'between'

  const daysInMonth = new Date(nav.y, nav.m + 1, 0).getDate()
  const leading = (new Date(nav.y, nav.m, 1).getDay() + 6) % 7
  const cells = [...Array(leading).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const setOp = (op) => {
    setDraft((d) => ({ ...d, op, to: op === 'between' ? d.to : '' }))
    setTarget('from')
  }
  const focusTarget = (t) => {
    setTarget(t)
    const p = parse(draft[t]); if (p) setNav({ y: p.y, m: p.m })
  }
  const pickDay = (d) => {
    const str = toStr(nav.y, nav.m, d)
    setDraft((cur) => {
      const next = { ...cur, [target]: str }
      return next
    })
    if (isBetween && target === 'from') setTarget('to')
  }
  const shift = (delta) => setNav((n) => {
    const m = n.m + delta
    if (m < 0) return { y: n.y - 1, m: 11 }
    if (m > 11) return { y: n.y + 1, m: 0 }
    return { y: n.y, m }
  })

  const applyDisabled = !draft.from || (isBetween && !draft.to)
  const apply = () => {
    if (applyDisabled) return
    onChange(isBetween ? { op: 'between', from: draft.from, to: draft.to } : { op: draft.op, from: draft.from, to: '' })
    setOpen(false)
  }
  const clear = () => { onChange(null); setOpen(false) }

  const inRange = (d) => {
    if (!isBetween || !draft.from || !draft.to) return false
    const cur = toStr(nav.y, nav.m, d)
    return cur > draft.from && cur < draft.to
  }
  const isSel = (d) => {
    const cur = toStr(nav.y, nav.m, d)
    return cur === draft.from || (isBetween && cur === draft.to)
  }

  return (
    <>
      <button ref={trigRef} type='button' className={`drf-trigger ${summary ? '' : 'empty'}`} onClick={() => (open ? setOpen(false) : openPop())}>
        <i className='mdi mdi-calendar-blank-outline'></i>
        <span className='drf-txt'>{summary || 'Filtrar…'}</span>
      </button>
      {open && createPortal(
        <div ref={popRef} className='drf-pop' style={{ left: pos.left, top: pos.top }}>
          <p className='drf-lbl'>Tipo</p>
          <div className='drf-ops'>
            {OPS.map(([val, sym]) => (
              <button key={val} type='button' className={`drf-op ${draft.op === val ? 'on' : ''}`} onClick={() => setOp(val)}>{sym}</button>
            ))}
          </div>

          {isBetween && (
            <div className='drf-tabs'>
              <button type='button' className={`drf-tab ${target === 'from' ? 'on' : ''}`} onClick={() => focusTarget('from')}>
                <span>Desde</span>{draft.from ? fmtShort(draft.from) : '—'}
              </button>
              <button type='button' className={`drf-tab ${target === 'to' ? 'on' : ''}`} onClick={() => focusTarget('to')}>
                <span>Hasta</span>{draft.to ? fmtShort(draft.to) : '—'}
              </button>
            </div>
          )}

          <div className='drf-chead'>
            <button type='button' className='drf-nav' onClick={() => shift(-1)}><i className='mdi mdi-chevron-left'></i></button>
            <span className='drf-ctitle'>{MONTHS[nav.m]} {nav.y}</span>
            <button type='button' className='drf-nav' onClick={() => shift(1)}><i className='mdi mdi-chevron-right'></i></button>
          </div>
          <div className='drf-grid'>
            {WEEK.map((w) => <div key={w} className='drf-wd'>{w}</div>)}
            {cells.map((d, i) => {
              if (d === null) return <span key={`e-${i}`} className='drf-day empty'></span>
              const isToday = today.getFullYear() === nav.y && today.getMonth() === nav.m && today.getDate() === d
              return <button key={d} type='button' className={`drf-day ${isSel(d) ? 'sel' : ''} ${inRange(d) ? 'inrange' : ''} ${isToday ? 'today' : ''}`} onClick={() => pickDay(d)}>{d}</button>
            })}
          </div>

          <div className='drf-foot'>
            <button type='button' className='drf-btn clear' onClick={clear}>Limpiar</button>
            <button type='button' className='drf-btn apply' disabled={applyDisabled} onClick={apply}>Aplicar</button>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}

export default DateRangeFilter
