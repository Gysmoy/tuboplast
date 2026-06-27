import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import CustomDropdown from './CustomDropdown.jsx'
import DateRangeFilter from './DateRangeFilter.jsx'

/**
 * Tabla de administración reutilizable (diseño Tuboplast, sin DevExtreme).
 * Usa `rest.paginate(loadOptions)` (skip/take/sort/filter/requireTotalCount).
 *
 * columns: [{
 *   key, header, render(row),
 *   field,           // campo BD (sort por defecto + filtro)
 *   filterFields,    // [a,b] → filtro por texto en varias columnas (OR)
 *   filterType,      // 'text' (def) | 'select' | 'date'
 *   filterOptions,   // [{value,label}] (select)
 *   filterable,      // false → sin filtro
 *   sortField, sortable, align, nowrap, width
 * }]
 *
 * Ref: { reload, patchRow(id, patch), removeRow(id) }
 */

const AT_CSS = `
.at-card{background:#fff;border:1px solid #e7edf5;border-radius:16px;box-shadow:0 1px 2px rgba(15,37,64,.04),0 6px 16px rgba(0,73,145,.06);padding:16px;}
@media(min-width:992px){.at-card{padding:20px;}}
.at-iconbox{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#0a5aa8,#004991);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 10px rgba(0,73,145,.25);flex-shrink:0;}
.at-h2{font-size:18px;font-weight:700;line-height:1.25;margin:0;color:#0f2540;}
@media(min-width:992px){.at-h2{font-size:20px;}}
.at-sub{font-size:12px;color:#8a93a6;margin:0;}.at-sub b{color:#004991;}
.at-tool{height:40px;width:40px;border-radius:12px;background:#e6effa;color:#004991;border:0;display:inline-flex;align-items:center;justify-content:center;transition:background .2s;}
.at-tool:hover{background:#d6e6f7;}
.at-tool:disabled{opacity:.6;cursor:not-allowed;}
.at-tablewrap{border:1px solid #eef2f8;border-radius:12px;overflow-x:auto;}
.at-tablewrap::-webkit-scrollbar{height:8px;}.at-tablewrap::-webkit-scrollbar-thumb{background:#cfdcec;border-radius:9px;}
table.at-table{width:100%;border-collapse:collapse;font-size:13px;margin:0;}
table.at-table thead th{background:#f5f8fc;color:#8a93a6;font-size:11px;text-transform:uppercase;letter-spacing:.025em;font-weight:600;padding:12px;white-space:nowrap;text-align:left;}
table.at-table thead th.at-c{text-align:center;}table.at-table thead th.at-r{text-align:right;}
table.at-table thead th.at-sortable{cursor:pointer;user-select:none;}
table.at-table thead th.at-sortable:hover{color:#004991;}
.at-th{display:inline-flex;align-items:center;gap:4px;}
.at-c .at-th{justify-content:center;}.at-r .at-th{justify-content:flex-end;}
.at-th i{font-size:13px;color:#c2ccda;}
.at-th i.on{color:#004991;}
table.at-table tbody td{padding:12px;border-top:1px solid #eef2f8;vertical-align:middle;}
table.at-table tbody tr{transition:background-color .15s ease;}
table.at-table tbody tr.at-click{cursor:pointer;}
table.at-table tbody tr:hover{background:#f9fbfe;}
table.at-table tbody tr.at-row-unseen{background:#eaf4ff;}
table.at-table tbody tr.at-row-unseen:hover{background:#dff0ff;}
table.at-table thead tr.at-filter th{background:#fff;padding:0;border-top:1px solid #eef2f8;vertical-align:middle;}
.at-filter-input{width:100%;border:0;background:transparent;font-size:12px;font-weight:400;text-transform:none;letter-spacing:normal;padding:8px 12px;outline:none;color:#1f2a44;}
.at-filter-input::placeholder{color:#c2ccda;}
.at-fcell{padding:4px 6px;}
.at-pg{min-width:32px;height:32px;padding:0 8px;border-radius:8px;border:0;background:none;color:#8a93a6;font-weight:600;font-size:13px;}
.at-pg:hover{background:#f4f8fd;}.at-pg.on{background:#004991;color:#fff;}.at-pg:disabled{opacity:.4;cursor:not-allowed;}
`

const buildPages = (current, last) => {
  if (last <= 1) return [1]
  const pages = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(last - 1, current + 1)
  if (left > 2) pages.push('…')
  for (let p = left; p <= right; p += 1) pages.push(p)
  if (right < last - 1) pages.push('…')
  pages.push(last)
  return pages
}

