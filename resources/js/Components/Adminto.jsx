import React, { useEffect } from 'react'
import NavBar from './NavBar'
import Menu from './Menu'
import Footer from './Footer'
import { AdmintoProvider } from './AdmintoContext'

moment.tz.setDefault('UTC');

const Adminto = ({ ...properties }) => {
  const { session, children, title, can, unreadMessagesCount, unreadClubCount } = properties

  useEffect(() => {
    const app = new App
    const theme = new ThemeCustomizer
    app.init()
    theme.init()
    customJS()
  }, [])

  return (<AdmintoProvider {...properties}>
    <div className="wrapper">
      <Menu
        session={session}
        can={can}
        unreadMessagesCount={unreadMessagesCount}
        unreadClubCount={unreadClubCount}
      />
      <NavBar session={session} title={title} can={can} />
      <div className="modal fade" id="searchModal" tabIndex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content bg-transparent">
            <form>
              <div className="card mb-1">
                <div className="px-3 py-2 d-flex flex-row align-items-center" id="top-search">
                  <i className="ri-search-line fs-22"></i>
                  <input type="search" className="form-control border-0" id="search-modal-input"
                    placeholder="Search for actions, people," />
                  <button type="submit" className="btn p-0" data-bs-dismiss="modal" aria-label="Close">[esc]</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="page-container">
          {children}
        </div>
        <Footer />
      </div>
    </div>
    {/* {can('whatsapp', 'all') && <WhatsAppModal session={session} status={whatsappStatus} setStatus={setWhatsappStatus} WA_URL={WA_URL} APP_URL={APP_URL} />} */}
    {/* <RigthBar /> */}
    {/* <div className="rightbar-overlay"></div> */}
  </AdmintoProvider>)
}

export default Adminto
