import { Inter } from "next/font/google";
import { Slide, ToastContainer } from "react-toastify";
import SessionProviderWrapper from "./_components/SessionProviderWrapper";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import './toastStyle.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FreshBite Haven",
  description: "FreshBite Haven",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <SessionProviderWrapper>
          <main>{children}</main>
        </SessionProviderWrapper>

        <ToastContainer
          position="bottom-center"
          hideProgressBar
          transition={Slide}
          autoClose={1500}
          theme="light"
          className="toast-container"
        />
      </body>
    </html>
  );
}
