// App.tsx
import React, { useState, useRef } from "react";
import {
  PlusCircle,
  Image as ImageIcon,
  FileText,
  Search,
  User,
  Menu,
  MoreHorizontal,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { JobType, TaskData } from "./types";
import { formatIDR } from "./utils/formatters";

const App: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [jobType, setJobType] = useState<JobType>(JobType.SINGLE);
  const [priceInput, setPriceInput] = useState("");
  const [generatedData, setGeneratedData] = useState<TaskData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !priceInput) return;

    setIsGenerating(true);
    setTimeout(() => {
      const price = parseFloat(priceInput);
      const newData: TaskData = {
        phoneNumber,
        jobType,
        productPrice: price,
        generatedAt: new Date().toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      };
      setGeneratedData(newData);
      setIsGenerating(false);
    }, 800);
  };

  // --- ukuran tetap desktop 1440 x 900 px ---
  const fixedWidth = 1440;
  const fixedHeight = 900;

  const downloadImage = async () => {
    if (!resultRef.current) return;
    const original = resultRef.current.style.cssText;
    resultRef.current.style.width = `${fixedWidth}px`;
    resultRef.current.style.height = `${fixedHeight}px`;
    resultRef.current.style.minWidth = `${fixedWidth}px`;

    try {
      await new Promise((r) => setTimeout(r, 200));
      const dataUrl = await toPng(resultRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#000",
        width: fixedWidth,
        height: fixedHeight,
      });
      const link = document.createElement("a");
      link.download = `GUCCI_DESKTOP_TASK_${phoneNumber}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      resultRef.current.style.cssText = original;
    }
  };

  const downloadPDF = async () => {
    if (!resultRef.current) return;
    const original = resultRef.current.style.cssText;
    resultRef.current.style.width = `${fixedWidth}px`;
    resultRef.current.style.height = `${fixedHeight}px`;
    try {
      await new Promise((r) => setTimeout(r, 200));
      const dataUrl = await toPng(resultRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#000",
        width: fixedWidth,
        height: fixedHeight,
      });
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [fixedWidth, fixedHeight],
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, fixedWidth, fixedHeight);
      pdf.save(`GUCCI_DESKTOP_PDF_${phoneNumber}.pdf`);
    } finally {
      resultRef.current.style.cssText = original;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c3d] via-[#0a0a0a] text-zinc-100 font-sans p-5 md:p-5">
      {/* FORM INPUT */}
      <section className="max-w-4xl mx-auto mb-16 bg-[#0a0a0a] p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-purple-600 p-2 rounded-lg">
            <PlusCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold font-poppins text-white">
            INPUT DATA TUGAS
          </h2>
        </div>
        <form
          onSubmit={handleGenerate}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
              Nomor Telepon
            </label>
            <input
              type="text"
              required
              placeholder="08123456789"
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-purple-500 outline-none"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
              Jenis Tugas
            </label>
            <select
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-blue-500 outline-none"
              value={jobType}
              onChange={(e) => setJobType(e.target.value as JobType)}
            >
              <option value={JobType.SINGLE}>1 Pesanan - 1 Produk</option>
              <option value={JobType.TRIPLE}>1 Pesanan - 3 Produk</option>
              <option value={JobType.QUAD}>1 Pesanan - 4 Produk</option>
              <option value={JobType.PENTA}>1 Pesanan - 5 Produk</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
              Harga Produk
            </label>
            <input
              type="number"
              required
              placeholder="Rp..."
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:border-green-500 outline-none"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
            />
          </div>
          <div className="md:col-span-3 pt-4">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-white text-black font-black py-4 rounded-xl transition-all tracking-[0.2em] text-xs uppercase shadow-lg flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                "MENGOLAH DATA..."
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  GENERATE & LIHAT HASIL
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* HASIL */}
      {generatedData && (
        <div
          id="preview-section"
          className="max-w-[1440px] mx-auto"
        >
          <div
            ref={resultRef}
            style={{ width: fixedWidth, height: fixedHeight }}
            className="bg-black p-10 rounded-2xl border border-zinc-900/40 shadow-2xl overflow-hidden"
          >
            {/* HEADER */}
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-[38px] font-bold uppercase leading-none mb-1">
                  DETAIL TUGAS PEKERJAAN
                </h1>
                <p className="text-[17px] font-bold uppercase text-zinc-300">
                  GUCCI BUSINESS PROGRAM
                </p>
              </div>
              <div className="flex items-center gap-8">
                <div className="relative w-[400px]">
                  <input
                    type="text"
                    placeholder="Detail tugas..."
                    readOnly
                    className="w-full bg-[#0d0d0d] border border-zinc-800 rounded-lg py-3 px-6 text-zinc-500 pr-12"
                  />
                  <Search className="absolute right-4 top-3.5 w-6 h-6 text-zinc-600" />
                </div>
                <div className="w-12 h-12 bg-[#0d0d0d] rounded-full flex items-center justify-center border border-zinc-800">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-xl flex items-center justify-center border border-zinc-700">
                  <Menu className="w-7 h-7 text-white" />
                </div>
              </div>
            </header>

            {/* GRID */}
            <div className="grid grid-cols-[1.15fr_0.85fr] gap-8">
              {/* KIRI */}
              <div className="space-y-8">
                {/* ACCOUNT */}
                <div className="bg-[#0a0a0a] p-6 rounded-xl border border-zinc-800 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold">Account</h3>
                    <MoreHorizontal className="text-white" />
                  </div>
                  <div className="flex gap-4 mb-8">
                    <div className="flex-1 bg-gradient-to-r from-[#4B0082] to-[#2E8B8B] p-6 rounded-xl border border-white/20 flex flex-col justify-center shadow-md">
  <div className="grid grid-cols-[140px_1fr] gap-x-2 text-white text-[15px] font-semibold tracking-wide">
    <span className="uppercase">ID AKUN</span>
    <span>: {generatedData.phoneNumber}</span>

    <span className="uppercase">HARGA PRODUK</span>
    <span>: {formatIDR(generatedData.productPrice)}</span>

    <span className="uppercase">KOMISI</span>
    <span>: 20%-50%</span>
  </div>
</div>
                    <div className="flex-1 bg-gradient-to-r from-[#0d1a29] to-[#0a0a0a] p-6 rounded-xl border border-zinc-800 flex items-center justify-between">
                      <p className="text-sm uppercase leading-tight">
                        MASA BERLAKU <br /> TUGAS PESANAN
                      </p>
                      <div className="rounded-xl border border-zinc-700 bg-black flex flex-col items-center justify-center w-20 h-16">
                        <span className="text-3xl font-black">60</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                          MENIT
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-green-400 font-semibold uppercase">
                    Pastikan sudah sesuai dengan pilihan
                  </p>
                </div>

                {/* JOB DETAILS */}
                <div className="bg-[#0a0a0a] p-6 rounded-xl border border-zinc-800 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold">Job Details</h3>
                    <MoreHorizontal className="text-white" />
                  </div>
                  <div className="space-y-2 border-t border-zinc-800 pt-4 text-sm">
                    {[
                      ["Ketentuan", "Pesanan diterbitkan oleh sistem"],
                      ["Proses", "Sistem akan memproses tugas otomatis"],
                      ["Tugas", generatedData.jobType],
                      [
                        "Penyelesaian",
                        "Jika pesanan belum selesai, sistem tidak mengizinkan penarikan.",
                      ],
                      [
                        "Konfirmasi",
                        "Hubungi mentor jika terdapat kendala penyelesaian tugas.",
                      ],
                    ].map(([l, v], i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between text-zinc-400"
                      >
                        <p className="w-36 text-zinc-100 font-bold uppercase text-xs">
                          {l}
                        </p>
                        <p className="flex-1 text-sm">{v}</p>
                        <p className="text-green-400 text-xs font-bold uppercase">
                          Done
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KANAN */}
              <div className="space-y-8">
                <div className="bg-[#0a0a0a] p-6 rounded-xl border border-zinc-800 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold">Please Read</h3>
                    <MoreHorizontal className="text-white" />
                  </div>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    <li>Detail Tugas ini merupakan bagian dari perjanjian antara Pengguna dan Pihak Gucci Sistem.</li>
                    <li>Setiap dana yang dikirim oleh Pengguna kepada Pihak Sistem Gruci akan secara otomatis dikonversi menjadi Saldo Akun Kerja milik Pengguna.</li>
                    <li>Seluruh proses pelaksanaan tugas dilaksanakan sesuai dengan prosedur dan ketentuan yang berlaku pada Sistem Gucci.</li>
                    <li>Dengan melakukan aktivasi tugas, Pengguna menyatakan telah membaca, memahami, dan menyetujui seluruh isi perjanjian, termasuk ketentuan mengenai konversi dana menjadi saldo akun kerja serta mekanisme penyelesaian tugas.</li>
                    <li>Dokumen ini berlaku sebagai bukti sah persetujuan antara Pengguna dan Pihak Sistem Gucci tanpa memerlukan tanda tangan tertulis.</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#1a1c3d] via-[#0a0a0a] to-[#0d211f] p-8 rounded-xl border border-zinc-800 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Attention</h3>
                    <MoreHorizontal className="text-white opacity-40" />
                  </div>
                  <p className="text-zinc-100 italic text-sm">
                    Sistem akan menyelesaikan tugas pekerjaan secara otomatis,
                    pengguna hanya perlu menunggu sesuai waktu yang ditentukan.
                  </p>
                </div>
              </div>
            </div>

            <footer className="mt-10 pt-4 border-t border-zinc-800 text-center text-[13px] text-zinc-200 uppercase tracking-widest">
              Issued: {generatedData.generatedAt} • Secure Document •
              GUCCI-ID-{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </footer>
          </div>

          {/* tombol */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
            <button
              onClick={downloadImage}
              className="bg-[#111] border border-zinc-800 hover:border-purple-500 hover:bg-[#1a1a1a] text-white py-4 px-10 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest"
            >
              <ImageIcon className="w-5 h-5 text-purple-500" />
              Download Image (Desktop)
            </button>
            <button
              onClick={downloadPDF}
              className="bg-[#111] border border-zinc-800 hover:border-blue-500 hover:bg-[#1a1a1a] text-white py-4 px-10 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest"
            >
              <FileText className="w-5 h-5 text-blue-500" />
              Simpan PDF (Desktop)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
