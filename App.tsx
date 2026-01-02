
import React, { useState, useRef } from 'react';
import { 
  PlusCircle, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Briefcase,
  Phone,
  Wallet,
  Download,
  ShieldCheck
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { JobType, TaskData } from './types';
import { formatIDR, generateRandomCommission } from './utils/formatters';

const App: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jobType, setJobType] = useState<JobType>(JobType.SINGLE);
  const [priceInput, setPriceInput] = useState('');
  const [generatedData, setGeneratedData] = useState<TaskData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !priceInput) return;

    setIsGenerating(true);
    
    setTimeout(() => {
      const price = parseFloat(priceInput);
      const commissionRate = generateRandomCommission();
      const commissionAmount = price * (commissionRate / 100);
      
      const newData: TaskData = {
        phoneNumber,
        jobType,
        productPrice: price,
        commissionRate,
        commissionAmount,
        totalAmount: price + commissionAmount,
        generatedAt: new Date().toLocaleString('id-ID', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }),
      };
      
      setGeneratedData(newData);
      setIsGenerating(false);
      
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 200);
    }, 1000);
  };

  const downloadImage = async () => {
    if (resultRef.current === null) return;
    try {
      const dataUrl = await toPng(resultRef.current, { 
        cacheBust: true, 
        pixelRatio: 3,
        backgroundColor: '#09090b'
      });
      const link = document.createElement('a');
      link.download = `gucci-task-${phoneNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('Gagal mendownload gambar');
    }
  };

  const downloadPDF = async () => {
    if (resultRef.current === null) return;
    try {
      const dataUrl = await toPng(resultRef.current, { 
        cacheBust: true, 
        pixelRatio: 2, 
        backgroundColor: '#09090b' 
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`gucci-task-${phoneNumber}.pdf`);
    } catch (err) {
      alert('Gagal mendownload PDF');
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-12 relative overflow-hidden bg-zinc-950 font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="max-w-5xl mx-auto w-full mb-12 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-poppins font-extrabold tracking-tighter mb-3 gradient-text uppercase italic">
          DETAIL TUGAS PEKERJAAN
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-8 bg-zinc-800"></div>
          <p className="text-zinc-500 text-xs md:text-sm font-bold tracking-[0.5em] uppercase">
            GUCCI BUSINESS PROGRAM
          </p>
          <div className="h-px w-8 bg-zinc-800"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
        {/* Form Section */}
        <section className="glass-card p-8 md:p-10 rounded-[2.5rem] neon-shadow border-zinc-800/50">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-2xl shadow-lg">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold font-poppins text-white">Buat Tugas Baru</h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nomor Telepon</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-zinc-600 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 08123456789"
                  className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all outline-none text-zinc-100 placeholder:text-zinc-700"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Jenis Tugas</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <select
                  className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all outline-none text-zinc-100 appearance-none cursor-pointer"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as JobType)}
                >
                  <option value={JobType.SINGLE}>{JobType.SINGLE}</option>
                  <option value={JobType.TRIPLE}>{JobType.TRIPLE}</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Harga Produk (Rupiah)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Wallet className="h-5 w-5 text-zinc-600 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                  type="number"
                  required
                  placeholder="Masukkan nominal harga..."
                  className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-green-500/20 focus:border-green-500/40 transition-all outline-none text-zinc-100 placeholder:text-zinc-700"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl hover:shadow-purple-500/20 active:scale-[0.98] flex items-center justify-center gap-3 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                  Membangun Data...
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Generate Sekarang
                </>
              )}
            </button>
          </form>
        </section>

        {/* Result Section */}
        <section className="space-y-8">
          {!generatedData ? (
            <div className="glass-card p-16 rounded-[2.5rem] border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-700 h-full min-h-[500px]">
              <div className="bg-zinc-900/50 p-8 rounded-full mb-8 ring-1 ring-zinc-800/50">
                <FileText className="w-12 h-12 opacity-20" />
              </div>
              <p className="text-center font-medium italic opacity-40 max-w-[200px]">
                Lengkapi form untuk mencetak detail tugas.
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
              {/* Document Result */}
              <div ref={resultRef} className="p-10 rounded-[2.5rem] bg-[#09090b] border border-zinc-800 shadow-2xl space-y-8">
                <div className="text-center border-b border-zinc-900 pb-8 mb-2">
                    <h2 className="text-2xl font-poppins font-bold gradient-text tracking-tighter italic">GUCCI BUSINESS PROGRAM</h2>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.5em] mt-3 font-black">Official Verification Document</p>
                </div>

                {/* Account Details Box */}
                <div className="bg-zinc-900/40 rounded-3xl p-8 border border-zinc-800 shadow-inner">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Account Details</h3>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-purple-500/50" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Nomor Telepon</span>
                      <p className="text-zinc-100 font-bold text-lg">{generatedData.phoneNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Harga Produk</span>
                      <p className="text-zinc-100 font-bold text-lg">{formatIDR(generatedData.productPrice)}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Komisi ({generatedData.commissionRate}%)</span>
                      <p className="text-green-400 font-bold text-lg">{formatIDR(generatedData.commissionAmount)}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Total Pengembalian</span>
                      <p className="text-blue-400 font-black text-2xl">{formatIDR(generatedData.totalAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Job Specification Box (Matching Example Image) */}
                <div className="bg-zinc-900/40 rounded-3xl p-8 border border-zinc-800 overflow-hidden">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Job Specification</h3>
                  </div>
                  
                  <div className="space-y-5">
                    {[
                      { label: "Ketentuan", text: "Pesanan di terbitkan oleh sistem" },
                      { label: "Proses", text: "Sistem akan memproses tugas secara otomatis" },
                      { label: "Tugas", text: generatedData.jobType },
                      { label: "Penyelesaian", text: "Jika pesanan belum selesai, sistem tidak akan mengizinkan penarikan." },
                      { label: "Konfirmasi", text: "kepada mentor jika terdapat kendala dalam penyelesaian tugas." }
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-xs md:text-sm border-b border-zinc-900/50 pb-4 last:border-0 last:pb-0">
                        <span className="w-24 md:w-32 text-zinc-100 font-bold shrink-0">{row.label}</span>
                        <span className="flex-1 text-zinc-500 font-medium leading-relaxed">{row.text}</span>
                        <span className="text-green-500 font-bold shrink-0 ml-2">Done</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footnotes Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/20 rounded-2xl p-6 border border-zinc-900/50">
                    <div className="flex items-center gap-2 mb-3 text-zinc-500">
                      <HelpCircle className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Please Read</span>
                    </div>
                    <p className="text-[10px] text-zinc-600 leading-relaxed italic">
                      Dana komisi dihitung oleh sistem secara akurat. Penarikan hanya dapat diproses setelah status tugas seluruhnya "Done".
                    </p>
                  </div>
                  <div className="bg-red-500/5 rounded-2xl p-6 border border-red-500/10">
                    <div className="flex items-center gap-2 mb-3 text-red-500/70">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Attention</span>
                    </div>
                    <p className="text-[10px] text-red-500/60 leading-relaxed font-bold">
                      DOKUMEN RAHASIA. JANGAN BAGIKAN TANGKAPAN LAYAR INI KEPADA PIHAK KETIGA TANPA IZIN MENTOR ANDA.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 text-[9px] text-zinc-800 font-mono font-bold uppercase tracking-widest">
                    <span>Generated: {generatedData.generatedAt}</span>
                    <span className="bg-zinc-900 px-3 py-1 rounded-lg">SID: #{Math.floor(Math.random() * 999999)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 relative z-10">
                <button
                  onClick={downloadImage}
                  className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 text-zinc-400 hover:text-white py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-lg"
                >
                  <ImageIcon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                  <span className="font-bold text-sm uppercase tracking-widest">Download Image</span>
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 text-zinc-400 hover:text-white py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-lg"
                >
                  <FileText className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                  <span className="font-bold text-sm uppercase tracking-widest">Download PDF</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-20 pt-10 border-t border-zinc-900 text-center pb-12 opacity-50 relative z-10">
        <p className="text-zinc-600 text-[10px] uppercase tracking-[0.6em] font-black">
          &copy; {new Date().getFullYear()} Gucci Business Group &bull; Secure Protocol
        </p>
      </footer>
    </div>
  );
};

export default App;
