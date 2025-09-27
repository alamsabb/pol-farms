'use client'

import { useState } from 'react'
import { Sidebar } from '@/shared/components/layout/sidebar'
import { Header } from '@/shared/components/layout/header'


export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:relative lg:translate-x-0 z-50 transition-transform duration-300 lg:z-auto`}>
        <Sidebar 
          onClose={() => setSidebarOpen(false)} 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        <Header 
          onMenuClick={() => {
            // Mobile: toggle sidebar open/close
            // Desktop: toggle sidebar collapse
            if (window.innerWidth < 1024) {
              setSidebarOpen(!sidebarOpen)
            } else {
              setSidebarCollapsed(!sidebarCollapsed)
            }
          }} 
        />
        <main className="flex-1 overflow-auto p-3 sm:p-6 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}