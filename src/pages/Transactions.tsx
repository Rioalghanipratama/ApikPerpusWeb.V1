import React, { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { useAuth } from '../lib/AuthContext';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [validationCode, setValidationCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [form, setForm] = useState({ bookId: '', memberId: '' });
  const { transactions, books, members, returnBook, borrowBook, validateBooking } = useApp();
  const { currentUser } = useAuth();
  
  const isAdmin = currentUser.role === 'admin';

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validationCode) return;
    const result = validateBooking(validationCode.toUpperCase());
    alert(result.message);
    if (result.success) setValidationCode('');
  };

  const availableBooks = books.filter(b => b.status === 'Available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.bookId || !form.memberId) return;
    borrowBook(form.bookId, form.memberId);
    setIsModalOpen(false);
    setForm({ bookId: '', memberId: '' });
  };

  const filteredTransactions = transactions.filter(tx => {
    // Member only sees their own
    if (!isAdmin && tx.memberId !== currentUser.memberId) return false;
    
    const book = books.find(b => b.id === tx.bookId);
    const member = members.find(m => m.id === tx.memberId);
    return (
      book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member?.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-text-title sm:truncate sm:text-3xl sm:tracking-tight font-serif">
            {isAdmin ? 'Data Peminjaman' : 'Riwayat Peminjaman Saya'}
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            {isAdmin ? 'Catatan transaksi sirkulasi peminjaman dan pengembalian buku.' : 'Detail dari riwayat buku yang Anda pinjam dari perpustakaan.'}
          </p>
        </div>
        {isAdmin && (
          <div className="mt-4 flex sm:ml-4 sm:mt-0 gap-3">
            <button
              type="button"
              onClick={() => setIsReturnModalOpen(true)}
              className="inline-flex items-center gap-x-2 rounded-xl bg-natural-panel border border-natural-border px-4 py-2.5 text-sm font-bold text-text-title shadow-sm hover:bg-natural-hover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Pengembalian
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-x-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-opacity-90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Entri Baru
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-natural-border">
        {isAdmin && (
           <form onSubmit={handleValidate} className="flex flex-grow max-w-sm gap-2">
              <input
                type="text"
                className="block w-full rounded-xl bg-natural-panel border-none py-2.5 px-4 text-text-main text-sm focus:ring-2 focus:ring-primary placeholder:text-text-lighter uppercase font-mono tracking-widest"
                placeholder="INPUT KODE BOOKING"
                value={validationCode}
                onChange={(e) => setValidationCode(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-opacity-90 transition-all whitespace-nowrap"
              >
                Validasi
              </button>
           </form>
        )}
        
        <div className={`relative flex-grow ${isAdmin ? 'md:border-l md:pl-4 border-natural-border' : ''}`}>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
             {isAdmin && <div className="w-px h-6 bg-natural-border mr-4 hidden md:block" />}
            <Search className="h-4 w-4 text-text-muted" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl bg-natural-panel border-none py-2.5 pl-11 pr-4 text-text-main text-sm focus:ring-2 focus:ring-primary placeholder:text-text-lighter"
            placeholder="Cari buku atau nama peminjam..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm border border-natural-border sm:rounded-2xl bg-white">
              <table className="min-w-full divide-y divide-natural-border">
                <thead className="bg-natural-bg">
                  <tr>
                    <th scope="col" className="py-4 pl-4 pr-3 text-left text-xs font-bold text-text-light uppercase tracking-wider sm:pl-6">
                      Buku
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-text-light uppercase tracking-wider">
                      Peminjam
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-text-light uppercase tracking-wider">
                      Tgl Pinjam
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-text-light uppercase tracking-wider">
                      Tgl Kembali
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-text-light uppercase tracking-wider">
                      Status
                    </th>
                    {isAdmin && (
                      <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Aksi</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-natural-border bg-white">
                  {filteredTransactions.map((tx) => {
                    const book = books.find(b => b.id === tx.bookId);
                    const member = members.find(m => m.id === tx.memberId);
                    return (
                      <tr key={tx.id} className="hover:bg-natural-bg/50 transition-colors">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 text-left">
                           <div className="font-bold text-text-title">{book?.title}</div>
                           <div className="text-text-muted text-xs mt-0.5">ISBN: {book?.isbn}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-left">
                          <div className="font-bold text-text-title">{member?.name}</div>
                          <div className="text-text-muted text-xs font-mono mt-0.5">{member?.studentId}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-text-muted text-left font-medium">
                          {tx.borrowDate}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-text-muted text-left font-medium">
                          {tx.returnDate || '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-left">
                          <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${
                            tx.status === 'Returned'
                              ? 'bg-natural-bg text-primary border border-natural-border'
                              : tx.status === 'Overdue' 
                                ? 'bg-[#F1E9EA] text-red-600 border border-red-100'
                                : tx.status === 'Pending'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                  : 'bg-[#F5F1E9] text-yellow-700 border border-yellow-200/60'
                          }`}>
                            {tx.status === 'Returned' ? 'Selesai' : tx.status === 'Overdue' ? 'Terlambat' : tx.status === 'Pending' ? 'Siap Diambil' : 'Dipinjam'}
                          </span>
                          {tx.status === 'Pending' && tx.bookingCode && (
                            <div className="mt-1 text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded inline-block">KODE: {tx.bookingCode}</div>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            {(tx.status === 'Borrowed' || tx.status === 'Overdue') ? (
                              <button 
                                onClick={() => {
                                  if(confirm(`Konfirmasi pengembalian buku "${book?.title}"?`)) {
                                    returnBook(tx.id);
                                  }
                                }}
                                className="text-primary hover:text-opacity-80 font-bold underline underline-offset-4"
                              >
                                Kembalikan<span className="sr-only">, {tx.id}</span>
                              </button>
                            ) : tx.status === 'Returned' ? (
                              <span className="text-text-lighter italic">Selesai</span>
                            ) : (
                              <span className="text-text-lighter">-</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {isModalOpen && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-natural-border animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-8 py-6 border-b border-natural-border bg-natural-bg/30">
                <h3 className="text-xl font-black text-text-title tracking-tight">Entri Peminjaman Baru</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-natural-border rounded-full transition-colors text-text-muted"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-2 px-1">Pilih Anggota</label>
                    <select required value={form.memberId} onChange={e => setForm({...form, memberId: e.target.value})} className="block w-full rounded-2xl bg-natural-panel border-none py-3.5 px-5 text-text-main text-sm focus:ring-2 focus:ring-primary shadow-inner outline-none appearance-none">
                      <option value="" disabled>-- Pilih Mahasiswa --</option>
                      {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.studentId})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-light uppercase tracking-[0.2em] mb-2 px-1">Pilih Buku Tersedia</label>
                    <select required value={form.bookId} onChange={e => setForm({...form, bookId: e.target.value})} className="block w-full rounded-2xl bg-natural-panel border-none py-3.5 px-5 text-text-main text-sm focus:ring-2 focus:ring-primary shadow-inner outline-none appearance-none">
                      <option value="" disabled>-- Pilih Buku --</option>
                      {availableBooks.map(b => <option key={b.id} value={b.id}>{b.title} - {b.author}</option>)}
                    </select>
                  </div>
                </div>
                <div className="px-8 py-6 bg-natural-bg/50 border-t border-natural-border flex justify-end gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-text-muted hover:bg-natural-border transition-colors">Batal</button>
                  <button type="submit" disabled={!form.memberId || !form.bookId} className="px-6 py-3 rounded-xl text-sm font-black bg-primary text-white hover:shadow-[0_8px_20px_rgba(59,65,112,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">Proses Peminjaman</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Pengembalian Cepat */}
        {isReturnModalOpen && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-natural-border animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between px-8 py-6 border-b border-natural-border bg-primary text-white shrink-0">
                <div>
                  <h3 className="text-xl font-black tracking-tight">Proses Pengembalian</h3>
                  <p className="text-white/70 text-xs mt-1">Daftar buku yang saat ini sedang dipinjam.</p>
                </div>
                <button onClick={() => setIsReturnModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                {transactions.filter(t => t.status === 'Borrowed' || t.status === 'Overdue').length > 0 ? (
                  <div className="space-y-3">
                    {transactions
                      .filter(t => t.status === 'Borrowed' || t.status === 'Overdue')
                      .map(tx => {
                        const book = books.find(b => b.id === tx.bookId);
                        const member = members.find(m => m.id === tx.memberId);
                        return (
                          <div key={tx.id} className="p-4 rounded-[24px] bg-natural-panel border border-natural-border flex items-center justify-between group hover:border-primary/30 transition-all">
                            <div className="flex-1 min-w-0 pr-4">
                              <p className="font-bold text-text-title line-clamp-1">{book?.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-text-muted font-bold border border-natural-border">{member?.name}</span>
                                <span className={`text-[10px] font-black uppercase tracking-wider ${tx.status === 'Overdue' ? 'text-red-500' : 'text-primary'}`}>
                                  {tx.status === 'Overdue' ? 'Terlambat' : 'Dipinjam'}
                                </span>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                returnBook(tx.id);
                                // if none left, close modal? maybe keep open for batch returns
                              }}
                              className="bg-white text-primary hover:bg-primary hover:text-white border border-primary/20 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm"
                            >
                              Kembalikan
                            </button>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-text-muted font-medium italic">Tidak ada buku yang sedang dipinjam saat ini.</p>
                  </div>
                )}
              </div>
              
              <div className="px-8 py-6 bg-natural-bg/50 border-t border-natural-border shrink-0">
                <button onClick={() => setIsReturnModalOpen(false)} className="w-full py-4 rounded-2xl text-sm font-black bg-primary text-white hover:shadow-lg transition-all">Selesai</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
