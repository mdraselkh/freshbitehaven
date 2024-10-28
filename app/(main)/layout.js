import { CartProvider } from '../context/CartContext';
import { StockProvider } from '../context/StockContext';
import Breadcrumbs from './_components/BreadCrumb';
import Footer from './_components/Footer';
import Header from './_components/Header';
import PopUpModal from './_components/PopUpModal';


export default async function MainLayout({ children }) {
    return (
        <>
            <StockProvider>
            <CartProvider>
                <Header />
                <Breadcrumbs />
                <PopUpModal/>
                <div>{children}</div>
            </CartProvider>
            </StockProvider>
            <Footer />
        </>
    );
}
