import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Layout({ children }) {
  return (
      <html lang="en">
        <body className="bg-netflixGray text-white">
          <Header />
          <main className="mx-auto">
            {children}
          </main>
          <Footer />
        </body>
      </html>
  );
}