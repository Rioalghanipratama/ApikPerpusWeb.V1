import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, X, ShieldAlert, User, BookOpen, Clock, Calendar } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { useAuth } from '../lib/AuthContext';
import { Member } from '../types';

export default function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [form, setForm] = useState({ name: '', studentId: '', major: '', email: '' });
  const { members, addMember, transactions, books } = useApp();
  const { currentUser } = useAuth();

  const isAdmin = currentUser.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-text-title mb-2">Akses Terbatas</h2>
        <p className="text-text-muted max-w-md">Maaf, halaman ini hanya dapat diakses oleh Admin Perpustakaan (Staf/Pustakawan).</p>
        <Link to="/" className="mt-6 text-primary font-bold underline underline-offset-4">Kembali ke Dashboard</Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.name || !form.studentId) return;
    const joinDate = new Date().toISOString().split('T')[0];
    addMember({ ...form, joinDate });
    setIsModalOpen(false);
    setForm({ name: '', studentId: '', major: '', email: '' });
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-text-title sm:truncate sm:text-3xl sm:tracking-tight font-serif">
            Anggota Perpustakaan
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Kelola data mahasiswa/i yang terdaftar sebagai anggota.
          </p>
        </div>
        <div className="mt-4 flex sm:ml-4 sm:mt-0">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-x-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-opacity-90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Plus className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Tambah Anggota
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-natural-border">
        <div className="relative flex-grow max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-4 w-4 text-text-muted" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl bg-natural-panel border-none py-2.5 pl-11 pr-4 text-text-main text-sm focus:ring-2 focus:ring-primary placeholder:text-text-lighter"
            placeholder="Cari nama, NIM, atau jurusan..."
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
                      Nama & Email
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-text-light uppercase tracking-wider">
                      NIM
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-text-light uppercase tracking-wider">
                      Jurusan
                    </th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-text-light uppercase tracking-wider">
                      Tgl. Bergabung
                    </th>
                    <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-natural-border bg-white">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-natural-bg/50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 text-left">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-accent rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{member.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="font-bold text-text-title">{member.name}</div>
                            <div className="text-text-muted mt-0.5">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-muted text-left">
                        <div className="font-mono text-xs font-medium">{member.studentId}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-muted text-left">
                        {member.major}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-muted text-left">
                        {member.joinDate}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button 
                          onClick={() => setSelectedMember(member)}
                          className="text-primary hover:text-opacity-80 font-bold underline underline-offset-4"
                        >
                          Profil<span className="sr-only">, {member.name}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-natural-border">
              <div className="flex items-center justify-between px-6 py-4 border-b border-natural-border">
                <h3 className="text-lg font-bold text-text-title">Tambah Anggota Baru</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-main"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Nama Lengkap</label>
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="block w-full rounded-xl bg-natural-panel border-none py-2.5 px-4 text-text-main text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Email Institusi</label>
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="block w-full rounded-xl bg-natural-panel border-none py-2.5 px-4 text-text-main text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">NIM</label>
                      <input type="text" required value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} className="block w-full rounded-xl bg-natural-panel border-none py-2.5 px-4 text-text-main text-sm focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-light uppercase tracking-wider mb-2">Jurusan</label>
                      <input type="text" required value={form.major} onChange={e => setForm({...form, major: e.target.value})} className="block w-full rounded-xl bg-natural-panel border-none py-2.5 px-4 text-text-main text-sm focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-natural-bg border-t border-natural-border flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-text-muted hover:bg-natural-border transition-colors">Batal</button>
                  <button type="submit" className="px-4 py-2 rounded-xl text-sm font-bold bg-primary text-white hover:bg-opacity-90 transition-colors">Simpan Anggota</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Profil Anggota */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-primary p-8 text-white relative shrink-0">
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 flex-shrink-0 bg-white/20 rounded-3xl border-4 border-white/20 shadow-inner flex items-center justify-center backdrop-blur-md">
                    <span className="text-white font-black text-3xl">{selectedMember.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tight">{selectedMember.name}</h3>
                    <p className="text-white/80 font-medium">{selectedMember.email}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Member ID: {selectedMember.studentId}</span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                        <Calendar className="w-3.5 h-3.5" />
                        Gabung: {selectedMember.joinDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-natural-panel p-5 rounded-[24px] border border-natural-border">
                    <div className="text-primary mb-3 bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-text-light uppercase tracking-widest mb-1">Jurusan</p>
                    <p className="text-lg font-black text-text-title">{selectedMember.major}</p>
                  </div>
                  <div className="bg-natural-panel p-5 rounded-[24px] border border-natural-border">
                    <div className="text-primary mb-3 bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-text-light uppercase tracking-widest mb-1">Total Pinjaman</p>
                    <p className="text-lg font-black text-text-title">
                      {transactions.filter(t => t.memberId === selectedMember.id).length} Buku
                    </p>
                  </div>
                </div>

                {/* History */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-black text-text-title flex items-center gap-2">
                       <Clock className="w-5 h-5 text-primary" />
                       Riwayat Transaksi
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {transactions.filter(t => t.memberId === selectedMember.id).length > 0 ? (
                      transactions
                        .filter(t => t.memberId === selectedMember.id)
                        .map(tx => {
                          const book = books.find(b => b.id === tx.bookId);
                          return (
                            <div key={tx.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-natural-border hover:border-primary/30 transition-all group">
                              <div className="flex items-center gap-4">
                                <div className="bg-natural-bg p-2.5 rounded-xl group-hover:bg-primary/10 transition-colors">
                                  <BookOpen className="w-5 h-5 text-text-muted group-hover:text-primary" />
                                </div>
                                <div className="text-left">
                                  <p className="font-bold text-text-title line-clamp-1">{book?.title || 'Buku Tidak Ditemukan'}</p>
                                  <p className="text-[10px] text-text-muted font-medium flex items-center gap-1 mt-0.5">
                                    <Calendar className="w-3 h-3" />
                                    {tx.borrowDate}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                tx.status === 'Returned' ? 'bg-green-100 text-green-700' : 
                                tx.status === 'Borrowed' ? 'bg-blue-100 text-blue-700' :
                                tx.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {tx.status}
                              </span>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-natural-border rounded-[32px] bg-natural-panel/50">
                        <BookOpen className="w-12 h-12 text-text-lighter mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-bold text-text-lighter px-8">Belum ada riwayat peminjaman untuk anggota ini.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 bg-natural-bg border-t border-natural-border shrink-0">
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  Tutup Profil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
