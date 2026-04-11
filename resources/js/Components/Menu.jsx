import React from 'react'
import Logout from '../actions/Logout'
import MenuItem from './MenuItem'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css';
import LaravelSession from '../Utils/LaravelSession'
import { useAdminto } from './AdmintoContext'

const Menu = ({ session, can, rhYearTotalBadge }) => {
  const mainRole = LaravelSession.roles?.[0] ?? { name: 'User' }

  const { metrics } = useAdminto()

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
            <img src={`/storage/images/user/${LaravelSession.image}`}
              className="rounded-circle aspect-square"
              style={{
                width: '46px',
                aspectRatio: 1,
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              onError={e => e.target.src = `https://ui-avatars.com/api/?name=${LaravelSession.name}+${LaravelSession.lastname}&color=FFFFFF&background=FFFFFF11`}
              alt={LaravelSession.fullname} />
            <span className="d-flex justify-content-center gap-1 sidenav-user-name my-2">
              <span>
                <span className="mb-0 fw-semibold lh-base fs-15">{LaravelSession.name?.split(' ')[0]} {LaravelSession.lastname?.split(' ')[0]}</span>
                <p className="my-0 fs-13 text-muted">{mainRole?.name}</p>
              </span>

              <i className="ri-arrow-down-s-line d-block sidenav-user-arrow align-middle"></i>
            </span>
          </a>
          <div className="dropdown-menu dropdown-menu-end">

            <div className="dropdown-header noti-title">
              <h6 className="text-overflow m-0">Bienvenido!</h6>
            </div>


            <a href="javascript:void(0);" className="dropdown-item">
              <i className="ri-account-circle-line me-1 fs-16 align-middle"></i>
              <span className="align-middle">Mi cuenta</span>
            </a>


            <a href="javascript:void(0);" className="dropdown-item">
              <i className="ri-wallet-3-line me-1 fs-16 align-middle"></i>
              <span className="align-middle">Billetera: <span className="fw-semibold">$89.25k</span></span>
            </a>


            <a href="javascript:void(0);" className="dropdown-item">
              <i className="ri-settings-2-line me-1 fs-16 align-middle"></i>
              <span className="align-middle">Configuracion</span>
            </a>


            <a href="javascript:void(0);" className="dropdown-item">
              <i className="ri-question-line me-1 fs-16 align-middle"></i>
              <span className="align-middle">Soporte</span>
            </a>

            <div className="dropdown-divider"></div>


            <a href="javascript:void(0);" className="dropdown-item">
              <i className="ri-lock-line me-1 fs-16 align-middle"></i>
              <span className="align-middle">Bloquear pantalla</span>
            </a>


            <a href="javascript:void(0);" className="dropdown-item active fw-semibold text-danger">
              <i className="ri-logout-box-line me-1 fs-16 align-middle"></i>
              <span className="align-middle">Cerrar sesion</span>
            </a>
          </div>
        </div>
        <div className='px-3'>
          <div className="row g-0">
            <div className="col-4">
              <Tippy
                content={
                  <>
                    Usando: {metrics?.cpu?.used?.toFixed(1)} Cores
                    <br />
                    Total: {metrics?.cpu?.total} Cores
                  </>
                }
              >
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <small className="text-muted d-block">CPU</small>
                  <div className={`fw-bold fs-5 ${metrics?.cpu?.percent < 50 ? 'text-success' : metrics?.cpu?.percent <= 80 ? 'text-warning' : 'text-danger'}`}>
                    {metrics?.cpu?.percent?.toFixed(1)}<span className="fs-7">%</span>
                  </div>
                </div>
              </Tippy>
            </div>

            <div className="col-4">
              <Tippy
                content={
                  <>
                    Usando: {Math.round(metrics?.ram?.used / 1024)} GB
                    <br />
                    Total: {Math.round(metrics?.ram?.total / 1024)} GB
                  </>
                }
              >
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <small className="text-muted d-block">RAM</small>
                  <div className={`fw-bold fs-5 ${metrics?.ram?.percent < 50 ? 'text-success' : metrics?.ram?.percent <= 80 ? 'text-warning' : 'text-danger'}`}>
                    {metrics?.ram?.percent?.toFixed(1)}<span className="fs-7">%</span>
                  </div>
                </div>
              </Tippy>
            </div>

            <div className="col-4">
              <Tippy
                content={
                  <>
                    Usando: {Math.round(metrics?.disk?.used / 1024 / 1024)} GB
                    <br />
                    Total: {Math.round(metrics?.disk?.total / 1024 / 1024)} GB
                  </>
                }
              >
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <small className="text-muted d-block">Disk</small>
                  <div className={`fw-bold fs-5 ${metrics?.disk?.percent < 50 ? 'text-success' : metrics?.disk?.percent <= 80 ? 'text-warning' : 'text-danger'}`}>
                    {metrics?.disk?.percent}<span className="fs-7">%</span>
                  </div>
                </div>
              </Tippy>
            </div>
          </div>
        </div>
      </div>

      <ul className="side-nav">
        <MenuItem href="/home" icon='ti ti-home'>Inicio</MenuItem>
        <MenuItem href="/contacts" icon='ti ti-user-plus'>Leads</MenuItem>
        <MenuItem href="/projects" icon='ti ti-briefcase'>Proyectos</MenuItem>
      </ul>

      <div className="clearfix"></div>
    </div>
  </div>)
}

export default Menu
