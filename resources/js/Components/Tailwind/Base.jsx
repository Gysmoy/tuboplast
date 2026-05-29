import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

const Base = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <TopBar />
      <Header title={title} />
      <main>{children}</main>
      <a
        href="https://wa.me/51999999999"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 right-20 z-40 grid h-16 w-16 place-items-center rounded-full bg-[#25D366] ring-8 ring-[#25D366]/20 text-white shadow-xl"
        aria-label="WhatsApp"
      >
        <i className="mdi mdi-whatsapp text-4xl"></i>
      </a>
      <Footer />
    </div>
  );
};

export default Base;
