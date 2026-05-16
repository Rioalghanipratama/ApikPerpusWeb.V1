import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BookOpen, Home, Users, ArrowLeftRight, Settings, Library, Menu, Shield, X, ClipboardIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth, Role } from '../lib/AuthContext';
import { RegistrationInfoModal } from './RegistrationInfoModal';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, switchUser, logout, isLoginModalOpen, setIsLoginModalOpen, isRegInfoModalOpen, setIsRegInfoModalOpen } = useAuth();

  const isGuest = currentUser.role === 'guest';

  const navigation = [
    { name: isGuest ? 'Beranda' : 'Dashboard', href: '/', icon: Home, roles: ['admin', 'member', 'guest'] },
    { name: 'Katalog Buku', href: '/books', icon: BookOpen, roles: ['admin', 'member', 'guest'] },
    { name: 'Anggota', href: '/members', icon: Users, roles: ['admin'] },
    { name: 'Peminjaman', href: '/transactions', icon: ArrowLeftRight, roles: ['admin', 'member'] },
    { name: 'Pengaturan', href: '/settings', icon: Settings, roles: ['admin'] },
  ].filter(item => item.roles.includes(currentUser.role));

  const handleLogin = (role: Role) => {
    switchUser(role);
  };

  return (
    <div className="min-h-screen bg-natural-bg text-text-main flex font-sans overflow-hidden">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-natural-panel flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <Library className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-text-title">ApikPerpus</span>
          </div>
          <nav className="flex flex-1 flex-col overflow-y-auto">
            <ul role="list" className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-natural-active text-text-title font-semibold'
                          : 'text-text-muted hover:bg-natural-hover font-medium'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
              {isGuest && (
                <li>
                  <button
                    onClick={() => {
                      setIsRegInfoModalOpen(true);
                      setSidebarOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-colors text-text-muted hover:bg-natural-hover font-medium"
                  >
                    <ClipboardIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    Cara Mendaftar
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col bg-white border-r border-natural-border p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-10 px-2 uppercase tracking-tighter">
            <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
              <Library className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-text-title">ApikPerpus</span>
          </div>
          <nav className="flex flex-1 flex-col gap-y-7 items-start w-full">
            <ul role="list" className="space-y-1 w-full">
              {navigation.map((item) => (
                <li key={item.name} className="w-full">
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full ${
                        isActive
                          ? 'bg-natural-active text-text-title font-semibold'
                          : 'text-text-muted hover:bg-natural-hover font-medium'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
              {isGuest && (
                <li className="w-full">
                  <button
                    onClick={() => setIsRegInfoModalOpen(true)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-text-muted hover:bg-natural-hover font-medium"
                  >
                    <ClipboardIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    Cara Mendaftar
                  </button>
                </li>
              )}
            </ul>

            <div className="mt-auto w-full">
              {isGuest ? (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-2xl font-bold hover:shadow-xl transition-all active:scale-95 mb-6 shadow-lg shadow-primary/10"
                >
                  <Shield className="w-5 h-5" />
                  MASUK SISTEM
                </button>
              ) : (
                <div className="mb-6 bg-natural-active p-4 rounded-2xl border border-natural-border">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-2 text-[10px] font-bold text-text-title uppercase tracking-widest">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                        Sesi Aktif
                     </div>
                     <button onClick={logout} className="text-[10px] font-extrabold text-red-500 hover:underline">LOGOUT</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-primary font-bold text-sm ring-2 ring-primary/10">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-title truncate">{currentUser.name.split(' (')[0]}</p>
                      <p className="text-[10px] text-text-muted capitalize">{currentUser.role === 'admin' ? 'Pustakawan' : 'Anggota'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-natural-hover rounded-2xl w-full">
                <p className="text-xs font-bold text-text-light uppercase tracking-wider mb-2">Sistem Info</p>
                <div className="flex justify-between items-center mb-1">
                   <p className="text-[10px] font-semibold text-text-title">Utilitas Server</p>
                   <p className="text-[10px] font-bold text-primary">65%</p>
                </div>
                <div className="w-full bg-accent h-1.5 rounded-full">
                  <div className="bg-primary h-1.5 w-[65%] rounded-full shadow-[0_0_8px_rgba(var(--color-primary),0.4)]"></div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:pl-72 h-screen overflow-hidden">
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-natural-border bg-white/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <div className="flex gap-2 items-center">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <Library className="h-5 w-5" />
             </div>
             <span className="text-xl font-bold text-text-title tracking-tight">ApikPerpus</span>
          </div>
          <div className="flex items-center gap-3">
            {isGuest ? (
               <button onClick={() => setIsLoginModalOpen(true)} className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">MASUK</button>
            ) : (
               <button onClick={logout} className="text-xs font-bold text-red-500">KELUAR</button>
            )}
            <button type="button" className="-m-2.5 p-2.5 text-text-muted transition-colors hover:text-primary" onClick={() => setSidebarOpen(true)}>
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="py-8 px-4 sm:px-8 lg:px-10 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Login Simulasi Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden p-10 animate-in zoom-in-95 duration-200">
              <div className="text-center mb-8">
                 <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <Shield className="w-10 h-10" />
                 </div>
                 <h2 className="text-2xl font-black text-text-title tracking-tight">E-PERPUSTAKAAN</h2>
                 <p className="text-sm text-text-muted mt-2">Masuk untuk meminjam buku & akses fitur perpus.</p>
              </div>
              
              <div className="space-y-4">
                 <button 
                  onClick={() => handleLogin('member')}
                  className="w-full flex items-center justify-between group bg-natural-bg hover:bg-primary p-5 rounded-2xl transition-all border border-natural-border hover:border-primary shadow-sm hover:shadow-lg hover:shadow-primary/20"
                 >
                    <div className="text-left">
                       <p className="font-bold text-sm group-hover:text-white">Akun Anggota</p>
                       <p className="text-[10px] text-text-muted group-hover:text-white/80">Mahasiswa / Dosen</p>
                    </div>
                    <Users className="w-5 h-5 text-primary group-hover:text-white" />
                 </button>

                 <button 
                  onClick={() => handleLogin('admin')}
                  className="w-full flex items-center justify-between group bg-natural-bg hover:bg-primary p-5 rounded-2xl transition-all border border-natural-border hover:border-primary shadow-sm hover:shadow-lg hover:shadow-primary/20"
                 >
                    <div className="text-left">
                       <p className="font-bold text-sm group-hover:text-white">Akun Staf / Admin</p>
                       <p className="text-[10px] text-text-muted group-hover:text-white/80">Manajemen & Sirkulasi</p>
                    </div>
                    <Settings className="w-5 h-5 text-primary group-hover:text-white" />
                 </button>
              </div>

              <div className="mt-8 text-center space-y-4">
                {isGuest && (
                  <button 
                    onClick={() => {
                      setIsLoginModalOpen(false);
                      setIsRegInfoModalOpen(true);
                    }}
                    className="block w-full text-xs font-bold text-primary hover:underline decoration-2 underline-offset-4"
                  >
                    BELUM PUNYA AKUN? LIHAT CARA DAFTAR
                  </button>
                )}
                <button 
                  onClick={() => setIsLoginModalOpen(false)}
                  className="text-xs font-bold text-text-lighter hover:text-primary transition-colors py-2 uppercase tracking-widest"
                >
                  Batal & Tutup
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Modal Cara Mendaftar */}
      <RegistrationInfoModal 
        isOpen={isRegInfoModalOpen} 
        onClose={() => setIsRegInfoModalOpen(false)} 
      />
    </div>
  );
}

