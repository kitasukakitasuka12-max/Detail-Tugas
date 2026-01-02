
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
  Wallet
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
      }, 100);
    }, 800);
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
      console.error('Download image error:', err);
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
      console.error('Download PDF error:', err);
    }
  };

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col p-4 md:p-8 bg-zinc-950 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="max-w-6xl mx-auto w-full mb-10 text-center py-6">
        <h1 className="text-4xl md:text-6xl font-poppins font-extrabold tracking-tight mb-2 gradient-text uppercase">
          Detail Tugas Pekerjaan
        </h1>
        <p className="text-zinc-500 text-sm md:text-base font-medium tracking-[0.3em] uppercase">
          Gucci Business Program
        </p>
      </header>

      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Input Form */}
        <div className="glass-card p-6 md:p-10 rounded-3xl border-zinc-800 shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-2xl shadow-lg shadow-purple-500/20">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold font-poppins">Input Data Tugas</h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Nomor Telepon</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nomor telepon"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all outline-none text-zinc-100 placeholder:text-zinc-600"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Jenis Tugas</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <select
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all outline-none text-zinc-100 appearance-none"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as JobType)}
                >
                  <option value={JobType.SINGLE}>{JobType.SINGLE}</option>
                  <option value={JobType.TRIPLE}>{JobType.TRIPLE}</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Harga Produk (Rp)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Wallet className="h-5 w-5 text-zinc-500 group-focus-within:text-green-400 transition-colors" />
                </div>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 150000"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition-all outline-none text-zinc-100 placeholder:text-zinc-600"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-5 px-6 rounded-2xl transition-all shadow-xl hover:shadow-purple-500/30 active:scale-[0.98] flex items-center justify-center gap-3 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Generate Task Detail
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Area */}
        <div className="space-y-6">
          {!generatedData ? (
            <div className="glass-card p-12 rounded-3xl border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 h-full min-h-[450px]">
              <div className="bg-zinc-900/50 p-6 rounded-full mb-6 ring-1 ring-zinc-800">
                <FileText className="w-10 h-10 opacity-30" />
              </div>
              <p className="text-center font-medium italic opacity-50">Data hasil akan muncul di sini<br/>setelah form diisi.</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              {/* Target Image Component */}
              <div ref={resultRef} className="p-8 rounded-3xl bg-[#09090b] shadow-2xl space-y-6 border border-zinc-800">
                <div className="text-center border-b border-zinc-900 pb-6 mb-2">
                    <h1 className="text-2xl font-poppins font-bold gradient-text tracking-tight">GUCCI BUSINESS PROGRAM</h1>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] mt-2 font-bold">Official Business Credentials</p>
                </div>

                {/* Account Section */}
                <div className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Wallet className="w-12 h-12" />
                  </div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1.5 h-4 bg-purple-500 rounded-full"></div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Account Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Phone Number</span>
                      <span className="text-zinc-100 font-mono font-bold text-sm">{generatedData.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Product Price</span>
                      <span className="text-zinc-100 font-bold">{formatIDR(generatedData.productPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">Commission</span>
                        <span className="bg-purple-500/10 text-purple-400 text-[9px] px-2 py-0.5 rounded-full border border-purple-500/20 font-bold">
                            {generatedData.commissionRate}%
                        </span>
                      </div>
                      <span className="text-green-400 font-bold">{formatIDR(generatedData.commissionAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-4 border-t border-zinc-900">
                      <span className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">Total Return</span>
                      <span className="text-blue-400 font-extrabold text-xl">{formatIDR(generatedData.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Job Info Section */}
                <div className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Job Status</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start text-xs leading-relaxed">
                        <span className="text-zinc-500 w-1/3">Type</span>
                        <span className="text-zinc-100 text-right w-2/3 font-medium">{generatedData.jobType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-zinc-500">Status</span>
                        <div className="flex items-center gap-2 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">Done</span>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Clauses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/20 rounded-xl p-4 border border-zinc-900/50">
                    <div className="flex items-center gap-2 mb-2 text-zinc-500">
                      <HelpCircle className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Rules</span>
                    </div>
                    <p className="text-[9px] text-zinc-500 leading-relaxed italic">
                      Dana komisi dihitung sistem. Penarikan hanya dapat dilakukan ke rekening yang terdaftar.
                    </p>
                  </div>
                  <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/10">
                    <div className="flex items-center gap-2 mb-2 text-red-500/70">
                      <AlertTriangle className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Attention</span>
                    </div>
                    <p className="text-[9px] text-red-500/60 leading-relaxed">
                      Kerahasiaan data adalah prioritas. Jangan berbagi dokumen ini kepada pihak asing.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 text-[8px] text-zinc-700 font-mono uppercase tracking-widest">
                    <span>Issued: {generatedData.generatedAt}</span>
                    <span className="bg-zinc-900 px-2 py-0.5 rounded">ID: #{Math.floor(Math.random() * 900000 + 100000)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button
                  onClick={downloadImage}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 group"
                >
                  <ImageIcon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                  <span className="font-bold text-sm uppercase tracking-wider">Save Image</span>
                </button>
                <button
                  onClick={downloadPDF}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 group"
                >
                  <FileText className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                  <span className="font-bold text-sm uppercase tracking-wider">Save PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 pt-8 border-t border-zinc-900 text-center pb-10">
        <p className="text-zinc-600 text-[10px] uppercase tracking-[0.5em] font-bold">
          &copy; {new Date().getFullYear()} Gucci Business Development Group &bull; Secure Protocol V2
        </p>
      </footer>
    </div>
  );
};

export default App;
