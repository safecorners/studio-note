import React from 'react';
import { CheckCircle, Cloud, CreditCard, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { ActiveView, OrderSummary } from '../types';

interface PaymentConfirmViewProps {
  onNavigate: (view: ActiveView) => void;
  orderSummary?: OrderSummary;
}

export default function PaymentConfirmView({ onNavigate }: PaymentConfirmViewProps) {
  // Let's generate stable dynamic order specs
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const simulatedOrder: OrderSummary = {
    orderNumber: 'ESC-99281-A',
    date: formattedDate,
    paymentMethod: '•••• 4242',
    totalPaid: '$144.00',
    planName: 'Escualo Pro Plan'
  };

  const handlePrintReceipt = () => {
    // Elegant simulated browser download feedback or alert print
    const receiptText = `
---------------------------------------------
          ESCUALO NOTE CLUSTERS INC.          
                 RECEIPT                     
---------------------------------------------
Order Number: #${simulatedOrder.orderNumber}
Date:         ${simulatedOrder.date}
Plan:         ${simulatedOrder.planName}
Billing Cycle:Annual (Billed continuous)
Payment:      Card Auth (${simulatedOrder.paymentMethod})
Total Paid:   ${simulatedOrder.totalPaid}
---------------------------------------------
Thank you for your purchase. Precision in Darkness.
---------------------------------------------
    `;
    alert(receiptText);
  };

  return (
    <div id="payment-confirmation-container" className="bg-[#09090b] text-[#fafafa] font-sans min-h-screen flex flex-col items-center justify-center p-6 antialiased select-none selection:bg-brand-primary/30 selection:text-white">
      
      {/* Content wrapper */}
      <main className="w-full max-w-md flex flex-col items-center text-center">
        
        {/* Animated green checkmark badge */}
        <div className="mb-6 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-accent/10 rounded-full blur-xl scale-125 animate-pulse"></div>
          <div className="w-20 h-20 rounded-full bg-[#121215] border border-brand-accent/20 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(52,211,153,0.15)]">
            <CheckCircle className="w-10 h-10 text-brand-accent stroke-2" />
          </div>
        </div>

        {/* Lead Headline title */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">Payment Confirmation</h1>
        <p className="text-[#a1a1aa] mb-8 text-xs font-light">Thank you for your purchase. Your workspace is synced and ready.</p>

        {/* Structured receipt card */}
        <div className="w-full bg-[#121215] border border-[#27272a] rounded-xl p-6 text-left mb-8 shadow-2xl relative">
          
          {/* Header block with synced info */}
          <div className="flex items-center gap-3 border-b border-[#27272a] pb-4 mb-4">
            <div className="w-10 h-10 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center shrink-0">
              <Cloud className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-xs tracking-tight">{simulatedOrder.planName}</h3>
              <p className="text-[10px] text-[#71717a] font-medium uppercase font-mono">Billed Annually</p>
            </div>
            <span className="ml-auto flex items-center gap-1 bg-[#34d399]/15 text-[#34d399] text-[9px] font-mono px-2 py-0.5 rounded font-black border border-[#34d399]/10">
              <ShieldCheck className="w-3 h-3" />
              <span>PAID</span>
            </span>
          </div>

          {/* Details lines */}
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#a1a1aa] font-sans">Order Number</span>
              <span className="text-white font-mono text-xs">#{simulatedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#a1a1aa] font-sans">Date of Transaction</span>
              <span className="text-white font-sans">{simulatedOrder.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#a1a1aa] font-sans">Payment Method</span>
              <span className="flex items-center gap-1.5 text-white font-sans">
                <CreditCard className="w-3.5 h-3.5 text-[#5b21b6]" />
                <span>Card Ending {simulatedOrder.paymentMethod}</span>
              </span>
            </div>
          </div>

          {/* total aggregate price panel */}
          <div className="mt-6 pt-4 border-t border-[#27272a] flex justify-between items-center">
            <span className="text-[#a1a1aa] font-medium text-xs font-sans">Total Paid</span>
            <span className="text-2xl font-bold tracking-tight text-white font-sans">{simulatedOrder.totalPaid}</span>
          </div>
        </div>

        {/* Interactive Action drawers */}
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <button 
            id="payment-dashboard-btn"
            onClick={() => onNavigate('dashboard')}
            className="flex-1 bg-brand-primary hover:bg-[#bbf7d0] text-[#0a0012] font-semibold transition-all py-3 px-6 rounded-lg text-xs leading-none flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            Go to Dashboard
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button 
            id="payment-receipt-btn"
            onClick={handlePrintReceipt}
            className="flex-1 bg-transparent border border-[#27272a] hover:border-[#a1a1aa] text-[#fafafa] hover:bg-[#121215] transition-all py-3 px-6 rounded-lg text-xs font-semibold leading-none flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Receipt
          </button>
        </div>

        {/* safety disclaimer feedback */}
        <span className="text-[10px] text-[#71717a] mt-8 select-none">
          Secure cloud sync initialized. Obsidian configs compatible.
        </span>

      </main>
    </div>
  );
}
