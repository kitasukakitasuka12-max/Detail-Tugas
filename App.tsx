
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
  Download
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
    
    // Simulasi loading agar terlihat lebih profesional
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
      
      // Auto-scroll ke hasil
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
        pixelRatio: 3, // Kualitas tinggi
        backgroundColor: '#09090b'
      });
      const link = document.createElement('a');
      link.download = `gucci-job-${phoneNumber}.png`;
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
      pdf.save(`gucci-job-${phoneNumber}.pdf`);
    } catch (err) {
      alert('Gagal mendownload PDF');
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-12 relative overflow-hidden bg-zinc-950">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="max-w-5xl mx-auto w-full mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-poppins font-extrabold tracking-tighter mb-3 gradient-text uppercase italic">
          Detail Tugas Pekerjaan
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-8 bg-zinc-800"></div>
          <p className="text-zinc-500 text-xs md:text-sm font-bold tracking-[0.5em] uppercase">
            Gucci Business Program
          </p>
          <div className="h-px w-8 bg-zinc-800"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Form Section */}
        <section className="glass-card p-8 md:p-10 rounded-[2.5rem] neon-shadow">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-2xl shadow-lg">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold font-poppins">Input Task Baru</h2>
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
                  placeholder="08xxxxxxxxxx"
                  className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all outline-none text-zinc-100 placeholder:text-zinc-700 font-mono"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Jenis Pekerjaan</label>
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
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Harga Produk (IDR)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Wallet className="h-5 w-5 text-zinc-600 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                  type="number"
                  required
                  placeholder="Nominal harga..."
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
                  Memproses Data...
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Generate Task Detail
                </>
              )}
            </button>
          </form>
        </section>

        {/* Display Section */}
        <section className="space-y-8">
          {!generatedData ? (
            <div className="glass-card p-16 rounded-[2.5rem] border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-700 h-full min-h-[500px]">
              <div className="bg-zinc-900/50 p-8 rounded-full mb-8 ring-1 ring-zinc-800/50">
                <FileText className="w-12 h-12 opacity-20" />
              </div>
              <p className="text-center font-medium italic opacity-40 max-w-[200px]">
                Silakan isi data di sebelah kiri untuk melihat hasil tugas.
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
              {/* Hasil Dokumen yang akan didownload */}
              <div ref={resultRef} className="p-10 rounded-[2.5rem] bg-[#09090b] border border-zinc-800 shadow-2xl space-y-8">
                <div className="text-center border-b border-zinc-900 pb-8 mb-2">
                    <h2 className="text-2xl font-poppins font-bold gradient-text tracking-tighter italic">GUCCI BUSINESS PROGRAM</h2>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.5em] mt-3 font-black">Official Verification Result</p>
                </div>

                {/* Account Info */}
                <div className="bg-zinc-900/40 rounded-3xl p-7 border border-zinc-800 shadow-inner">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-4 bg-purple-500 rounded-full"></div>
                    <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Account Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-600 font-medium uppercase tracking-tighter">Phone Number</span>
                      <span className="text-zinc-100 font-mono font-bold text-sm tracking-widest">{generatedData.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-600 font-medium uppercase tracking-tighter">Product Price</span>
                      <span className="text-zinc-200 font-bold">{formatIDR(generatedData.productPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-600 font-medium uppercase tracking-tighter">Commission</span>
                        <span className="bg-purple-500/10 text-purple-500 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/20 font-black">
                            {generatedData.commissionRate}%
                        </span>
                      </div>
                      <span className="text-green-400 font-bold">{formatIDR(generatedData.commissionAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-5 border-t border-zinc-800/50 mt-2">
                      <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">Total Payout</span>
                      <span className="text-blue-400 font-black text-2xl tracking-tighter">{formatIDR(generatedData.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Job Status */}
                <div className="bg-zinc-900/40 rounded-3xl p-7 border border-zinc-800">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                    <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Job Specification</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start text-xs leading-relaxed">
                        <span className="text-zinc-600 font-medium uppercase tracking-tighter w-1/3">Task Type</span>
                        <span className="text-zinc-100 text-right w-2/3 font-semibold">{generatedData.jobType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-zinc-600 font-medium uppercase tracking-tighter">Status</span>
                        <div className="flex items-center gap-2 bg-green-500/5 px-4 py-2 rounded-full border border-green-500/10">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                            <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">Done</span>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Footnotes */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-zinc-900/20 rounded-2xl p-5 border border-zinc-900/50">
                    <div className="flex items-center gap-2 mb-3 text-zinc-500">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Please Read</span>
                    </div>
                    <p className="text-[10px] text-zinc-600 leading-relaxed italic">
                      Dokumen ini diterbitkan oleh sistem Gucci Business Program. Seluruh komisi dihitung secara otomatis dan bersifat final. Harap hubungi admin jika terdapat kendala verifikasi.
                    </p>
                  </div>
                  <div className="bg-red-500/5 rounded-2xl p-5 border border-red-500/10">
                    <div className="flex items-center gap-2 mb-3 text-red-500/70">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Attention</span>
                    </div>
                    <p className="text-[10px] text-red-500/60 leading-relaxed font-medium">
                      KEAMANAN DATA ADALAH PRIORITAS. JANGAN PERNAH MEMBERIKAN TANGKAPAN LAYAR INI KEPADA PIHAK YANG TIDAK BERWENANG.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 text-[9px] text-zinc-800 font-mono font-bold uppercase tracking-widest">
                    <span>Issued: {generatedData.generatedAt}</span>
                    <span className="bg-zinc-900 px-3 py-1 rounded-lg">VERIFIED: G-{(Math.random() * 1000000).toFixed(0)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-5">
                <button
                  onClick={downloadImage}
                  className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 text-zinc-400 hover:text-white py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 group"
                >
                  <ImageIcon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                  <span className="font-bold text-sm uppercase tracking-widest">Save Image</span>
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 text-zinc-400 hover:text-white py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 group"
                >
                  <FileText className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                  <span className="font-bold text-sm uppercase tracking-widest">Save PDF</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-20 pt-10 border-t border-zinc-900 text-center pb-12">
        <p className="text-zinc-700 text-[10px] uppercase tracking-[0.6em] font-black">
          &copy; {new Date().getFullYear()} Gucci Business Development Group &bull; Secure Access Node
        </p>
      </footer>
    </div>
  );
};

export default App;
