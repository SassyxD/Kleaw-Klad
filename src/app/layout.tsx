import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Klaew Klad - Hat Yai Flood Digital Twin',
  description: 'Satellite-Driven Digital Twin for Dynamic Flood Impact Forecasting & Strategic Evacuation',
  keywords: ['flood', 'digital twin', 'Hat Yai', 'Thailand', 'disaster management', 'evacuation'],
  authors: [{ name: 'Klaew Klad Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#152438',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
