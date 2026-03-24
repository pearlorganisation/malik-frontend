"use client";
import React, { useState, useEffect } from 'react';
import { 
  Loader2, Sparkles, Calendar, DollarSign, 
  Users, Heart, Map, ArrowRight, Plane, 
  RefreshCw, Smartphone, FileText, X, Check, 
  ArrowLeft, Send, MessageSquare, Mail, User, 
  Phone, ShieldCheck, MapPin
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from "react-hot-toast";
import { useCreateInquiryMutation } from "@/features/inquiry/inquiryApi";

// --- INQUIRY MODAL COMPONENT ---
const InquiryModal = ({ isOpen, onClose, selectedTour }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createInquiry] = useCreateInquiryMutation();

  const [formData, setFormData] = useState({
    adults: 2,
    kids: 0,
    requirement: '',
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (isOpen) {
        setStep(1);
        setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.email.includes("@")) {
      toast.error("Enter valid email ❌");
      return;
    }
    if (formData.phone.length < 8) {
      toast.error("Enter valid phone number 📱");
      return;
    }

    const payload = {
      tourId: selectedTour?._id || null,
      tourName: selectedTour?.name || "AI Custom Itinerary",
      ...formData,
      // Adding the itinerary details to the requirement so the admin sees it
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col border border-white/20">
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                {isSuccess ? 'Confirmed' : 'Quote Request'}
             </h2>
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
                   <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white">
                       <Check className="w-10 h-10 text-[#25D366] stroke-3" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Request Sent!</h3>
                   <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                       Our experts will contact you via WhatsApp or email very soon to finalize your custom plan.
                   </p>
                   <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-[#0047AB] transition-all active:scale-95 uppercase tracking-widest text-[10px]">
                       Close
                   </button>
               </div>
           ) : (
               <form onSubmit={handleSubmit} id="inquiry-form">
                   {step === 1 ? (
                       <div className="animate-fade-in-up">
                            <div className="bg-[#F8FAFC] rounded-4xl p-5 mb-6 border border-slate-100 flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-[#0047AB] flex items-center justify-center shrink-0 shadow-md">
                                    <Sparkles className="text-white w-8 h-8" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-black text-slate-900 leading-tight mb-1 truncate">
                                        {selectedTour?.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <MapPin className="w-3 h-3 text-slate-300" /> Dubai AI Trip
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 text-center">Adults</span>
                                        <div className="flex items-center justify-between">
                                            <button type="button" onClick={() => setFormData({...formData, adults: Math.max(1, formData.adults - 1)})} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold shadow-sm">-</button>
                                            <span className="font-black text-slate-900">{formData.adults}</span>
                                            <button type="button" onClick={() => setFormData({...formData, adults: formData.adults + 1})} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold shadow-sm">+</button>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 text-center">Kids</span>
                                        <div className="flex items-center justify-between">
                                            <button type="button" onClick={() => setFormData({...formData, kids: Math.max(0, formData.kids - 1)})} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold shadow-sm">-</button>
                                            <span className="font-black text-slate-900">{formData.kids}</span>
                                            <button type="button" onClick={() => setFormData({...formData, kids: formData.kids + 1})} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold shadow-sm">+</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                                    <textarea 
                                        value={formData.requirement}
                                        onChange={(e) => setFormData({...formData, requirement: e.target.value})}
                                        placeholder="Add special requests (e.g. Vegetarian food, Pick up time)..."
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-3xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] h-28 resize-none"
                                    />
                                </div>
                            </div>
                       </div>
                   ) : (
                       <div className="space-y-4 animate-fade-in-up">
                            <input 
                                type="text" required placeholder="Full Name"
                                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-[#0047AB]"
                            />
                            <input 
                                type="tel" required placeholder="WhatsApp Number"
                                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-[#0047AB]"
                            />
                            <input 
                                type="email" required placeholder="Email Address"
                                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-[#0047AB]"
                            />
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


// --- MAIN TRIP PLANNER PAGE COMPONENT ---
const TripPlanner = () => {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    days: 4, budget: 'Medium', interests: [], travelers: 'Couple'
  });

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.interests.length === 0) {
        toast.error("Please select at least one interest!");
        return;
    }
    setLoading(true);
    // Simulate API logic
    setTimeout(() => {
      setItinerary(`### Your Custom Dubai Plan
* **Day 1:** Private Desert Safari with VIP Majlis.
* **Day 2:** Burj Khalifa & Underwater Zoo.
* **Day 3:** Shopping at Dubai Mall & Souk Madinat.`);
      setLoading(false);
    }, 2000);
  };

  const interestOptions = ['Shopping', 'Dune Bashing', 'History', 'Foodie', 'Luxury', 'Theme Parks', 'Nightlife', 'Relaxation'];

  return (
    <div className="bg-white py-12 md:py-20 px-4 sm:px-6 lg:px-8 min-h-screen font-sans">
      <div className="max-w-350 mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0047AB] font-bold text-xs mb-6 shadow-sm uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-[#FFB800]" /> AI Travel Concierge
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Design Your <span className="text-[#0047AB]">Dream Trip</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Form */}
          <div className="lg:col-span-4 sticky top-28">
             <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
                <div className="h-2 bg-linear-to-r from-[#0047AB] via-[#22C55E] to-[#FFB800]"></div>
                <div className="p-8">
                   <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0047AB]"><Plane className="w-6 h-6" /></div>
                       <h3 className="text-xl font-black text-slate-900 leading-none">Trip Details</h3>
                   </div>

                    <form onSubmit={handleSubmit} className="space-y-7">
                      <div className="space-y-4">
                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center justify-between">
                          <span>Duration</span> <span className="text-[#0047AB] bg-blue-50 px-3 py-1 rounded-lg">{formData.days} Days</span>
                        </label>
                        <input type="range" min="1" max="14" value={formData.days} onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none accent-[#0047AB]" />
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Budget</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['Budget', 'Medium', 'High', 'Luxury'].map((opt) => (
                             <button key={opt} type="button" onClick={() => setFormData({...formData, budget: opt})} className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all ${formData.budget === opt ? 'bg-[#0047AB] text-white' : 'bg-white text-slate-500 border-slate-100'}`}>{opt}</button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Travelers</label>
                        <select value={formData.travelers} onChange={(e) => setFormData({...formData, travelers: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-700 outline-none transition-all">
                            <option value="Solo">Solo Explorer</option>
                            <option value="Couple">Couple</option>
                            <option value="Family">Family</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Interests</label>
                        <div className="flex flex-wrap gap-2">
                          {interestOptions.map((interest) => (
                            <button key={interest} type="button" onClick={() => handleInterestToggle(interest)} className={`px-4 py-2 text-[11px] font-bold rounded-xl border transition-all ${formData.interests.includes(interest) ? 'bg-[#22C55E] text-white border-[#22C55E]' : 'bg-white text-slate-500 border-slate-100'}`}>{interest}</button>
                          ))}
                        </div>
                      </div>

                      <button type="submit" disabled={loading} className="w-full flex items-center justify-center py-5 px-6 rounded-2xl shadow-xl text-sm font-black text-white bg-[#22C55E] hover:bg-green-600 disabled:opacity-70 transition-all active:scale-95 group">
                        {loading ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Thinking...</> : <>Generate Itinerary <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"/></>}
                      </button>
                    </form>
                </div>
             </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-8">
             <div className="bg-slate-50/50 rounded-[40px] border border-slate-100 min-h-175 p-8 lg:p-12 relative flex flex-col">
               {loading ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 relative mb-8">
                      <div className="absolute inset-0 border-4 border-[#0047AB] rounded-full border-t-transparent animate-spin"></div>
                      <Sparkles className="absolute inset-0 m-auto text-[#FFB800] w-10 h-10 animate-pulse" />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 mb-3">Curating Your Trip</h3>
                 </div>
               ) : itinerary ? (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-8 border-b border-slate-200 gap-6">
                      <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Your Itinerary</h3>
                      <button onClick={() => setItinerary(null)} className="flex items-center text-xs font-black text-slate-400 hover:text-[#0047AB] px-5 py-3 rounded-xl bg-white border border-slate-100 shadow-sm transition-all"><RefreshCw className="w-4 h-4 mr-2" /> Reset</button>
                   </div>
                   <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-strong:text-[#0047AB]">
                     <ReactMarkdown>{itinerary}</ReactMarkdown>
                   </div>
                   
                   {/* MODAL TRIGGER BUTTON */}
                   <div className="mt-16 p-8 bg-white rounded-4xl flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-100 shadow-2xl">
                      <div className="text-center md:text-left">
                        <h4 className="font-black text-slate-900 text-2xl mb-1">Love this plan?</h4>
                        <p className="text-slate-500 font-medium">Get a final quote for this exact itinerary.</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                           <a href="https://wa.me/971501902213" target='_blank' className="w-full md:w-auto bg-[#22C55E] text-white font-black py-4 px-8 rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 transition-all"><Smartphone className="w-5 h-5 mr-3" /> WhatsApp</a>
                           <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-slate-900 text-white font-black py-4 px-8 rounded-2xl shadow-lg flex items-center justify-center hover:bg-[#0047AB] hover:scale-105 transition-all"><FileText className="w-5 h-5 mr-3" /> Official Quote</button>
                      </div>
                   </div>
                 </div>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4 space-y-8">
                   <Map className="w-20 h-20 text-slate-200" />
                   <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Ready to Plan? Use the AI Planner.</h3>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* MODAL COMPONENT */}
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