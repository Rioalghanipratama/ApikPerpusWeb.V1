import React, { useState } from 'react';
import { Plus, Search, Filter, X, Trash2 } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { useAuth } from '../lib/AuthContext';

export default function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<{ code: string; title: string } | null>(null);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: 'Ilmu Komputer', quantity: 1 });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [notification, setNotification] = useState<string | null>(null);
  const { books, addBook, updateBook, deleteBook, requestBook } = useApp();
  const { currentUser, setIsLoginModalOpen, setIsRegInfoModalOpen } = useAuth();
  
  const isAdmin = currentUser.role === 'admin';
  const isMember = currentUser.role === 'member';
  const isGuest = currentUser.role === 'guest';

  const categories = ['Semua', 'Ilmu Komputer', 'Software Engineering', 'Sistem Informasi', 'Sains', 'Teknologi', 'Sastra', 'Seni & Desain'];

  const handleRequest = (bookId: string) => {
    if (isGuest) {
      setIsRegInfoModalOpen(true);
      return;
    }
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableQuantity <= 0) return;

    if (currentUser.memberId) {
      const code = requestBook(bookId, currentUser.memberId);
      setBookingResult({ code, title: book.title });
    }
  };

  const handleAddClick = () => {
    setEditingBook(null);
    setForm({ title: '', author: '', isbn: '', category: 'Ilmu Komputer', quantity: 1 });
    setIsModalOpen(true);
  };

  const handleEditClick = (book: any) => {
    setEditingBook(book.id);
    setForm({ 
      title: book.title, 
      author: book.author, 
      isbn: book.isbn, 
      category: book.category,
      quantity: book.quantity || 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini dari sistem?')) {
      deleteBook(id);
      setNotification('Buku berhasil dihapus dari sistem.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.title || !form.author) return;
    
    if (editingBook) {
      const existingBook = books.find(b => b.id === editingBook);
      if (existingBook) {
        const borrowedCount = existingBook.quantity - existingBook.availableQuantity;
        const newAvailable = Math.max(0, form.quantity - borrowedCount);
        updateBook(editingBook, { 
          ...form, 
          availableQuantity: newAvailable,
          status: newAvailable > 0 ? 'Available' : 'Borrowed' 
        });
      }
      setNotification('Informasi buku berhasil diperbarui.');
    } else {
      addBook({ ...form, status: 'Available', availableQuantity: form.quantity });
      setNotification(`Buku "${form.title}" berhasil ditambahkan ke katalog.`);
    }
    
    setIsModalOpen(false);
    setEditingBook(null);
    setForm({ title: '', author: '', isbn: '', category: 'Ilmu Komputer', quantity: 1 });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'Semua' || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 relative">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-text-title sm:truncate sm:text-3xl sm:tracking-tight font-serif">
            Katalog Buku
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            {isAdmin ? "Kelola data buku yang tersedia di perpustakaan." : "Jelajahi dan temukan buku yang Anda butuhkan."}
          </p>
        </div>
        {isAdmin && (
          <div className="mt-4 flex sm:ml-4 sm:mt-0">
            <button
              type="button"
              onClick={() => handleAddClick()}
              className="inline-flex items-center gap-x-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:translate-y-[-1px] active:translate-y-[1px] transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              <Plus className="-ml-0.5 h-5 w-5 pointer-events-none" aria-hidden="true" />
              <span>Tambah Buku</span>
            </button>
          </div>
        )}
      </div>

      {notification && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-right duration-300">
          <div className="bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm">{notification}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-natural-border">
        <div className="relative flex-grow max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-4 w-4 text-text-muted" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl bg-natural-panel border-none py-2.5 pl-11 pr-4 text-text-main text-sm focus:ring-2 focus:ring-primary placeholder:text-text-lighter"
            placeholder="Cari judul, penulis, atau ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${selectedCategory !== 'Semua' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-text-title bg-natural-panel hover:bg-natural-hover'}`}
          >
            <Filter className="h-4 w-4" />
            {selectedCategory === 'Semua' ? 'Filter' : selectedCategory}
          </button>
          
          {showFilterDropdown && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setShowFilterDropdown(false)} />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[70] overflow-hidden border border-natural-border animate-in fade-in zoom-in-95 duration-100">
                <div className="py-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowFilterDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-3 text-sm transition-colors ${selectedCategory === cat ? 'bg-primary/10 text-primary font-bold' : 'text-text-main hover:bg-natural-bg'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
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
                      Judul & Penulis
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-text-light uppercase tracking-wider">
                      ISBN
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-text-light uppercase tracking-wider">
                      Kategori
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-text-light uppercase tracking-wider">
                      Stok
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-text-light uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-natural-border bg-white">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-natural-bg/50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 text-left">
                        <div className="flex items-center">
                          <div className="h-10 w-8 flex-shrink-0 bg-natural-panel rounded flex items-center justify-center border border-natural-border">
                            <span className="text-text-muted font-bold text-xs">{book.title.charAt(0)}</span>
                          </div>
                          <div className="sm:ml-4">
                            <div className="font-bold text-text-title">{book.title}</div>
                            <div className="text-text-muted mt-0.5">{book.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-muted text-left font-mono">
                        {book.isbn}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-muted text-left">
                         <span className="inline-flex items-center rounded-md bg-natural-panel px-2.5 py-1 text-xs font-bold text-text-muted border border-natural-border">
                            {book.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-left">
                        <div className="flex flex-col">
                           <span className="font-bold text-text-title">{book.availableQuantity} <span className="text-[10px] text-text-muted font-normal">Sisa</span></span>
                           <span className="text-[10px] text-text-lighter">Total: {book.quantity}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-left">
                        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${
                          book.availableQuantity > 0
                            ? 'bg-natural-bg text-primary border border-natural-border'
                            : 'bg-[#F1E9EA] text-red-600 border border-red-100'
                        }`}>
                          {book.availableQuantity > 0 ? 'Tersedia' : 'Habis'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {isAdmin ? (
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => handleEditClick(book)}
                              className="text-primary hover:text-opacity-80 font-bold underline underline-offset-4"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(book.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Hapus Buku"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : book.availableQuantity > 0 ? (
                          <button 
                            onClick={() => handleRequest(book.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                              isGuest 
                                ? 'bg-natural-bg text-primary border border-primary/20 hover:bg-primary/5' 
                                : 'bg-primary text-white hover:bg-opacity-90'
                            }`}
                          >
                            {isGuest ? 'Ingin Meminjam?' : 'Pinjam'}
                          </button>
                        ) : (
                          <span className="text-text-lighter italic text-xs">Habis</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Booking Success untuk Anggota */}
      {bookingResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden border border-natural-border p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
               <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-text-title mb-2">Booking Berhasil!</h3>
            <p className="text-sm text-text-muted mb-6">Silakan tunjukkan kode berikut ke petugas perpustakaan untuk mengambil buku.</p>
            
            <div className="bg-natural-bg border-2 border-dashed border-primary/20 rounded-2xl p-6 mb-6">
              <p className="text-xs font-bold text-text-light uppercase tracking-widest mb-1">Kode Booking</p>
              <p className="text-4xl font-mono font-black text-primary tracking-tighter">{bookingResult.code}</p>
            </div>

            <div className="text-left bg-natural-panel p-4 rounded-xl mb-6 border border-natural-border">
              <p className="text-[10px] font-bold text-text-light uppercase">Buku yang dipesan:</p>
              <p className="text-sm font-bold text-text-title truncate">{bookingResult.title}</p>
            </div>

            <button 
              onClick={() => setBookingResult(null)}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-natural-border animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-natural-border bg-white">
              <h3 className="text-lg font-bold text-text-title">{editingBook ? 'Edit Informasi Buku' : 'Tambah Buku Baru'}</h3>
              <button onClick={() => { setIsModalOpen(false); setEditingBook(null); }} className="text-text-muted hover:text-text-main p-1"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4 bg-white">
                <div>
                  <label className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Judul Buku</label>
                  <input 
                    type="text" 
                    required 
                    value={form.title} 
                    onChange={e => setForm({...form, title: e.target.value})} 
                    className="block w-full rounded-xl bg-natural-panel border border-natural-border py-2.5 px-4 text-text-main text-sm focus:ring-2 focus:ring-primary outline-none transition-all focus:bg-white" 
                    placeholder="Contoh: Pemrograman React Dasar"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Penulis</label>
                  <input 
                    type="text" 
                    required 
                    value={form.author} 
                    onChange={e => setForm({...form, author: e.target.value})} 
                    className="block w-full rounded-xl bg-natural-panel border border-natural-border py-2.5 px-4 text-text-main text-sm focus:ring-2 focus:ring-primary outline-none transition-all focus:bg-white" 
                    placeholder="Nama penulis..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Total Stok</label>
                    <input 
                      type="number" 
                      min="1"
                      required 
                      value={form.quantity} 
                      onChange={e => setForm({...form, quantity: parseInt(e.target.value) || 1})} 
                      className="block w-full rounded-xl bg-natural-panel border border-natural-border py-2.5 px-4 text-text-main text-sm focus:ring-2 focus:ring-primary outline-none transition-all focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Kategori</label>
                    <select 
                      value={form.category} 
                      onChange={e => setForm({...form, category: e.target.value})} 
                      className="block w-full rounded-xl bg-natural-panel border border-natural-border py-2 px-4 text-text-main text-sm focus:ring-2 focus:ring-primary outline-none h-[42px] appearance-none"
                    >
                      {categories.filter(c => c !== 'Semua').map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">ISBN</label>
                  <input 
                    type="text" 
                    required 
                    value={form.isbn} 
                    onChange={e => setForm({...form, isbn: e.target.value})} 
                    className="block w-full rounded-xl bg-natural-panel border border-natural-border py-2.5 px-4 text-text-main text-sm focus:ring-2 focus:ring-primary outline-none transition-all focus:bg-white font-mono" 
                    placeholder="ISBN-13"
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-natural-bg border-t border-natural-border flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); setEditingBook(null); }} 
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-text-muted hover:bg-natural-border transition-colors outline-none"
                >
                  Batal
                </button>
                <button 
                type="submit" 
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95 outline-none"
              >
                {editingBook ? 'Simpan Perubahan' : 'Tambah Ke Katalog'}
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