const alignClass = (a) => (a === 'right' ? 'at-r' : a === 'center' ? 'at-c' : '')
const cellAlign = (a) => (a === 'right' ? 'text-end' : a === 'center' ? 'text-center' : '')
const sortFieldOf = (col) => (col.sortable === false ? null : (col.sortField || col.field || null))
const filterTypeOf = (col) => col.filterType || (col.filterOptions ? 'select' : 'text')
const colHasFilter = (col) => {
  if (col.filterable === false) return false
  if (filterTypeOf(col) === 'date') return !!col.field
  return !!((col.filterFields && col.filterFields.length) || col.field)
}

// Construye el sub-filtro DevExtreme de una columna a partir de su valor.
const buildColumnFilter = (col, value) => {
  const type = filterTypeOf(col)
  const ds = (d) => `${d} 00:00:00`
  const de = (d) => `${d} 23:59:59`

  if (type === 'date') {
    const field = col.field
    if (!field) return null
    const v = value || {}
    const op = v.op || '='
    if (op === 'between') {
      if (!v.from || !v.to) return null
      return [[field, '>=', ds(v.from)], 'and', [field, '<=', de(v.to)]]
    }
    if (!v.from) return null
    if (op === '=') return [[field, '>=', ds(v.from)], 'and', [field, '<=', de(v.from)]]
    if (op === '>') return [field, '>', de(v.from)]
    if (op === '<') return [field, '<', ds(v.from)]
    if (op === '>=') return [field, '>=', ds(v.from)]
    if (op === '<=') return [field, '<=', de(v.from)]
    return null
  }

  const s = String(value ?? '').trim()
  if (!s) return null
  const fields = (col.filterFields && col.filterFields.length) ? col.filterFields : (col.field ? [col.field] : [])
  if (!fields.length) return null
  const op = type === 'select' ? '=' : 'contains'
  if (fields.length === 1) return [fields[0], op, s]
  const grp = []
  fields.forEach((f, i) => { if (i) grp.push('or'); grp.push([f, op, s]) })
  return grp
}

