import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';
import Global from '../../Utils/Global';

const Base = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <TopBar />
      <Header title={title} />
      <main>{children}</main>
      <a
        href={Global.WA_URL || 'https://wa.me/51947389121'}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl ring-8 ring-[#25D366]/20 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16 lg:bottom-20 lg:right-20"
        aria-label="WhatsApp"
      >
        <i className="mdi mdi-whatsapp text-4xl"></i>
      </a>
      <Footer />
    </div>
  );
};

export default Base;
