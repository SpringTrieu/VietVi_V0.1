import { FileText, UserCheck, MessageSquare, Award } from 'lucide-react';
import { MOCK_STEPS, type HowItWorkStep } from '@/mocks/landing.mock';

export interface HowItWorksSectionProps {
  title?: string;
  subtitle?: string;
  steps?: HowItWorkStep[];
}

export function HowItWorksSection({
  title = 'Cách thức hoạt động của VIETVI',
  subtitle = 'Đơn giản, minh bạch và bảo đảm an toàn quyền lợi cho cả hai phía giao dịch.',
  steps = MOCK_STEPS,
}: HowItWorksSectionProps) {
  const renderStepIcon = (iconType?: string) => {
    switch (iconType) {
      case 'file':
        return <FileText className="size-5 text-[#222325]" aria-hidden="true" />;
      case 'user':
        return <UserCheck className="size-5 text-[#222325]" aria-hidden="true" />;
      case 'message':
        return <MessageSquare className="size-5 text-[#222325]" aria-hidden="true" />;
      case 'award':
      default:
        return <Award className="size-5 text-[#222325]" aria-hidden="true" />;
    }
  };

  return (
    <section id="how-it-works" className="w-full bg-white py-14 sm:py-20 border-t border-[#dadbdd] scroll-mt-16 relative">
      {/* Mốc neo hỗ trợ liên kết 'Bảo hiểm giao dịch' (#trust-pillars) chuẩn scroll-margin-top 64px */}
      <div id="trust-pillars" className="scroll-mt-16" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề & phụ đề trung tâm */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#222325]">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#74767e]">
            {subtitle}
          </p>
        </div>

        {/* Lưới 4 bước hoạt động (chuẩn DDESIGN.md) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.step}
              className="flex flex-col justify-between rounded-2xl border border-[#dadbdd] bg-white p-6 shadow-sm transition-all duration-200 hover:border-[#1DBF73]/50 hover:shadow-md hover:-translate-y-1"
            >
              <div>
                {/* Hàng đầu: Icon bo góc 12px bên trái, nhãn bước bên phải */}
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-[#222325]">
                    {renderStepIcon(step.iconType)}
                  </div>
                  <span className="text-[11px] font-bold tracking-wider text-[#74767e] uppercase">
                    {step.stepLabel || `BƯỚC ${step.step}`}
                  </span>
                </div>

                {/* Tiêu đề bước */}
                <h3 className="mt-5 text-[17px] font-bold text-[#222325] leading-snug">
                  {step.title}
                </h3>

                {/* Mô tả chi tiết bước */}
                <p className="mt-2.5 text-[14px] text-[#62646a] leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Chân thẻ: Hairline divider + Tag cam kết */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#74767e] font-medium">
                <span>{step.footerTag || 'Rõ ràng · Không rủi ro'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
