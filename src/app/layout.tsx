import './globals.css'
import SmoothScroll from '@/components/layout/SmoothScroll'
import Navbar from '@/components/layout/Navbar'
import GlobalAudioPlayer from '@/components/layout/GlobalAudioPlayer'

export const metadata = {
  title: 'Wenon Bont | Sound Architect',
  description: 'Premium music production and cinematic audio experiences.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background text-foreground antialiased">
      <body>
        <SmoothScroll>
          <Navbar />
          <main className="relative z-10">{children}</main>
          <GlobalAudioPlayer />
        </SmoothScroll>
      </body>
    </html>
  )
}
