"use client";
import React, { useState, useRef } from 'react';
import { 
  Loader2, Sparkles, Map, ArrowRight, Plane, 
  RefreshCw, Smartphone, FileText, X, Check, 
  ArrowLeft, Send, MessageSquare, MapPin,
  Download, Calendar, Users, DollarSign
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from "react-hot-toast";
import { useCreateInquiryMutation } from "@/features/inquiry/inquiryApi";
import { useGenerateItineraryMutation } from "@/features/itinerary/itineraryApi"; // ← your RTK hook
import { useGetCategoriesQuery } from '@/features/category/categoryApi';

// ─────────────────────────────────────────────────────────────────────────────
// PDF DOWNLOAD UTILITY
// ─────────────────────────────────────────────────────────────────────────────
const downloadItineraryAsPDF = async (itineraryRef, tripMeta) => {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  const element = itineraryRef.current;
  if (!element) return;

  toast.loading('Preparing your PDF...', { id: 'pdf-gen' });

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth  = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin     = 12;
    const usableWidth = pageWidth - margin * 2;

    // Header
    pdf.setFillColor(0, 71, 171);
    pdf.rect(0, 0, pageWidth, 22, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(255, 255, 255);
    pdf.text('AI TRAVEL CONCIERGE', margin, 14);
    const now = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated: ${now}`, pageWidth - margin, 14, { align: 'right' });

    // Chips
    let chipX = margin;
    const chips = [
      { label: `${tripMeta.days} Days`, bg: [239,246,255], text: [0,71,171] },
      { label: tripMeta.travelers,      bg: [240,253,244], text: [21,128,61] },
      { label: tripMeta.budget,         bg: [255,251,235], text: [146,64,14] },
      ...tripMeta.interests.slice(0,3).map(i => ({ label: i, bg: [248,250,252], text: [100,116,139] }))
    ];
    pdf.setFontSize(7.5);
    chips.forEach(chip => {
      const tw = pdf.getTextWidth(chip.label) + 6;
      pdf.setFillColor(...chip.bg);
      pdf.roundedRect(chipX, 25, tw, 7, 2, 2, 'F');
      pdf.setTextColor(...chip.text);
      pdf.setFont('helvetica', 'bold');
      pdf.text(chip.label, chipX + 3, 30);
      chipX += tw + 3;
    });
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.3);
    pdf.line(margin, 40, pageWidth - margin, 40);

    // Paginated image
    const imgWidth  = usableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let remaining = imgHeight, srcY = 0, isFirst = true;

    while (remaining > 0) {
      const sliceH   = Math.min(remaining, isFirst ? pageHeight - 54 : pageHeight - 20);
      const srcYpx   = (srcY / imgHeight) * canvas.height;
      const sliceHpx = (sliceH / imgHeight) * canvas.height;
      const sc = document.createElement('canvas');
      sc.width = canvas.width; sc.height = Math.ceil(sliceHpx);
      sc.getContext('2d').drawImage(canvas, 0, -Math.floor(srcYpx));
      pdf.addImage(sc.toDataURL('image/png'), 'PNG', margin, isFirst ? 44 : 10, imgWidth, sliceH);
      srcY += sliceH; remaining -= sliceH;
      if (remaining > 0) { pdf.addPage(); isFirst = false; }
    }

    // Footer
    const total = pdf.internal.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      pdf.setPage(p);
      pdf.setFillColor(248, 250, 252);
      pdf.rect(0, pageHeight - 10, pageWidth, 10, 'F');
      pdf.setFontSize(7); pdf.setTextColor(148, 163, 184); pdf.setFont('helvetica', 'normal');
      pdf.text('Dubai AI Travel Concierge  •  Custom Itinerary', margin, pageHeight - 4);
      pdf.text(`Page ${p} of ${total}`, pageWidth - margin, pageHeight - 4, { align: 'right' });
    }

    pdf.save(`Dubai-${tripMeta.days}Day-${tripMeta.travelers}-Itinerary.pdf`);
    toast.success('PDF downloaded!', { id: 'pdf-gen' });
  } catch (err) {
    console.error(err);
    toast.error('PDF generation failed. Try again.', { id: 'pdf-gen' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// INQUIRY MODAL
// ─────────────────────────────────────────────────────────────────────────────
const InquiryModal = ({ isOpen, onClose, selectedTour }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createInquiry] = useCreateInquiryMutation();
  const [formData, setFormData] = useState({ adults: 2, kids: 0, requirement: '', name: '', email: '', phone: '' });

  React.useEffect(() => { if (isOpen) { setStep(1); setIsSuccess(false); } }, [isOpen]);
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.email.includes("@")) { toast.error("Enter valid email ❌"); return; }
    if (formData.phone.length < 8)     { toast.error("Enter valid phone number 📱"); return; }
    const payload = {
      tourId: selectedTour?._id || null,
      tourName: selectedTour?.name || "AI Custom Itinerary",
      ...formData,
      requirement: `[AI PLANNER TRIP: ${selectedTour?.name}] ${formData.requirement}`
    };
    try {
      setIsSubmitting(true);
      await createInquiry(payload).unwrap();
      toast.success("Inquiry submitted successfully 🚀");
      setIsSuccess(true);
      setFormData({ adults: 2, kids: 0, requirement: "", name: "", email: "", phone: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong ❌");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col border border-white/20">
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{isSuccess ? 'Confirmed' : 'Quote Request'}</h2>
            <button onClick={onClose} className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"><X className="w-5 h-5" /></button>
          </div>
          {!isSuccess && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-[#0047AB] transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Step {step} of 2</span>
            </div>
          )}
        </div>
        <div className="px-8 pb-4">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-white">
                <Check className="w-10 h-10 text-[#25D366]" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Request Sent!</h3>
              <p className="text-slate-500 text-sm mb-8">Our experts will contact you via WhatsApp or email very soon.</p>
              <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-[#0047AB] transition-all uppercase tracking-widest text-[10px]">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} id="inquiry-form">
              {step === 1 ? (
                <div>
                  <div className="bg-[#F8FAFC] rounded-3xl p-5 mb-6 border border-slate-100 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#0047AB] flex items-center justify-center shrink-0 shadow-md">
                      <Sparkles className="text-white w-8 h-8" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-black text-slate-900 leading-tight mb-1 truncate">{selectedTour?.name}</h3>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <MapPin className="w-3 h-3 text-slate-300" /> Dubai AI Trip
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[['adults', 1], ['kids', 0]].map(([field, min]) => (
                        <div key={field} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 text-center capitalize">{field}</span>
                          <div className="flex items-center justify-between">
                            <button type="button" onClick={() => setFormData({...formData, [field]: Math.max(min, formData[field] - 1)})} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold shadow-sm">-</button>
                            <span className="font-black text-slate-900">{formData[field]}</span>
                            <button type="button" onClick={() => setFormData({...formData, [field]: formData[field] + 1})} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold shadow-sm">+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                      <textarea value={formData.requirement} onChange={(e) => setFormData({...formData, requirement: e.target.value})}
                        placeholder="Add special requests..."
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-3xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] h-28 resize-none" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[['text','Full Name','name'],['tel','WhatsApp Number','phone'],['email','Email Address','email']].map(([type, placeholder, field]) => (
                    <input key={field} type={type} required placeholder={placeholder}
                      value={formData[field]} onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-[#0047AB]" />
                  ))}
                </div>
              )}
            </form>
          )}
        </div>
        {!isSuccess && (
          <div className="px-8 pb-8">
            {step === 1 ? (
              <button type="button" onClick={() => setStep(2)} className="w-full py-4 bg-[#0047AB] text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase text-[12px] tracking-widest active:scale-95 transition-all">
                CONTINUE <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><ArrowLeft className="w-5 h-5" /></button>
                <button type="submit" form="inquiry-form" disabled={isSubmitting} className="flex-1 py-4 bg-[#0047AB] text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase text-[12px] tracking-widest">
                  {isSubmitting ? 'SENDING...' : 'SEND QUOTE REQUEST'} <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LOADING MESSAGES — cycles while Gemini is thinking
// ─────────────────────────────────────────────────────────────────────────────
const LOADING_MESSAGES = [
  "Curating your luxury experience...",
  "Finding hidden gems in Dubai...",
  "Matching your interests with top spots...",
  "Building a world-class itinerary...",
  "Almost ready — adding final touches...",
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TRIP PLANNER
// ─────────────────────────────────────────────────────────────────────────────
const TripPlanner = () => {
  const [itinerary, setItinerary]     = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const itineraryContentRef = useRef(null);
  const loadingIntervalRef  = useRef(null);

  // ── Real Gemini via your RTK mutation ─────────────────────────────────────
  const [generateItinerary, { isLoading }] = useGenerateItineraryMutation();

  const [formData, setFormData] = useState({
    days: 4, budget: 'Medium', interests: [], travelers: 'Couple'
  });

  // Cycle loading messages while API call is running
  React.useEffect(() => {
    if (isLoading) {
      setLoadingMsgIdx(0);
      loadingIntervalRef.current = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 2200);
    } else {
      clearInterval(loadingIntervalRef.current);
    }
    return () => clearInterval(loadingIntervalRef.current);
  }, [isLoading]);

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // ── SUBMIT → calls /itinerary/generate → Gemini → markdown back ──────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.interests.length === 0) {
      toast.error("Please select at least one interest!");
      return;
    }
    try {
      // Sends: { days, budget, travelers, interests }
      // Receives: { success: true, itinerary: "...markdown..." }
      const result = await generateItinerary({
        days:      formData.days,
        budget:    formData.budget,
        travelers: formData.travelers,
        interests: formData.interests,
      }).unwrap();

      setItinerary(result.itinerary);

      // Scroll to results after render
      setTimeout(() => {
        itineraryContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to generate itinerary. Please try again.");
    }
  };

  // const handleDownloadPDF = async () => {
  //   setIsPdfLoading(true);
  //   await downloadItineraryAsPDF(itineraryContentRef, {
  //     days:      formData.days,
  //     budget:    formData.budget,
  //     travelers: formData.travelers,
  //     interests: formData.interests,
  //   });
  //   setIsPdfLoading(false);
  // };

   const { data, isLoadings, isError, error } = useGetCategoriesQuery({
  page: 1,
  limit: 50,
});

const categories = data?.data ?? [];

const interestOptions = categories.map((cat) => cat.name);
  return (
    <div className="bg-white py-12 md:py-20 px-4 sm:px-6 lg:px-8 min-h-screen font-sans">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0047AB] font-bold text-xs mb-6 shadow-sm uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-[#FFB800]" /> AI Travel Concierge
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Design Your <span className="text-[#0047AB]">Dream Trip</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Tell us your style, and our AI will instantly build a day-by-day plan optimized for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Left: Form ── */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#0047AB] via-[#22C55E] to-[#FFB800]" />
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0047AB]">
                    <Plane className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-none">Trip Details</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Customize Experience</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* Duration */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center justify-between">
                      <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Duration</span>
                      <span className="text-[#0047AB] bg-blue-50 px-3 py-1 rounded-lg font-black">{formData.days} Days</span>
                    </label>
                    <input type="range" min="1" max="14" value={formData.days}
                      onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none accent-[#0047AB]" />
                    <div className="flex justify-between text-[10px] text-slate-300 font-bold">
                      <span>1 Day</span><span>14 Days</span>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Budget
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Budget', 'Medium', 'High', 'Luxury'].map(opt => (
                        <button key={opt} type="button" onClick={() => setFormData({...formData, budget: opt})}
                          className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all ${formData.budget === opt ? 'bg-[#0047AB] text-white border-[#0047AB] shadow-md' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Travelers */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> Travelers
                    </label>
                    <select value={formData.travelers} onChange={(e) => setFormData({...formData, travelers: e.target.value})}
                      className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-[#0047AB] transition-all">
                      <option value="Solo">Solo Explorer</option>
                      <option value="Couple">Couple</option>
                      <option value="Family">Family</option>
                      <option value="Friends">Friends Group</option>
                    </select>
                  </div>

                  {/* Interests */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-900 uppercase tracking-widest">
                      Interests{' '}
                      {formData.interests.length > 0 && (
                        <span className="text-[#22C55E] ml-1 normal-case font-black">({formData.interests.length} selected)</span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map(interest => (
                        <button key={interest} type="button" onClick={() => handleInterestToggle(interest)}
                          className={`px-4 py-2 text-[11px] font-bold rounded-xl border transition-all ${formData.interests.includes(interest) ? 'bg-[#22C55E] text-white border-[#22C55E] shadow-sm' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading}
                    className="w-full flex items-center justify-center py-5 px-6 rounded-2xl shadow-xl text-sm font-black text-white bg-[#22C55E] hover:bg-green-600 disabled:opacity-70 transition-all active:scale-95 group">
                    {isLoading
                      ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Thinking...</>
                      : <>Generate Itinerary <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ── Right: Results ── */}
          <div className="lg:col-span-8">
            <div className="bg-slate-50/50 rounded-[40px] border border-slate-100 min-h-[44rem] p-8 lg:p-12 flex flex-col">

              {isLoading ? (
                /* ── Loading state ── */
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 relative mb-8">
                    <div className="absolute inset-0 border-4 border-[#0047AB] rounded-full border-t-transparent animate-spin" />
                    <div className="absolute inset-0 border-4 border-[#FFB800]/30 rounded-full border-b-transparent animate-spin"
                      style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    <Sparkles className="absolute inset-0 m-auto text-[#FFB800] w-10 h-10 animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-3">Curating Your Trip</h3>
                  <p className="text-slate-500 font-medium min-h-[1.5rem] transition-all duration-500">
                    {LOADING_MESSAGES[loadingMsgIdx]}
                  </p>
                  {/* Selected preferences */}
                  <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {[`${formData.days} Days`, formData.travelers, formData.budget, ...formData.interests].map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-400 shadow-sm animate-pulse">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              ) : itinerary ? (
                /* ── Itinerary result ── */
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-8 border-b border-slate-200 gap-6">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Your Itinerary</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { icon: <Calendar className="w-3 h-3" />,   label: `${formData.days} Days` },
                          { icon: <Users className="w-3 h-3" />,      label: formData.travelers      },
                          { icon: <DollarSign className="w-3 h-3" />, label: formData.budget         },
                        ].map(({ icon, label }) => (
                          <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider shadow-sm">
                            {icon} {label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* <button onClick={handleDownloadPDF} disabled={isPdfLoading}
                        className="flex items-center gap-2 text-xs font-black text-white bg-[#0047AB] px-5 py-3 rounded-xl shadow-md hover:bg-blue-800 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                        {isPdfLoading
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                          : <><Download className="w-4 h-4" /> Save PDF</>}
                      </button> */}
                      <button onClick={() => setItinerary(null)}
                        className="flex items-center text-xs font-black text-slate-400 hover:text-[#0047AB] px-5 py-3 rounded-xl bg-white border border-slate-100 shadow-sm transition-all">
                        <RefreshCw className="w-4 h-4 mr-2" /> Reset
                      </button>
                    </div>
                  </div>

                  {/* ── Captured for PDF ── */}
                  <div ref={itineraryContentRef} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#0047AB] rounded-xl flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest">AI Travel Concierge</p>
                          <p className="text-[10px] text-slate-400 font-medium">Dubai Custom Itinerary</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-wider">{formData.days} Days • {formData.travelers}</p>
                        <p className="text-[10px] text-slate-400">{formData.budget} Budget</p>
                      </div>
                    </div>

                    {/* Gemini markdown output */}
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-strong:text-[#0047AB] prose-li:marker:text-[#22C55E]">
                      <ReactMarkdown>{itinerary}</ReactMarkdown>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-10 p-8 bg-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-100 shadow-2xl">
                    <div className="text-center md:text-left">
                      <h4 className="font-black text-slate-900 text-2xl mb-1">Love this plan?</h4>
                      <p className="text-slate-500 font-medium">Get a final quote for this exact itinerary.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      <a href="https://wa.me/971501902213" target="_blank" rel="noreferrer"
                        className="w-full md:w-auto bg-[#22C55E] text-white font-black py-4 px-8 rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 transition-all">
                        <Smartphone className="w-5 h-5 mr-3" /> WhatsApp
                      </a>
                      <button onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto bg-slate-900 text-white font-black py-4 px-8 rounded-2xl shadow-lg flex items-center justify-center hover:bg-[#0047AB] hover:scale-105 transition-all">
                        <FileText className="w-5 h-5 mr-3" /> Official Quote
                      </button>
                    </div>
                  </div>
                </div>

              ) : (
                /* ── Empty state ── */
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4 space-y-6">
                  <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center">
                    <Map className="w-12 h-12 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Ready to Plan?</h3>
                    <p className="text-slate-400 font-medium">
                      Configure your trip on the left and hit{' '}
                      <span className="text-[#22C55E] font-black">Generate Itinerary</span>.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 opacity-40">
                    {['Shopping', 'Desert', 'Luxury', 'Foodie'].map(t => (
                      <span key={t} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-400">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTour={{
          name: `${formData.days} Day AI Custom Trip (${formData.budget} Budget)`,
          _id: 'AI_CUSTOM_PLAN'
        }}
      />
    </div>
  );
};

export default TripPlanner;