const AdminTable = forwardRef(({
  rest,
  columns = [],
  title = 'Registros',
  icon = 'fas fa-table',
  countSuffix = 'registros',
  defaultSort = [{ selector: 'id', desc: true }],
  perPage: initialPerPage = 10,
  perPageOptions = [10, 25, 50, 100],
  minWidth = 900,
  rowKey = (row) => row.id,
  rowClassName,
  onRowClick,
  headerActions,
}, ref) => {
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(initialPerPage)
  const [filters, setFilters] = useState({})
  const [debFilters, setDebFilters] = useState({})
  const [sort, setSort] = useState(defaultSort?.[0] ?? null)

  const columnsRef = useRef(columns)
  columnsRef.current = columns
  const sortKey = JSON.stringify(sort)

  useEffect(() => {
    const t = setTimeout(() => { setDebFilters(filters); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [filters])

  const load = useCallback(async () => {
    setLoading(true)
    const params = { requireTotalCount: true, skip: (page - 1) * perPage, take: perPage }
    const sortObj = JSON.parse(sortKey)
    if (sortObj) params.sort = [sortObj]

    const groups = []
    columnsRef.current.forEach((col) => {
      const sub = buildColumnFilter(col, debFilters[col.key])
      if (sub) groups.push(sub)
    })
    if (groups.length) {
      let filter = []
      groups.forEach((g, i) => { if (i) filter.push('and'); filter.push(g) })
      params.filter = groups.length === 1 ? groups[0] : filter
    }

    const res = await rest.paginate(params)
    setRows(Array.isArray(res?.data) ? res.data : [])
    setTotal(Number(res?.totalCount) || 0)
    setLoading(false)
  }, [rest, page, perPage, debFilters, sortKey])

  useEffect(() => { load() }, [load])

  useImperativeHandle(ref, () => ({
    reload: load,
    patchRow: (id, patch) => setRows((list) => list.map((r) => (rowKey(r) === id ? { ...r, ...patch } : r))),
    removeRow: (id) => setRows((list) => list.filter((r) => rowKey(r) !== id)),
  }), [load, rowKey])

  const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }))

  const hasActiveFilters = Object.values(filters).some((v) => {
    if (v == null) return false
    if (typeof v === 'object') return !!(v.from || v.to)
    return String(v).trim() !== ''
  })

  const clearFilters = () => { setFilters({}); setDebFilters({}); setPage(1) }

  const toggleSort = (field) => {
    setSort((cur) => (cur && cur.selector === field ? { selector: field, desc: !cur.desc } : { selector: field, desc: false }))
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const pages = useMemo(() => buildPages(page, totalPages), [page, totalPages])
  const from = total === 0 ? 0 : (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)
  const hasFilterRow = columns.some(colHasFilter)

  const renderFilterCell = (col) => {
    if (!colHasFilter(col)) return null
    const type = filterTypeOf(col)
    if (type === 'select') {
      return (
        <CustomDropdown bare value={filters[col.key] ?? ''} menuWidth={170}
          options={[{ value: '', label: 'Todos' }, ...(col.filterOptions || [])]}
          onChange={(v) => setFilter(col.key, v)} />
      )
    }
    if (type === 'date') {
      return <DateRangeFilter value={filters[col.key]} onChange={(v) => setFilter(col.key, v)} />
    }
    return <input className='at-filter-input' placeholder='Filtrar…' value={filters[col.key] ?? ''} onChange={(e) => setFilter(col.key, e.target.value)} />
  }

  return (
    <div className='at-card'>
      <style>{AT_CSS}</style>

      <div className='d-flex align-items-center justify-content-between gap-3 mb-4'>
        <div className='d-flex align-items-center gap-3'>
          <div className='at-iconbox'><i className={icon}></i></div>
          <div>
            <h2 className='at-h2'>{title}</h2>
            <p className='at-sub'><b>{total.toLocaleString('es-PE')}</b> {countSuffix}</p>
          </div>
        </div>
        <div className='d-flex align-items-center gap-2'>
          {headerActions}
          {hasActiveFilters && (
            <button type='button' className='at-tool' title='Limpiar filtros' onClick={clearFilters}>
              <i className='mdi mdi-filter-off-outline'></i>
            </button>
          )}
          <button type='button' className='at-tool' title='Refrescar' onClick={load} disabled={loading}>
            <i className={loading ? 'mdi mdi-loading mdi-spin' : 'mdi mdi-refresh'}></i>
          </button>
        </div>
      </div>

      <div className='at-tablewrap'>
        <table className='at-table' style={{ minWidth }}>
          <thead>
            <tr>
              {columns.map((col) => {
                const sf = sortFieldOf(col)
                const active = sort && sf && sort.selector === sf
                const sortIcon = active ? (sort.desc ? 'mdi mdi-arrow-down on' : 'mdi mdi-arrow-up on') : 'mdi mdi-unfold-more-horizontal'
                return (
                  <th key={col.key} className={`${alignClass(col.align)} ${sf ? 'at-sortable' : ''}`} style={col.width ? { width: col.width } : undefined} onClick={sf ? () => toggleSort(sf) : undefined}>
                    <span className='at-th'>{col.header}{sf && <i className={sortIcon}></i>}</span>
                  </th>
                )
              })}
            </tr>
            {hasFilterRow && (
              <tr className='at-filter'>
                {columns.map((col) => <th key={col.key}>{renderFilterCell(col)}</th>)}
              </tr>
            )}
          </thead>
          <tbody>
            {rows.length ? rows.map((row) => {
              const key = rowKey(row)
              const extra = rowClassName ? rowClassName(row) : ''
              return (
                <tr key={key} className={`${onRowClick ? 'at-click' : ''} ${extra}`} onClick={onRowClick ? () => onRowClick(row) : undefined}>
                  {columns.map((col) => (
                    <td key={col.key} className={`${cellAlign(col.align)} ${col.nowrap ? 'text-nowrap' : ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              )
            }) : (
              <tr><td colSpan={columns.length} className='text-center py-4' style={{ color: '#9aa3b3' }}>{loading ? 'Cargando…' : 'No se encontraron registros.'}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mt-4' style={{ fontSize: 13 }}>
        <div className='d-flex align-items-center gap-1'>
          <span className='me-1' style={{ color: '#8a93a6', fontSize: 12 }}>Por página:</span>
          {perPageOptions.map((n) => (
            <button key={n} className={`at-pg ${perPage === n ? 'on' : ''}`} onClick={() => { setPerPage(n); setPage(1) }}>{n}</button>
          ))}
        </div>
        <div className='d-flex align-items-center gap-2'>
          <span className='d-none d-sm-inline' style={{ color: '#8a93a6', fontSize: 12 }}>{from}-{to} de {total.toLocaleString('es-PE')}</span>
          <div className='d-flex align-items-center gap-1'>
            <button className='at-pg' disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><i className='mdi mdi-chevron-left'></i></button>
            {pages.map((item, idx) => item === '…'
              ? <span key={`g-${idx}`} className='at-pg' style={{ cursor: 'default' }}>…</span>
              : <button key={item} className={`at-pg ${page === item ? 'on' : ''}`} onClick={() => setPage(item)}>{item}</button>)}
            <button className='at-pg' disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}><i className='mdi mdi-chevron-right'></i></button>
          </div>
        </div>
      </div>
    </div>
  )
})

AdminTable.displayName = 'AdminTable'

export default AdminTable
