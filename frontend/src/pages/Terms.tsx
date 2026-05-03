import { motion } from 'framer-motion';
import { FileText, Scale, Gavel, ShieldCheck } from 'lucide-react';

const Terms = () => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Area */}
      <div className="mb-16 text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex p-4 bg-primary/5 text-primary rounded-[1.5rem] mb-6"
        >
          <Scale className="w-12 h-12" />
        </motion.div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none">
          Legal <span className="text-primary">Framework</span>
        </h1>
        <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto">
          Comprehensive Terms of Service, Privacy Policy, and Regulatory Compliance Guidelines.
        </p>
      </div>

      {/* The "Dense" Legal Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {/* Terms of Service Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Gavel className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-widest">1. Terms of Service</h2>
            </div>
            <div className="text-[9px] leading-[1.1] text-muted-foreground/80 space-y-4 font-medium text-justify">
              <p>
                By accessing and using the SatByte AI Student Toolkit Pro ("STP"), you acknowledge and agree to be bound by the following terms and conditions. These terms constitute a legally binding agreement between you ("User") and SatByte AI ("Company"). If you do not agree to these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law. You are granted a limited, non-exclusive, non-transferable license to access the tools for personal, non-commercial use only.
              </p>
              <p>
                The Rank Predictor, Percentile Engine, and Study Planner tools are provided "as is" for informational purposes. While we strive for 99.9% accuracy using our proprietary normalization algorithms (interpolated rank bands and scaled score historical data), SatByte AI does not guarantee admission or specific exam results. Users are advised to verify all predictions with official exam conducting bodies. We reserve the right to modify, suspend, or terminate service at any time without prior notice if we detect fraudulent activity, automated scraping, or violation of our credit-based monetization policy.
              </p>
              <p>
                Credit System & Refunds: STP operates on a credit-based system. One "prediction" or "generation" typically consumes one credit. Credits are non-refundable and non-transferable. In the event of a technical failure where a credit was deducted but no result was provided, users may contact support for a credit restoration after verification of server logs. Subscription plans are billed monthly and can be cancelled at any time, but no partial refunds will be issued for remaining billing cycles.
              </p>
            </div>
          </section>

          {/* Privacy Policy Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-widest">2. Privacy & Data Handling</h2>
            </div>
            <div className="text-[9px] leading-[1.1] text-muted-foreground/80 space-y-4 font-medium text-justify">
              <p>
                Data Privacy is a core tenet of STP. We collect PII (Personally Identifiable Information) including but not limited to: Name, Email Address, IP Address (for security logging), and Academic Scores. This data is encrypted using AES-256 at rest and TLS 1.3 in transit. Our backend utilizes memory-based processing for PDF and Image tools, ensuring that your sensitive documents are never permanently stored on our disks unless explicitly saved to your dashboard.
              </p>
              <p>
                Third-Party Disclosures: We utilize Adsterra for monetization and Razorpay for payment processing. These partners may collect device identifiers and browser metadata. STP does not sell your academic performance data to recruiters or educational institutions without your explicit opt-in consent. Cookie Policy: We use persistent and session cookies to maintain your login state, track credit balances, and analyze traffic via Google Analytics. Disabling cookies will significantly degrade the user experience and prevent the use of authenticated tools.
              </p>
              <p>
                User Content: Any content generated, uploaded, or processed (PDFs, Images, Resumes) remains the intellectual property of the User. SatByte AI is granted a temporary license to process this data solely for the purpose of providing the service. We do not claim ownership or distribution rights over your academic work.
              </p>
            </div>
          </section>

          {/* Limitation of Liability Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-widest">3. Liability & Indemnity</h2>
            </div>
            <div className="text-[9px] leading-[1.1] text-muted-foreground/80 space-y-4 font-medium text-justify">
              <p>
                In no event shall SatByte AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the STP tools, even if SatByte AI or a SatByte AI authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
              </p>
              <p>
                You agree to indemnify and hold harmless SatByte AI, its officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from: (i) your use of and access to the Service; (ii) your violation of any term of these Terms; (iii) your violation of any third party right, including without limitation any copyright, property, or privacy right.
              </p>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest">Quick Summary</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black">✓</span>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground leading-tight">We respect your privacy.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black">✓</span>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground leading-tight">Credits are for tool use only.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black">✓</span>
                </div>
                <p className="text-[10px] font-bold text-muted-foreground leading-tight">No data selling to third parties.</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2.5rem] space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Need Clarification?</h4>
            <p className="text-[10px] font-medium leading-relaxed text-muted-foreground">
              If you have any questions regarding our legal framework, please reach out to our legal compliance team at legal@satbyte.ai.
            </p>
            <a href="/contact" className="inline-block text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Contact Support →</a>
          </div>

          <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 text-center">
            STP LEGAL CORE v2.4.0 <br />
            LAST UPDATED: 03-05-2026
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
