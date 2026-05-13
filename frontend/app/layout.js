export const metadata = {
  title: 'AfriPoint Task Manager',
  description: 'Task management app running on Kubernetes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#fff' }}>
        {children}
      </body>
    </html>
  )
}