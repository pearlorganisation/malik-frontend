
import React, { useState, useEffect } from 'react';
import { X, Star, Check, ArrowRight, ArrowLeft, Send, MessageSquare, Sparkles, Mail, User, Phone, Users, ShieldCheck } from 'lucide-react';


const InquiryModal = ({ isOpen, onClose, selectedTour }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  const renderTourCard = () => (
    <div className="bg-[#F8FAFC] rounded-[2rem] p-5 mb-6 border border-slate-100 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md">
            <img 
                src={selectedTour?.imageUrl || 'https://images.unsplash.com/photo-1512453979798-5ea90b7cadc9?q=80&w=200'} 
                className="w-full h-full object-cover" 
                alt={selectedTour?.name} 
            />
        </div>
        <div className="min-w-0">
            <h3 className="text-lg font-black text-slate-900 leading-tight mb-1 truncate">
                {selectedTour?.name || 'Experience Inquiry'}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <MapPinIcon className="w-3 h-3 text-slate-300" /> {selectedTour?.location || 'Dubai'}
            </div>
        </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="animate-fade-in-up">
      {renderTourCard()}
      
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

          <div className="relative group">
              <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-[#0047AB] transition-colors">
                  <MessageSquare className="w-4 h-4" />
              </div>
              <textarea 
                  value={formData.requirement}
                  onChange={(e) => setFormData({...formData, requirement: e.target.value})}
                  placeholder="Tell us your specific requirement or ask a question..."
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] focus:bg-white transition-all h-28 resize-none"
              />
          </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 animate-fade-in-up">
      <div className="bg-[#EBF5FF] p-4 rounded-2xl border border-blue-100 mb-2">
         <p className="text-xs text-blue-900/60 font-bold leading-relaxed text-center">We need your contact details to provide a customized quote or answer your query.</p>
      </div>

      <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0047AB] transition-colors">
              <User className="w-4 h-4" />
          </div>
          <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] focus:bg-white transition-all"
              placeholder="Full Name"
          />
      </div>

      <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0047AB] transition-colors">
              <Phone className="w-4 h-4" />
          </div>
          <input 
              type="tel" 
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] focus:bg-white transition-all"
              placeholder="WhatsApp / Phone (+971...)"
          />
      </div>

      <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0047AB] transition-colors">
              <Mail className="w-4 h-4" />
          </div>
          <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] focus:bg-white transition-all"
              placeholder="Email Address"
          />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col border border-white/20">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                {isSuccess ? 'Confirmed' : 'Reservation Inquiry'}
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

        {/* Body */}
        <div className="px-8 pb-4">
           {isSuccess ? (
               <div className="text-center py-8 animate-fade-in-up">
                   <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white">
                       <Check className="w-10 h-10 text-[#25D366] stroke-[3]" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Request Sent!</h3>
                   <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                       Our experts will contact you via <span className="text-fun-green font-bold uppercase">WhatsApp</span> or email very soon.
                   </p>
                   <button 
                     onClick={onClose}
                     className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-[#0047AB] transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                   >
                       Back to Exploring
                   </button>
               </div>
           ) : (
               <form onSubmit={handleSubmit} id="inquiry-form">
                   {step === 1 ? renderStep1() : renderStep2()}
               </form>
           )}
        </div>

        {/* Footer Buttons */}
        {!isSuccess && (
            <div className="px-8 pb-8">
                {step === 1 ? (
                    <button 
                        type="button" 
                        onClick={nextStep}
                        className="w-full py-4 bg-[#0047AB] text-white font-black rounded-[1.25rem] shadow-xl hover:shadow-[#0047AB]/20 transition-all flex items-center justify-center gap-3 uppercase text-[12px] tracking-widest active:scale-95"
                    >
                        CONTINUE <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button type="button" onClick={prevStep} className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><ArrowLeft className="w-5 h-5" /></button>
                        <button 
                            type="submit"
                            form="inquiry-form"
                            disabled={isSubmitting || !formData.name || !formData.phone}
                            className="flex-1 py-4 bg-[#0047AB] text-white font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-[12px] tracking-widest active:scale-95"
                        >
                            {isSubmitting ? 'SENDING...' : 'SEND ENQUIRY'} <Send className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        )}

        {/* Trust Footer */}
        {!isSuccess && (
            <div className="bg-[#F8FAFC] py-3.5 px-8 border-t border-slate-100 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Real-time availability confirmed</div>
                <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-slate-300" /> Verified SSL</div>
            </div>
        )}
      </div>
    </div>
  );
};

function MapPinIcon(props) {
    return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
}

export default InquiryModal;
