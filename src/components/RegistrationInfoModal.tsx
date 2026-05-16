import React from 'react';
import { X, ClipboardIcon, CheckCircle2 } from 'lucide-react';

interface RegistrationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrationInfoModal({ isOpen, onClose }: RegistrationInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header - Fixed */}
        <div className="bg-primary p-6 sm:p-8 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4 mb-2 sm:mb-4">
            <div className="bg-white/20 p-2 sm:p-3 rounded-2xl">
              <ClipboardIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">Prosedur Pendaftaran</h3>
              <p className="text-white/80 text-xs sm:text-sm">Ikuti langkah mudah untuk menjadi anggota resmi.</p>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 mt-1">1</div>
              <div>
                <h4 className="font-bold text-text-title text-base">Siapkan Kartu Identitas</h4>
                <p className="text-sm text-text-muted leading-relaxed">Siapkan KTM (Mahasiswa) atau Kartu Pegawai (Dosen/Staf) sebagai syarat utama pendaftaran.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 mt-1">2</div>
              <div>
                <h4 className="font-bold text-text-title text-base">Kunjungi Meja Sirkulasi</h4>
                <p className="text-sm text-text-muted leading-relaxed">Temui petugas perpustakaan di lantai 1 gedung perpustakaan pusat pada jam operasional (08:00 - 16:00 WIB).</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 mt-1">3</div>
              <div>
                <h4 className="font-bold text-text-title text-base">Pendataan & Pengambilan Foto</h4>
                <p className="text-sm text-text-muted leading-relaxed">Petugas akan mengambil data digital dan foto Anda untuk aktivasi akun sistem perpustakaan.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 mt-1">4</div>
              <div>
                <h4 className="font-bold text-text-title text-base">Akun Aktif Seketika</h4>
                <p className="text-sm text-text-muted leading-relaxed">Setelah divalidasi, Anda akan menerima email aktivasi dan bisa langsung menggunakan fitur booking online.</p>
              </div>
            </div>
          </div>

          <div className="bg-natural-bg p-5 rounded-2xl border border-natural-border flex gap-4 items-center">
            <div className="text-primary bg-white p-2 rounded-xl shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-text-muted leading-relaxed font-medium">
              <span className="text-text-title font-bold block mb-0.5">Keuntungan Menjadi Anggota:</span>
              Peminjaman hingga 3 buku, perpanjangan mandiri, & akses jurnal digital premium.
            </p>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 sm:p-8 bg-natural-bg border-t border-natural-border shrink-0">
          <button 
            onClick={onClose}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            Selesai & Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
