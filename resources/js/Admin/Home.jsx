import React, { useEffect, useMemo, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Adminto from '../Components/Adminto.jsx'

const Home = () => {
  const chartRef = useRef(null)
  const apexRef = useRef(null)

  const chartData = useMemo(() => {
    const labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`)
    const qty = [4, 6, 8, 7, 10, 12, 11, 9, 13, 15, 12, 11, 14, 16, 18, 17, 15, 13, 19, 21, 18, 16, 15, 14, 20, 22, 19, 17, 16, 18]
    const amount = [42, 58, 71, 64, 88, 95, 91, 79, 102, 118, 97, 90, 110, 123, 136, 131, 116, 108, 142, 158, 147, 129, 121, 115, 161, 176, 165, 148, 140, 152]
    return { labels, qty, amount }
  }, [])

  const kpis = [
    { title: 'Cotizaciones del mes', value: '472', delta: '+18.4%', icon: 'ti ti-file-invoice' },
    { title: 'Club experto (personas)', value: '1,286', delta: '+9.2%', icon: 'ti ti-users-group' },
    { title: 'Mensajes recibidos', value: '214', delta: '+6.8%', icon: 'ti ti-message-chatbot' },
    { title: 'Conversión pendiente a atendido', value: '73.5%', delta: '+4.1 pts', icon: 'ti ti-rotate-2' },
  ]

  const extraMetrics = [
    { label: 'Monto cotizado del mes', value: 'S/ 1,452,800' },
    { label: 'Ticket promedio por cotización', value: 'S/ 3,078' },
    { label: 'Tiempo promedio de primera respuesta', value: '2h 14m' },
    { label: 'Leads calificados (MQL) del mes', value: '329' },
  ]

  const conversionFunnel = [
    { stage: 'Cotizaciones pendientes', value: 189, color: 'warning' },
    { stage: 'Cotizaciones atendidas', value: 139, color: 'success' },
    { stage: 'Cotizaciones ganadas', value: 74, color: 'primary' },
  ]

  useEffect(() => {
    document.title = 'Inicio | Admin'
  }, [])

  useEffect(() => {
    if (!chartRef.current || typeof ApexCharts === 'undefined') return

    const options = {
      chart: {
        type: 'line',
        height: 360,
        toolbar: { show: false },
      },
      series: [
        { name: 'Cantidad de cotizaciones', type: 'column', data: chartData.qty },
        { name: 'Monto total (S/ miles)', type: 'line', data: chartData.amount },
      ],
      stroke: {
        width: [0, 3],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '48%',
          borderRadius: 4,
        },
      },
      xaxis: {
        categories: chartData.labels,
        title: { text: 'Día del mes' },
      },
      yaxis: [
        {
          title: { text: 'Cantidad' },
        },
        {
          opposite: true,
          title: { text: 'Monto (S/ miles)' },
        },
      ],
      colors: ['#3A8DFF', '#17A2B8'],
      dataLabels: { enabled: false },
      grid: { borderColor: '#edf2f7' },
      legend: { position: 'top' },
      tooltip: {
        shared: true,
        intersect: false,
      },
    }

    apexRef.current = new ApexCharts(chartRef.current, options)
    apexRef.current.render()

    return () => {
      if (apexRef.current) {
        apexRef.current.destroy()
        apexRef.current = null
      }
    }
  }, [chartData])

  return (
    <div className='row g-3'>
      <div className='col-12'>
        <div className='card border-0 shadow-sm'>
          <div className='card-body py-3'>
            <h4 className='mb-1'>Panel Comercial</h4>
            <p className='text-muted mb-0'>
              Resumen ejecutivo del mes actual con indicadores clave de cotizaciones, atención y conversión.
            </p>
          </div>
        </div>
      </div>

      {kpis.map((kpi) => (
        <div key={kpi.title} className='col-12 col-md-6 col-xl-3'>
          <div className='card h-100 border-0 shadow-sm'>
            <div className='card-body'>
              <div className='d-flex align-items-start justify-content-between'>
                <div>
                  <p className='text-muted mb-1'>{kpi.title}</p>
                  <h3 className='mb-1'>{kpi.value}</h3>
                  <span className='badge bg-success-subtle text-success'>{kpi.delta}</span>
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
              <span className='badge bg-primary-subtle text-primary'>Data dummy</span>
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
              {extraMetrics.map((metric) => (
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
              {conversionFunnel.map((item) => (
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
                        style={{ width: `${Math.min(100, (item.value / 200) * 100)}%` }}
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
      <Home />
    </Adminto>
  )
})

