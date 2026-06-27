import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * Modal de confirmación custom (estilo Tuboplast), en portal.
 * Props: open, title, message, confirmLabel, cancelLabel, variant('danger'|'primary'),
 *        loading, onConfirm, onCancel, icon
 */

const CSS = `
.cm-ovl{position:fixed;inset:0;z-index:1300;background:rgba(15,23,42,.5);display:flex;align-items:center;justify-content:center;padding:12px;}
.cm-box{width:min(420px,96vw);background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,37,64,.25);overflow:hidden;}
.cm-body{padding:24px 22px 18px;text-align:center;}
.cm-icon{width:54px;height:54px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:12px;}
.cm-icon.danger{background:#fcebeb;color:#e24b4a;}
.cm-icon.primary{background:#e6effa;color:#004991;}
.cm-title{font-size:17px;font-weight:700;color:#0f2540;margin:0 0 6px;}
.cm-msg{font-size:13.5px;color:#5b6577;margin:0;line-height:1.5;}
.cm-foot{display:flex;gap:8px;justify-content:center;padding:0 22px 22px;}
.cm-btn{height:40px;padding:0 18px;border-radius:10px;border:0;font-weight:600;font-size:13px;cursor:pointer;transition:background .2s,filter .2s;}
.cm-btn.cancel{background:#fff;border:1px solid #dce5f0;color:#5b6577;}
.cm-btn.cancel:hover{background:#f4f8fd;color:#0f2540;}
.cm-btn.danger{background:#e24b4a;color:#fff;}.cm-btn.danger:hover{filter:brightness(.94);}
.cm-btn.primary{background:#004991;color:#fff;}.cm-btn.primary:hover{background:#003b7a;}
.cm-btn:disabled{opacity:.6;cursor:not-allowed;}
`

let injected = false
const ensureStyle = () => {
  if (injected || typeof document === 'undefined') return
  injected = true
  const el = document.createElement('style')
  el.textContent = CSS
  document.head.appendChild(el)
}

const ConfirmModal = ({
  open,
  title = '¿Estás seguro?',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
  icon,
  onConfirm,
  onCancel,
}) => {
  ensureStyle()

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape' && !loading) onCancel?.() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, loading, onCancel])

  if (!open) return null

  const iconClass = icon || (variant === 'danger' ? 'mdi mdi-trash-can-outline' : 'mdi mdi-help-circle-outline')

  return createPortal(
    <div className='cm-ovl' onMouseDown={() => { if (!loading) onCancel?.() }}>
      <div className='cm-box' onMouseDown={(e) => e.stopPropagation()}>
        <div className='cm-body'>
          <span className={`cm-icon ${variant}`}><i className={iconClass}></i></span>
          <h3 className='cm-title'>{title}</h3>
          {message && <p className='cm-msg'>{message}</p>}
        </div>
        <div className='cm-foot'>
          <button type='button' className='cm-btn cancel' onClick={onCancel} disabled={loading}>{cancelLabel}</button>
          <button type='button' className={`cm-btn ${variant}`} onClick={onConfirm} disabled={loading}>{loading ? 'Procesando…' : confirmLabel}</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ConfirmModal
