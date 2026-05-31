import React from 'react'

const MenuItem = ({ href, icon, badge = null, children }) => {
  const isActive = location.pathname.startsWith(href)
  return (
    <li className={`side-nav-item ${isActive ? 'active' : ''}`}>
      <a href={href} className="side-nav-link">
        <span className="menu-icon"><i className={icon}></i></span>
        <span className="menu-text">{children}</span>
        {
          badge > 0 && <span className="badge bg-primary rounded-pill">{badge}</span>
        }
      </a>
    </li>
  )
}

export default MenuItem