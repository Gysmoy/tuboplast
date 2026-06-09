import { useEffect, useRef, useState } from 'react'

const tabs = [
  { label: 'Familia e Historia', href: '/about' },
  { label: 'Política de SGI', href: '/about/politica' },
]

const normalizePath = (path) => {
  if (path === '/about/familia' || path === '/nosotros-familia') return '/about'
  if (path === '/about/politica' || path === '/nosotros-politica') return '/about/politica'
  return path
}

const AboutNav = ({ variant = 'default' }) => {
  const currentPath =
    typeof window === 'undefined' ? '/about' : window.location.pathname.replace(/\/$/, '') || '/about'

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
            className={`absolute left-0 top-full z-20 mt-1 w-full origin-top overflow-hidden rounded-b-xl rounded-t-none border border-[#cdddf0] border-t-0 bg-[#0456a7] shadow-[0_18px_35px_rgba(2,44,92,0.18)] transition-[max-height,opacity,transform] duration-200 ease-out ${
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
                    isActive ? 'bg-white text-primary' : 'text-white hover:bg-white/10'
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
