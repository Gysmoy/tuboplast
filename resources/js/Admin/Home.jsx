import React, { useEffect, useMemo, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'

const EMPTY_DASHBOARD = {
  month_label: '',
  kpis: [],
  metrics: [],
  funnel: [],
  funnel_max: 1,
  chart: { labels: [], qty: [], amount: [] },
}

const Home = ({ dashboard }) => {
  const data = useMemo(() => ({ ...EMPTY_DASHBOARD, ...(dashboard || {}) }), [dashboard])
  const chartRef = useRef(null)
  const apexRef = useRef(null)

  useEffect(() => {
    document.title = 'Inicio | Admin'
  }, [])

  useEffect(() => {
    if (!chartRef.current || typeof ApexCharts === 'undefined') return

    const options = {
      chart: { type: 'line', height: 360, toolbar: { show: false } },
      series: [
        { name: 'Cantidad de cotizaciones', type: 'column', data: data.chart.qty },
        { name: 'Monto cotizado (S/)', type: 'line', data: data.chart.amount },
      ],
      stroke: { width: [0, 3], curve: 'smooth' },
      plotOptions: { bar: { columnWidth: '48%', borderRadius: 4 } },
      xaxis: { categories: data.chart.labels, title: { text: 'Día del mes' } },
      yaxis: [
        { title: { text: 'Cantidad' }, labels: { formatter: (v) => Math.round(v) } },
        { opposite: true, title: { text: 'Monto (S/)' }, labels: { formatter: (v) => `S/ ${Math.round(v).toLocaleString('es-PE')}` } },
      ],
      colors: ['#3A8DFF', '#17A2B8'],
      dataLabels: { enabled: false },
      grid: { borderColor: '#edf2f7' },
      legend: { position: 'top' },
      tooltip: { shared: true, intersect: false },
    }

    apexRef.current = new ApexCharts(chartRef.current, options)
    apexRef.current.render()

    return () => {
      if (apexRef.current) {
        apexRef.current.destroy()
        apexRef.current = null
      }
    }
  }, [data])

  return (
    <div className='row g-3'>
      <div className='col-12'>
        <div className='card border-0 shadow-sm'>
          <div className='card-body py-3'>
            <h4 className='mb-1'>Panel Comercial</h4>
            <p className='text-muted mb-0'>
              Resumen ejecutivo de <strong className='text-capitalize'>{data.month_label || 'el mes actual'}</strong> con indicadores reales de cotizaciones, atención y conversión.
            </p>
          </div>
        </div>
      </div>

      {data.kpis.map((kpi) => (
        <div key={kpi.title} className='col-12 col-md-6 col-xl-3'>
          <div className='card h-100 border-0 shadow-sm'>
            <div className='card-body'>
              <div className='d-flex align-items-start justify-content-between'>
                <div>
                  <p className='text-muted mb-1'>{kpi.title}</p>
                  <h3 className='mb-1'>{kpi.value}</h3>
                  <span className={`badge ${kpi.positive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>{kpi.delta}</span>
                </div>
                <div className='avatar-sm'>
                  <span className='avatar-title rounded-circle bg-primary-subtle text-primary fs-22'>
                    <i className={kpi.icon}></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className='col-12 col-xl-8'>
        <div className='card border-0 shadow-sm h-100'>
          <div className='card-body'>
            <div className='d-flex justify-content-between align-items-center mb-3'>
              <h5 className='mb-0'>Cotizaciones del mes actual</h5>
              <span className='badge bg-primary-subtle text-primary text-capitalize'>{data.month_label}</span>
            </div>
            <div ref={chartRef} />
          </div>
        </div>
      </div>

      <div className='col-12 col-xl-4'>
        <div className='card border-0 shadow-sm h-100'>
          <div className='card-body'>
            <h5 className='mb-3'>Métricas de desempeño</h5>
            <div className='d-flex flex-column gap-3'>
              {data.metrics.map((metric) => (
                <div key={metric.label} className='p-2 border rounded'>
                  <small className='text-muted d-block'>{metric.label}</small>
                  <strong className='fs-5'>{metric.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='col-12'>
        <div className='card border-0 shadow-sm'>
          <div className='card-body'>
            <h5 className='mb-3'>Embudo de cotizaciones</h5>
            <div className='row g-3'>
              {data.funnel.map((item) => (
                <div key={item.stage} className='col-12 col-md-4'>
                  <div className='p-3 border rounded h-100'>
                    <div className='d-flex justify-content-between align-items-center'>
                      <span>{item.stage}</span>
                      <span className={`badge bg-${item.color}`}>{item.value}</span>
                    </div>
                    <div className='progress mt-3' style={{ height: '8px' }}>
                      <div
                        className={`progress-bar bg-${item.color}`}
                        role='progressbar'
                        style={{ width: `${Math.min(100, (item.value / (data.funnel_max || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Adminto {...properties} title='Inicio'>
      <Home {...properties} />
    </Adminto>
  )
})
