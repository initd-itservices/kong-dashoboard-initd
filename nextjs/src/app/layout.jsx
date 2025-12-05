import './globals.css'
import Sidebar from './_components/Sidebar'
import Topbar from './_components/Topbar'
import Footer from './_components/Footer'
import ThemeInit from './_components/ThemeInit'

export const metadata = { title: 'Kong Dashboard (Next)' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeInit />
        <Topbar />
        <div className="app">
          <Sidebar />
          <main className="content container">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  )
}
