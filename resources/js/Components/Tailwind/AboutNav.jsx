const tabs = [
  { label: 'Familia', href: '/about' },
  { label: 'Politica', href: '/about/politica' },
]

const AboutNav = () => {
  const currentPath =
    typeof window === 'undefined' ? '/about' : window.location.pathname.replace(/\/$/, '') || '/about'

  const normalizedPath =
    currentPath === '/about/familia' || currentPath === '/nosotros-familia'
      ? '/about/familia'
      : currentPath === '/nosotros-politica'
        ? '/about/politica'
        : currentPath

  return (
    <div className='border-b border-slate-200 bg-white'>
      <div className='mx-auto flex w-full max-w-site items-center gap-3 overflow-x-auto px-4 py-3 text-sm'>
        {tabs.map((tab) => {
          const isActive = normalizedPath === tab.href

          return (
            <a
              key={tab.label}
              href={tab.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-medium transition ${
                isActive ? 'bg-primary text-white' : 'bg-silver text-primary hover:bg-[#e8eef5]'
              }`}
            >
              {tab.label}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default AboutNav
