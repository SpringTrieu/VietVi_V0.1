import Image from 'next/image';

export type AuthBannerProps = {
  slogan?: string;
  stats?: Array<{ value: string; label: string }>;
};

const DEFAULT_STATS = [
  { value: '10.000+', label: 'Chuyên gia' },
  { value: '120+', label: 'Danh mục' },
  { value: '98%', label: 'Hoàn thành' },
];

const DEFAULT_SLOGAN = 'Sử dụng kĩ năng một cách có giá trị!';

export function AuthBanner({
  slogan = DEFAULT_SLOGAN,
  stats = DEFAULT_STATS,
}: AuthBannerProps) {
  return (
    <div className="relative hidden min-[481px]:flex flex-col justify-between overflow-hidden h-[200px] min-[900px]:h-auto min-[900px]:min-h-[580px] [@media(max-height:800px)_and_(min-width:900px)]:min-h-[480px]">
      {/* File hình ảnh gốc chất lượng cao: 3965 x 5947 px */}
      <Image
        src="/images/auth-bg.jpg"
        alt=""
        fill
        priority
        quality={95}
        className="object-cover object-[center_26%] z-[1]"
        sizes="(max-width: 480px) 0vw, (max-width: 899px) 100vw, 800px"
      />

      {/* Lớp phủ Gradient cân bằng tương phản theo chuẩn DDESIGN.md */}
      <div
        className="absolute inset-0 z-[2] flex flex-col justify-between p-6 sm:p-8 min-[900px]:p-12 [@media(max-height:800px)_and_(min-width:900px)]:p-8"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.05) 30%, rgba(0, 0, 0, 0.05) 60%, rgba(0, 0, 0, 0.65) 100%)',
        }}
        aria-hidden="true"
      >
        {/* Cụm 3 thông số thống kê: Ẩn trên tablet, hiện trên desktop >= 900px */}
        <div className="hidden min-[900px]:flex items-center justify-between text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <div className="text-[26px] xl:text-[28px] font-extrabold text-[#ffffff] tracking-tight leading-none">
                {stat.value}
              </div>
              <div className="text-[14px] text-white/90 font-medium mt-1.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tiêu đề thông điệp phía dưới */}
        <div className="text-white mt-auto">
          <h2 className="text-[22px] sm:text-[24px] min-[900px]:text-[26px] xl:text-[32px] font-bold text-[#ffffff] leading-[1.15] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {slogan}
          </h2>
        </div>
      </div>
    </div>
  );
}

