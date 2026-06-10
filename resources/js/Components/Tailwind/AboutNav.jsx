import { useEffect, useRef, useState } from 'react'

const tabs = [
  { label: 'Familia e Historia', href: '/family' },
  { label: 'Política de SGI', href: '/politica-sgi' },
]

const normalizePath = (path) => {
  if (path === '/family' || path === '/about' || path === '/about/familia' || path === '/nosotros-familia') return '/family'
  if (path === '/politica-sgi' || path === '/about/politica' || path === '/nosotros-politica') return '/politica-sgi'
  return path
}

const AboutNav = ({ variant = 'default' }) => {
  const currentPath =
    typeof window === 'undefined' ? '/family' : window.location.pathname.replace(/\/$/, '') || '/family'

  const normalizedPath = normalizePath(currentPath)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const isOverlay = variant === 'overlay'

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className={isOverlay ? 'absolute left-4 top-5 z-20' : 'border-b border-slate-200 bg-white'}>
      <div className={isOverlay ? 'w-[12.75rem] sm:w-[15rem]' : 'mx-auto w-full max-w-site px-4 py-3 sm:py-4'}>
        <div ref={dropdownRef} className='relative w-full'>
          <button
            type='button'
            onClick={() => setIsOpen((current) => !current)}
            className='flex w-full items-center justify-between rounded-xl bg-primary px-4 py-3 text-left text-white shadow-[0_12px_28px_rgba(2,44,92,0.16)] transition hover:bg-[#00458c] sm:px-5 sm:py-3.5'
            aria-expanded={isOpen}
            aria-controls='about-tabs-menu'
          >
            <span className='text-sm font-semibold leading-tight sm:text-[1rem]'>Familia Tuboplast</span>
            <i className={`mdi mdi-chevron-down text-xl transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
          </button>

          <div
            id='about-tabs-menu'
            className={`absolute left-0 top-full z-20 mt-1 w-full origin-top overflow-hidden rounded-b-xl rounded-t-none border border-[#cdddf0] border-t-0 bg-white shadow-[0_18px_35px_rgba(2,44,92,0.18)] transition-[max-height,opacity,transform] duration-200 ease-out ${
              isOpen
                ? 'max-h-40 translate-y-0 opacity-100'
                : 'pointer-events-none max-h-0 -translate-y-1 opacity-0'
            }`}
          >
            {tabs.map((tab) => {
              const isActive = normalizedPath === tab.href

              return (
                <a
                  key={tab.label}
                  href={tab.href}
                  className={`block px-4 py-3 text-sm font-medium transition sm:px-5 sm:py-3.5 sm:text-[0.95rem] ${
                    isActive ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-slate-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {tab.label}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutNav
