import React from 'react'
import Logout from '../Actions/Logout'
import MenuItem from './MenuItem'
import MenuItemContainer from './MenuItemContainer'
import LaravelSession from '../Utils/LaravelSession'

const Menu = ({ session, can, rhYearTotalBadge }) => {
  const mainRole = LaravelSession.roles?.[0] ?? { name: 'User' }
  const avatarImage = LaravelSession.image || session?.image
  const avatarUrl = avatarImage
    ? `/storage/images/user/${avatarImage}`
    : `https://ui-avatars.com/api/?name=${session.name}+${session.lastname}&color=FFFFFF&background=FFFFFF11`

  return (<div className="sidenav-menu">
    <a href="/" className="logo">
      <span className="logo-light">
        <span className="logo-lg"><img src="/assets/img/logo-white.svg" alt="logo" height={40} style={{ height: '36px' }} /></span>
        <span className="logo-sm"><img src="/assets/img/icon-white.svg" alt="small logo" /></span>
      </span>

      <span className="logo-dark">
        <span className="logo-lg"><img src="/assets/img/logo.svg" alt="dark logo" /></span>
        <span className="logo-sm"><img src="/assets/img/icon.svg" alt="small logo" /></span>
      </span>
    </a>


    <button className="button-sm-hover">
      <i className="ri-circle-line align-middle"></i>
    </button>


    <button className="sidenav-toggle-button">
      <i className="mdi mdi-menu fs-20"></i>
    </button>


    <button className="button-close-fullsidebar">
      <i className="mdi mdi-close align-middle"></i>
    </button>
    <div data-simplebar>
      <div className="sidenav-user">
        <div className="dropdown-center text-center">
          <a className="topbar-link dropdown-toggle text-reset drop-arrow-none px-2" data-bs-toggle="dropdown"
            type="button" aria-haspopup="false" aria-expanded="false">
            <img src={avatarUrl}
              className="rounded-circle aspect-square"
              style={{
                width: '46px',
                aspectRatio: 1,
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              onError={e => e.target.src = `https://ui-avatars.com/api/?name=${session.name}+${session.lastname}&color=FFFFFF&background=FFFFFF11`}
              alt={session.fullname} />
            <span className="d-flex justify-content-center gap-1 sidenav-user-name my-2">
              <span>
                <span className="mb-0 fw-semibold lh-base fs-15">{session.name?.split(' ')[0]} {session.lastname?.split(' ')[0]}</span>
                <p className="my-0 fs-13 text-muted">{mainRole?.name}</p>
              </span>

              <i className="ri-arrow-down-s-line d-block sidenav-user-arrow align-middle"></i>
            </span>
          </a>
          <div className="dropdown-menu dropdown-menu-end">

            <div className="dropdown-header noti-title">
              <h6 className="text-overflow m-0">Bienvenido!</h6>
            </div>


            <a href="/account" className="dropdown-item">
              <i className="ri-account-circle-line me-1 fs-16 align-middle"></i>
              <span className="align-middle">Mi cuenta y perfil</span>
            </a>


            <a href="javascript:void(0);" className="dropdown-item">
              <i className="ri-wallet-3-line me-1 fs-16 align-middle"></i>
              <span className="align-middle">Billetera: <span className="fw-semibold">$89.25k</span></span>
            </a>


            <a href="javascript:void(0);" className="dropdown-item">
              <i className="ri-settings-2-line me-1 fs-16 align-middle"></i>
              <span className="align-middle">Configuracion</span>
            </a>

            <div className="dropdown-divider"></div>


            <a href="javascript:void(0);" className="dropdown-item">
              <i className="ri-lock-line me-1 fs-16 align-middle"></i>
              <span className="align-middle">Bloquear pantalla</span>
            </a>


            <a href="javascript:void(0);" className="dropdown-item active fw-semibold text-danger" onClick={Logout}>
              <i className="ri-logout-box-line me-1 fs-16 align-middle"></i>
              <span className="align-middle">Cerrar sesion</span>
            </a>
          </div>
        </div>
      </div>

      <ul className="side-nav">
        <MenuItem href="/admin/home" icon='ti ti-home'>Dashboard</MenuItem>
        <MenuItem href="/admin/cotizaciones" icon='ti ti-receipt-2'>Cotizaciones</MenuItem>
        <MenuItem href="/admin/club-experto" icon='ti ti-users-group'>Club experto</MenuItem>
        <MenuItem href="/admin/mensajes" icon='ti ti-message-dots'>Mensajes</MenuItem>

        <li className="side-nav-title mt-2">Catalogo</li>
        <MenuItem href="/admin/items" icon='ti ti-package'>Items</MenuItem>
        <MenuItem href="/admin/categorias" icon='ti ti-category'>Categorias</MenuItem>

        <li className="side-nav-title mt-2">Landing</li>
        <MenuItem href="/admin/distributors" icon='ti ti-truck-delivery'>Distribuidores</MenuItem>
        <MenuItem href="/admin/branches" icon='ti ti-building-store'>Sucursales</MenuItem>

        <li className="side-nav-title mt-2">Configuraciones</li>
        <MenuItemContainer title='Seguridad' icon='ti ti-shield-lock'>
          <MenuItem href="/admin/roles" icon='ti ti-key'>Roles</MenuItem>
          <MenuItem href="/admin/users" icon='ti ti-users'>Usuarios</MenuItem>
        </MenuItemContainer>
        <MenuItem href="/account" icon='ti ti-user-circle'>Mi cuenta</MenuItem>
      </ul>

      <div className="clearfix"></div>
    </div>
  </div>)
}

export default Menu
