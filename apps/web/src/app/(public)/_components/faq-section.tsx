'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSectionProps {
  id?: string;
  title?: string;
  items?: FaqItem[];
  defaultOpenId?: string;
}

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'what-is-vietvi',
    question: 'VietVi là gì?',
    answer:
      'VietVi là nền tảng marketplace kết nối nhu cầu làm việc ngắn hạn giữa người thuê (cá nhân, doanh nghiệp) và cộng đồng sinh viên tài năng tại các trường đại học trên toàn quốc, mang đến sự tiện lợi, minh bạch và an toàn.',
  },
  {
    id: 'how-to-use',
    question: 'Khách hàng và người có nhu cầu thuê việc sử dụng VietVi như thế nào?',
    answer:
      'Quy trình rất nhanh gọn: Bạn chỉ cần đăng task với ngân sách dự kiến, các Tasker sinh viên đã xác minh sẽ gửi đề xuất (offer). Khi chọn được người phù hợp, tiền được tạm giữ qua hệ thống Escrow và chỉ giải ngân khi bạn nghiệm thu hài lòng.',
  },
  {
    id: 'how-to-find-tasker',
    question: 'Làm thế nào để tìm đúng Tasker mà không mất nhiều giờ tìm kiếm?',
    answer:
      'Bạn có thể tìm kiếm theo kỹ năng, danh mục công việc hoặc trường đại học, xem hồ sơ đánh giá sao và chứng chỉ đã xác thực của từng Tasker. Ngoài ra, tính năng đề xuất tự động sẽ gợi ý những Tasker có độ phản hồi nhanh và tay nghề phù hợp nhất.',
  },
  {
    id: 'are-taskers-vetted',
    question: 'Tasker trên VietVi có được xác thực hồ sơ và năng lực không?',
    answer:
      'Có. Tất cả Tasker đều phải trải qua quy trình xác minh nghiêm ngặt gồm: Thẻ sinh viên, email trường đại học (.edu.vn), giấy tờ tùy thân (CCCD) và cam kết tuân thủ quy chuẩn ứng xử văn minh trước khi được nhận việc.',
  },
  {
    id: 'payment-and-protection',
    question: 'Quy trình thanh toán hoạt động ra sao và tôi được bảo vệ thế nào khi có tranh chấp?',
    answer:
      'VietVi áp dụng cơ chế thanh toán tạm giữ (Escrow) chuẩn bảo mật. Tiền chỉ chuyển cho Tasker sau khi người thuê bấm xác nhận nghiệm thu. Trong trường hợp có bất đồng, bộ phận hỗ trợ sẽ can thiệp theo quy trình phân giải tranh chấp minh bạch để đảm bảo hoàn tiền nếu công việc không đạt yêu cầu.',
  },
  {
    id: 'difference-from-others',
    question: 'VietVi khác biệt gì so với các hội nhóm tuyển dụng tự phát hay công ty dịch vụ?',
    answer:
      'Khác với các hội nhóm mạng xã hội thiếu cam kết và dễ rủi ro bùng việc/quỵt tiền, VietVi bảo vệ 100% dòng tiền của đôi bên, minh bạch hóa lịch sử làm việc, hỗ trợ sinh viên tạo dựng hồ sơ kinh nghiệm thực chiến từ khi còn ngồi trên ghế nhà trường.',
  },
];

export function FaqSection({
  id = 'faq-section',
  title = 'FAQs',
  items = DEFAULT_FAQS,
  defaultOpenId,
}: FaqSectionProps) {
  const [openIds, setOpenIds] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  );

  const toggleItem = (itemId: string) => {
    setOpenIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((i) => i !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <section id={id} className="w-full bg-[#FAFAFA] py-[50px] sm:py-[72px] border-t border-[#dadbdd] scroll-mt-16 relative">
      {/* Neo phụ hỗ trợ cả hash '#faqs' lẫn '#faq-section' */}
      {id !== 'faqs' && <div id="faqs" className="scroll-mt-16" aria-hidden="true" />}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-14">
          {/* Cột trái: Tiêu đề FAQs lớn - font chữ thanh mảnh (font-light) như ảnh mẫu */}
          <div className="lg:w-1/3 shrink-0">
            <h2 className="text-5xl sm:text-6xl font-light text-[#222325] leading-none tracking-normal">
              {title}
            </h2>
          </div>

          {/* Cột phải: Danh sách Accordion dạng Divider (có cả viền trên và viền đáy border-y theo chuẩn ảnh mẫu) */}
          <div className="w-full lg:w-2/3 max-w-[800px] border-y border-[#dadbdd] divide-y divide-[#dadbdd]">
            {items.map((item) => {
              const isOpen = openIds.includes(item.id);
              const triggerId = `faq-trigger-${item.id}`;
              const contentId = `faq-content-${item.id}`;

              return (
                <div key={item.id} className="group">
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => toggleItem(item.id)}
                    className="flex w-full items-center justify-between py-3.5 sm:py-[18px] text-left cursor-pointer transition-colors"
                  >
                    <span className="text-[17px] sm:text-[18px] font-bold text-[#222325] group-hover:text-[#1dbf73] transition-colors pr-4">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-slate-500 transition-transform duration-300 ease-in-out ${
                        isOpen ? 'rotate-180 text-[#1dbf73]' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Vùng nội dung mở rộng mượt mà với CSS Grid Transition */}
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={triggerId}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-4 pr-6 text-[#62646a] text-[15px] sm:text-base leading-relaxed">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
