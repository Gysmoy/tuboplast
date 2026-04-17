import React, { useMemo } from 'react'

const MenuItemContainer = ({ title, icon, children }) => {
  const childItems = React.Children.toArray(children)
  const refs = childItems.map(child => child?.props?.href).filter(Boolean)
  const isExpanded = refs.some((x) => location.pathname.startsWith(x))
  const id = useMemo(() => {
    const slug = (title ?? 'menu')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return `sidebar-${slug}-${Math.random().toString(36).slice(2, 7)}`
  }, [title])

  return (
    <li className="side-nav-item">
      <a data-bs-toggle="collapse" href={`#${id}`} aria-expanded={isExpanded}
        aria-controls={id} className="side-nav-link">
        <span className="menu-icon"><i className={icon}></i></span>
        <span className="menu-text"> {title}</span>
        <span className="menu-arrow"></span>
      </a>
      <div className={`collapse ${isExpanded ? 'show' : ''}`} id={id}>
        <ul className="sub-menu">
          {children}
        </ul>
      </div>
    </li>
  )
}

export default MenuItemContainer
