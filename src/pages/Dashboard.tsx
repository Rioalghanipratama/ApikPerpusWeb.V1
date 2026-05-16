import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Users, ArrowLeftRight, AlertCircle, ChevronRight, BookOpen } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { useAuth } from '../lib/AuthContext';

export default function Dashboard() {
  const { books, members, transactions } = useApp();
  const { currentUser, setIsRegInfoModalOpen } = useAuth();
  
  const isAdmin = currentUser.role === 'admin';
  const isMember = currentUser.role === 'member';
  const isGuest = currentUser.role === 'guest';

  // For members, only show their own transactions. For guests, show nothing or public.
  const recentTransactions = transactions
    .filter(t => isAdmin || (isMember && t.memberId === currentUser.memberId))
    .slice()
    .reverse()
    .slice(0, 5);

  const stats = {
    books: books.length,
    members: members.length,
    borrowed: transactions.filter(t => t.status === 'Borrowed').length,
    overdue: transactions.filter(t => t.status === 'Overdue').length,
    pending: transactions.filter(t => t.status === 'Pending').length,
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-primary rounded-[32px] p-8 text-white flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <h2 className="text-3xl font-serif italic mb-2">
              {isAdmin ? `Halo, Admin ${currentUser.name.split(' (')[0]}!` : 
               isMember ? `Selamat Datang, ${currentUser.name.split(' (')[0]}!` : 
               'Halo, Sobat Literasi!'}
            </h2>
            <p className="text-white/80 max-w-sm mb-6">
              {isAdmin ? 'Kelola sirkulasi perpustakaan, tambah koleksi baru, dan pantau aktivitas peminjaman hari ini.' :
               isMember ? 'Jelajahi koleksi buku terbaru dan lihat status peminjaman Anda.' :
               'Temukan ribuan buku berkualitas dan jadilah anggota untuk mulai meminjam.'}
            </p>
            <Link 
              to="/books" 
              className="inline-block bg-white text-primary hover:bg-natural-bg transition-colors px-6 py-2.5 rounded-full font-bold text-sm shadow-lg"
            >
              Exsplorasi Katalog
            </Link>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-20">
             <BookOpen className="w-64 h-64" />
          </div>
        </div>
        
        {!isGuest && (
          <div className="bg-natural-panel rounded-[32px] p-8 border border-natural-border">
            <h3 className="font-bold text-text-title mb-4">
              {isAdmin ? 'Statistik Perpustakaan' : 'Statistik Saya'}
            </h3>
            <div className="space-y-4">
              {isAdmin ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Total Koleksi Buku</span>
                    <span className="font-bold text-lg">{stats.books}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Total Anggota</span>
                    <span className="font-bold text-lg">{stats.members}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Buku Dipinjam</span>
                  <span className="font-bold text-lg">{recentTransactions.length}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">
                  {isAdmin ? 'Sedang Dipinjam' : 'Belum Kembali'}
                </span>
                <span className="font-bold text-lg text-primary">
                  {isAdmin ? stats.borrowed : recentTransactions.filter(t => t.status === 'Borrowed').length}
                </span>
              </div>
              {isAdmin && stats.pending > 0 && (
                <div className="flex items-center justify-between border-t border-natural-border pt-3 mt-1">
                  <span className="text-sm text-primary font-medium">Menunggu Validasi</span>
                  <span className="font-bold text-lg text-primary">{stats.pending}</span>
                </div>
              )}
              {isAdmin && stats.overdue > 0 && (
                <div className="flex items-center justify-between border-t border-natural-border pt-3 mt-1">
                  <span className="text-sm text-red-500 font-medium">Terlambat Kembali</span>
                  <span className="font-bold text-lg text-red-500">{stats.overdue}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {isGuest && (
          <div className="bg-natural-panel rounded-[32px] p-8 border border-natural-border flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-text-title mb-2">Ingin Meminjam?</h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed px-4">Segera daftarkan diri Anda di meja sirkulasi untuk mendapatkan akses penuh peminjaman buku.</p>
            <button 
              onClick={() => setIsRegInfoModalOpen(true)}
              className="text-primary font-extrabold text-sm underline underline-offset-4 hover:text-opacity-80 transition-all uppercase tracking-widest"
            >
              Cara Mendaftar
            </button>
          </div>
        )}
      </div>

      {/* Popular Books Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-text-title">Koleksi Terpopuler</h3>
          <Link to="/books" className="text-sm font-semibold text-primary underline underline-offset-4">Lihat Semua</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.slice(0, 4).map((book, index) => {
            const bgColors = ['bg-[#F1E5D5]', 'bg-[#D5E1F1]', 'bg-[#E1F1D5]', 'bg-[#E9D5F1]'];
            const textColors = ['text-[#8D7B6D]', 'text-[#5D6D8D]', 'text-[#5D8D5D]', 'text-[#7B5D8D]'];
            const bgColor = bgColors[index % bgColors.length];
            const textColor = textColors[index % textColors.length];

            return (
              <div key={book.id} className="bg-white p-4 rounded-2xl shadow-sm border border-natural-border transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className={`w-full aspect-[3/4] ${bgColor} rounded-xl mb-4 overflow-hidden flex items-center justify-center p-4 text-center`}>
                  <span className={`text-xs ${textColor} font-bold uppercase rotate-12`}>{book.category}</span>
                </div>
                <p className="font-bold text-sm leading-tight mb-1 line-clamp-1" title={book.title}>{book.title}</p>
                <p className="text-xs text-text-light mb-4 line-clamp-1">{book.author}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${
                    book.status === 'Available'
                      ? 'bg-natural-bg text-primary border border-natural-border'
                      : 'bg-[#F1E9EA] text-red-500 border border-red-100'
                  }`}>
                    {book.status === 'Available' ? 'Tersedia' : 'Dipinjam'}
                  </span>
                  <Link to="/books" className="text-text-lighter hover:text-primary transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions List */}
      {!isGuest && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-text-title mb-6">
            {isAdmin ? 'Aktivitas Terbaru' : 'Pinjaman Terakhir Saya'}
          </h3>
          {recentTransactions.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-natural-border overflow-hidden">
              <ul role="list" className="divide-y divide-natural-border">
                {recentTransactions.map((tx) => {
                  const book = books.find(b => b.id === tx.bookId);
                  const member = members.find(m => m.id === tx.memberId);
                  return (
                    <li key={tx.id} className="flex justify-between gap-x-6 px-6 py-5 hover:bg-natural-bg transition-colors">
                      <div className="flex min-w-0 gap-x-4 items-center">
                        <div className="h-12 w-12 flex-shrink-0 bg-natural-panel rounded-xl flex items-center justify-center">
                           <ArrowLeftRight className="h-5 w-5 text-text-muted"/>
                        </div>
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-bold leading-6 text-text-title">{book?.title}</p>
                          <p className="mt-1 truncate text-xs leading-5 text-text-muted">
                            {isAdmin ? (
                              <>Dipinjam oleh <span className="font-medium text-text-title">{member?.name}</span> ({member?.studentId})</>
                            ) : (
                              <>Dipinjam pada <span className="font-medium text-text-title">{tx.borrowDate}</span></>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:flex sm:flex-col sm:items-end">
                        <p className="text-sm font-medium leading-6 text-text-title">{tx.borrowDate}</p>
                        <div className="mt-1 flex items-center gap-x-1.5">
                          <div className={`flex-none rounded-full p-1 ${
                            tx.status === 'Returned' ? 'bg-primary/20' : 
                            tx.status === 'Pending' ? 'bg-blue-100' : 
                            'bg-accent/30'
                          }`}>
                            <div className={`h-1.5 w-1.5 rounded-full ${
                              tx.status === 'Returned' ? 'bg-primary' : 
                              tx.status === 'Pending' ? 'bg-blue-600' : 
                              'bg-yellow-600'
                            }`} />
                          </div>
                          <p className="text-xs leading-5 text-text-muted font-medium">
                            {tx.status === 'Returned' ? 'Selesai Dibaca' : 
                             tx.status === 'Pending' ? 'Siap Diambil' : 
                             'Sedang Dipinjam'}
                          </p>
                          {tx.status === 'Pending' && tx.bookingCode && (
                            <span className="ml-2 py-0.5 px-2 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg border border-blue-100">
                              KODE: {tx.bookingCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-natural-border">
              <p className="text-sm text-text-muted">Belum ada riwayat peminjaman.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

