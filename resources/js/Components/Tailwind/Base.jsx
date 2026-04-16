import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

const Base = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <TopBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Base;
