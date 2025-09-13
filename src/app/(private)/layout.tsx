import Sidebar from '@/shared/components/layout/sidebar'

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-accent/5">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  )
}