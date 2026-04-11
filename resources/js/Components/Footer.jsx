import React from 'react'

const Footer = () => {
  const fullYear = new Date().getFullYear()
  return (<footer className="footer">
    <div className="page-container">
      <div className="row">
        <div className="col-md-6 text-center text-md-start">
          {fullYear} © Panel - Propiedad de <span className="fw-bold text-decoration-underline text-uppercase text-reset fs-12">DevEx Consulting</span>
        </div>
        <div className="col-md-6">
          <div className="text-md-end footer-links d-none d-md-block">
            {/* <a href="javascript: void(0);">About</a>
            <a href="javascript: void(0);">Support</a>
            <a href="javascript: void(0);">Contact Us</a> */}
          </div>
        </div>
      </div>
    </div>
  </footer>)
}

export default Footer