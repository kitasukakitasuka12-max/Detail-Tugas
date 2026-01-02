
import React, { useState, useRef } from 'react';
import { 
  PlusCircle, 
  Image as ImageIcon, 
  FileText, 
  Search,
  User,
  Menu,
  MoreHorizontal,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { JobType, TaskData } from './types';
import { formatIDR } from './utils/formatters';

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
    
    // Simulasi proses render data
    setTimeout(() => {
      const price = parseFloat(priceInput);
      const newData: TaskData = {
        phoneNumber,
        jobType,
        productPrice: price,
        generatedAt: new Date().toLocaleString('id-ID', { 
          dateStyle: 'medium', 
          timeStyle: 'short' 
        }),
      };
      
      setGeneratedData(newData);
      setIsGenerating(false);
      
      // Scroll halus ke area pratinjau
      setTimeout(() => {
        const previewElement = document.getElementById('preview-section');
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 800);
  };

  const downloadImage = async () => {
    if (resultRef.current === null) return;
    
    const originalWidth = resultRef.current.style.width;
    resultRef.current.style.width = '1200px';

    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      const dataUrl = await toPng(resultRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: '#000000',
      });

      const link = document.createElement('a');
      link.download = `GUCCI_TASK_${phoneNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('Gagal merender gambar.');
    } finally {
      resultRef.current.style.width = originalWidth;
    }
  };

  const downloadPDF = async () => {
    if (resultRef.current === null) return;

    const originalWidth = resultRef.current.style.width;
    resultRef.current.style.width = '1200px';

    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      const dataUrl = await toPng(resultRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: '#000000',
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1200, 900]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, 1200, 900);
      pdf.save(`GUCCI_TASK_DETAIL_${phoneNumber}.pdf`);
    } catch (err) {
      alert('Gagal merender PDF.');
    } finally {
      resultRef.current.style.width = originalWidth;
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans p-4 md:p-8">
      {/* BAGIAN INPUT */}
      <section className="max-w-4xl mx-auto mb-16 bg-[#0a0a0a] p-8 rounded-3xl border border-zinc-800 shadow-2xl no-print">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-purple-600 p-2 rounded-lg">
            <PlusCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold font-poppins text-white">Input Data Tugas</h2>
        </div>
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Nomor Telepon</label>
            <input
              type="text"
              required
              placeholder="08123456789"
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 focus:border-purple-500 outline-none transition-all text-sm"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Jenis Tugas</label>
            <select
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 focus:border-blue-500 outline-none appearance-none cursor-pointer text-sm"
              value={jobType}
              onChange={(e) => setJobType(e.target.value as JobType)}
            >
              <option value={JobType.SINGLE}>1 Pesanan - 1 Produk</option>
              <option value={JobType.TRIPLE}>1 Pesanan - 3 Produk</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Harga Produk</label>
            <input
              type="number"
              required
              placeholder="Rp..."
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 focus:border-green-500 outline-none text-sm"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
            />
          </div>
          <div className="md:col-span-3 pt-4">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-white hover:bg-zinc-200 text-black font-black py-4 rounded-xl transition-all tracking-[0.2em] text-xs uppercase shadow-lg active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isGenerating ? 'MENGOLAH DATA...' : (
                <>
                  <Eye className="w-4 h-4" />
                  GENERATE & LIHAT HASIL
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* HASIL PRATINJAU */}
      {generatedData && (
        <div id="preview-section" className="max-w-[1250px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* LABEL PRATINJAU */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 no-print">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-poppins">Pratinjau Hasil</h3>
                <p className="text-zinc-500 text-sm">Silakan tinjau data di bawah ini sebelum mendownload.</p>
              </div>
            </div>
          </div>

          {/* AREA DOKUMEN YANG AKAN DI-RENDER */}
          <div className="relative group">
            {/* Scrollable container untuk mobile agar pratinjau tidak terpotong saat dilihat di layar kecil */}
            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <div 
                ref={resultRef} 
                className="bg-black p-10 md:p-14 rounded-sm min-w-[1000px] lg:min-w-0"
              >
                {/* HEADER */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-14 gap-8">
                  <div>
                    <h1 className="text-[42px] font-poppins font-bold tracking-tight text-white leading-none mb-1 uppercase">
                      DETAIL TUGAS PEKERJAAN
                    </h1>
                    <p className="text-[19px] font-bold text-zinc-200 tracking-wider uppercase">
                      GUCCI INDONESIA BUSINESS
                    </p>
                  </div>
                  <div className="flex items-center gap-5 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-[450px]">
                      <input 
                        type="text" 
                        placeholder="Detail tugas..." 
                        className="w-full bg-[#0d0d0d] border border-zinc-800 rounded-lg py-3.5 px-6 text-zinc-600 text-lg outline-none pr-14"
                        readOnly
                      />
                      <Search className="absolute right-5 top-4 w-6 h-6 text-zinc-600" />
                    </div>
                    <div className="w-14 h-14 bg-[#0d0d0d] rounded-full flex items-center justify-center border border-zinc-800">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-700">
                      <Menu className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </header>

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12">
                  
                  <div className="space-y-12">
                    {/* ACCOUNT CARD */}
                    <div className="bg-[#0a0a0a] p-10 rounded-[2rem] border border-zinc-900/50 shadow-2xl">
                      <div className="flex justify-between items-center mb-12">
                        <h3 className="text-3xl font-poppins font-semibold text-white">Account</h3>
                        <MoreHorizontal className="text-white w-9 h-9" />
                      </div>
                      
                      <div className="flex flex-col xl:flex-row gap-6 items-stretch mb-12">
                        <div className="flex-1 bg-gradient-to-r from-[#111] to-[#0d211f] p-10 rounded-2xl border border-white/[0.03] flex flex-col justify-center gap-4">
                          <div className="grid grid-cols-[160px_1fr] text-[17px] font-bold">
                            <span className="text-zinc-100 uppercase tracking-widest">ID AKUN</span>
                            <span className="text-zinc-100">: {generatedData.phoneNumber}</span>
                          </div>
                          <div className="grid grid-cols-[160px_1fr] text-[17px] font-bold">
                            <span className="text-zinc-100 uppercase tracking-widest">HARGA PRODUK</span>
                            <span className="text-zinc-100">: {formatIDR(generatedData.productPrice)}</span>
                          </div>
                          <div className="grid grid-cols-[160px_1fr] text-[17px] font-bold">
                            <span className="text-zinc-100 uppercase tracking-widest">KOMISI</span>
                            <span className="text-zinc-100">: 20%-50%</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 bg-gradient-to-r from-[#0d1a29] to-[#0a0a0a] rounded-2xl border border-zinc-900 p-8 flex items-center justify-between gap-4">
                          <div className="text-[14px] font-bold text-zinc-100 uppercase tracking-[0.2em] leading-snug">
                            MASA BERLAKU<br/>TUGAS PESANAN
                          </div>
                          <div className="w-24 h-24 rounded-2xl border-2 border-zinc-800 bg-black flex flex-col items-center justify-center shadow-inner shrink-0">
                            <span className="text-4xl font-black text-white leading-none">60</span>
                            <span className="text-[11px] font-bold text-zinc-500 mt-1.5 uppercase tracking-widest">MENIT</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-center text-[#00e676] text-base font-semibold tracking-widest uppercase">
                        Pastikan sudah sesuai dengan pilihan
                      </p>
                    </div>

                    {/* JOB DETAILS CARD */}
                    <div className="bg-[#0a0a0a] p-10 rounded-[2rem] border border-zinc-900/50 shadow-2xl">
                      <div className="flex justify-between items-center mb-12">
                        <h3 className="text-3xl font-poppins font-semibold text-white">Job Details</h3>
                        <MoreHorizontal className="text-white w-9 h-9" />
                      </div>
                      
                      <div className="space-y-8 border-t border-zinc-900 pt-10">
                        {[
                          { label: "Ketentuan", text: "Pesanan di terbitkan oleh sistem" },
                          { label: "Proses", text: "Sistem akan memproses tugas secara otomatis" },
                          { label: "Tugas", text: generatedData.jobType },
                          { label: "Penyelesaian", text: "Jika pesanan belum selesai, sistem tidak akan mengizinkan penarikan." },
                          { label: "Konfirmasi", text: "kepada mentor jika terdapat kendala dalam penyelesaian tugas." }
                        ].map((row, idx) => (
                          <div key={idx} className="flex items-start gap-6 text-[17px]">
                            <span className="w-36 text-zinc-100 font-bold shrink-0 text-left py-1 text-[15px] uppercase tracking-wider">
                              {row.label}
                            </span>
                            <span className="flex-1 text-zinc-500 font-medium leading-relaxed">{row.text}</span>
                            <span className="text-[#00e676] font-bold shrink-0 ml-4 uppercase text-[15px] tracking-widest">Done</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    {/* PLEASE READ CARD */}
                    <div className="bg-[#0a0a0a] p-10 rounded-[2rem] border border-zinc-900/50 shadow-2xl h-fit">
                      <div className="flex justify-between items-center mb-12">
                        <h3 className="text-[34px] font-poppins font-semibold text-white">Please read</h3>
                        <MoreHorizontal className="text-white w-9 h-9" />
                      </div>
                      
                      <ul className="space-y-8">
                        {[
                          "Detail Tugas ini merupakan bagian yang tidak terpisahkan dari perjanjian antara Pengguna dan Pihak Gucci Sistem.",
                          "Setiap dana yang dikirim oleh Pengguna kepada Pihak Sistem Gucci akan secara otomatis dikonversi menjadi Saldo Akun Kerja milik Pengguna.",
                          "Seluruh proses pelaksanaan tugas dilaksanakan sesuai dengan prosedur dan ketentuan yang berlaku pada Sistem Gucci.",
                          "Dengan melakukan aktivasi tugas, Pengguna menyatakan telah membaca, memahami, dan menyetujui seluruh isi perjanjian, termasuk ketentuan mengenai konversi dana menjadi saldo akun kerja serta mekanisme penyelesaian tugas.",
                          "Dokumen ini berlaku sebagai bukti sah persetujuan antara Pengguna dan Pihak Sistem Gucci tanpa memerlukan tanda tangan tertulis."
                        ].map((point, i) => (
                          <li key={i} className="flex items-start gap-5">
                            <div className="w-2 h-2 bg-zinc-400 rounded-full mt-2.5 shrink-0"></div>
                            <p className="text-zinc-400 text-[17px] leading-relaxed font-normal">
                              {point}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* ATTENTION CARD */}
                    <div className="bg-gradient-to-br from-[#1a1c3d] via-[#0a0a0a] to-[#0d211f] p-12 rounded-[2rem] border border-zinc-800/50 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] relative min-h-[280px] flex flex-col justify-center">
                      <div className="absolute top-8 right-8">
                        <MoreHorizontal className="text-white w-9 h-9 opacity-30" />
                      </div>
                      <h3 className="text-[34px] font-poppins font-semibold text-white mb-8">Attention</h3>
                      <div className="space-y-4">
                        <p className="text-zinc-100 text-[18px] leading-relaxed italic font-medium opacity-90">
                          Pengguna hanya perlu menunggu selama 5 menit didalam akun kerja Sistem akan menyelesaikan tugas secara otomatis.
                        </p>
                        <p className="text-zinc-100 text-[18px] leading-relaxed italic font-bold opacity-95">
                          Jika ada kendala harap berkonsultasi dengan mentor
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-24 pt-10 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] font-mono text-zinc-800 uppercase tracking-[0.6em]">
                  <span>Issued: {generatedData.generatedAt}</span>
                  <span>Secure Document &bull; GUCCI-ID-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* TOMBOL AKSI */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pb-24 no-print px-4">
            <button
              onClick={downloadImage}
              className="bg-[#111] border border-zinc-800 hover:border-purple-500 hover:bg-[#1a1a1a] text-white py-5 px-14 rounded-2xl transition-all flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-[0.98]"
            >
              <ImageIcon className="w-5 h-5 text-purple-500" />
              DOWNLOAD IMAGE
            </button>
            <button
              onClick={downloadPDF}
              className="bg-[#111] border border-zinc-800 hover:border-blue-500 hover:bg-[#1a1a1a] text-white py-5 px-14 rounded-2xl transition-all flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-[0.98]"
            >
              <FileText className="w-5 h-5 text-blue-500" />
              SIMPAN PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
