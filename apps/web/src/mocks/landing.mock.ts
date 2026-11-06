export interface MockCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  taskCount: number;
}

export interface MockTaskItem {
  id: string;
  title: string;
  categoryName: string;
  budget: number;
  isRemote: boolean;
  deliveryModeText?: string;
  locationLabel?: string;
  timeAgoText?: string;
  deadlineText?: string;
  deadlineTime?: string;
  description?: string;
  acceptanceCriteria?: string;
  authorName: string;
  authorInitials?: string;
  authorSchool?: string;
  authorRating?: number;
  authorReviewsCount?: number;
  isVerifiedStudent?: boolean;
  offersCount: number;
}

export interface PlatformStat {
  label: string;
  value: string;
  description: string;
}

export interface HowItWorkStep {
  step: string;
  stepLabel?: string;
  title: string;
  description: string;
  footerTag?: string;
  iconType?: 'file' | 'user' | 'message' | 'award';
}

export const MOCK_CATEGORIES: MockCategory[] = [
  {
    id: 'cat-1',
    slug: 'gia-su-hoc-tap',
    name: 'Gia sư & Học tập',
    description: 'Kèm tiếng Anh, Toán, Lập trình, Ôn thi chứng chỉ',
    taskCount: 42,
  },
  {
    id: 'cat-2',
    slug: 'lap-trinh-cntt',
    name: 'Lập trình & CNTT',
    description: 'Sửa bug web, thiết kế landing page, viết script automation',
    taskCount: 38,
  },
  {
    id: 'cat-3',
    slug: 'dich-thuat-noi-dung',
    name: 'Viết lách & Dịch thuật',
    description: 'Biên dịch tài liệu, viết content SEO, gõ phụ đề video',
    taskCount: 29,
  },
  {
    id: 'cat-4',
    slug: 'thiet-ke-do-hoa',
    name: 'Thiết kế đồ họa',
    description: 'Thiết kế banner, logo câu lạc bộ, slide thuyết trình Canva',
    taskCount: 31,
  },
  {
    id: 'cat-5',
    slug: 'tro-ly-su-kien',
    name: 'Trợ lý sự kiện',
    description: 'Check-in hội thảo, hỗ trợ hậu cần, quay chụp ảnh sự kiện',
    taskCount: 19,
  },
  {
    id: 'cat-6',
    slug: 'van-phong-nhap-lieu',
    name: 'Nhập liệu & Admin',
    description: 'Xử lý file Excel, số hóa tài liệu, khảo sát biểu mẫu',
    taskCount: 24,
  },
];

export const MOCK_FEATURED_TASKS: MockTaskItem[] = [
  {
    id: 'tsk-001',
    title: 'Xây dựng RESTful API Node.js Express kết nối CSDL PostgreSQL cho mini-game',
    categoryName: 'Lập trình & CNTT',
    budget: 700000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '25 phút trước',
    deadlineText: 'Còn 2 ngày',
    deadlineTime: '20:00',
    description:
      'Mình cần code 5 endpoint API CRUD cơ bản (bảng Leaderboard, Users, Scores) bằng Node.js / Express / TypeScript. Cần có...',
    acceptanceCriteria: 'Mã nguồn GitHub repo hoặc file ZIP chạy được lệnh `npm...',
    authorName: 'Duy Anh',
    authorInitials: 'DU',
    authorSchool: 'Đại học Công Nghệ - ĐHQGHN (UET)',
    authorRating: 5.0,
    authorReviewsCount: 16,
    isVerifiedStudent: true,
    offersCount: 3,
  },
  {
    id: 'tsk-002',
    title: 'Thiết kế bộ Slide thuyết trình Pitching 15 trang chuẩn phong cách Start-up',
    categoryName: 'Thiết kế đồ họa',
    budget: 450000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '1 giờ trước',
    deadlineText: 'Còn 3 ngày',
    deadlineTime: '18:00',
    description:
      'Cần bạn sinh viên thành thạo Figma hoặc Canva làm lại bộ pitch deck gọi vốn sinh viên, tone màu hiện đại tối giản...',
    acceptanceCriteria: 'File Figma editable + link xuất bản PDF 300dpi sắc nét',
    authorName: 'Minh Hoàng',
    authorInitials: 'MH',
    authorSchool: 'ĐH Kinh Tế Quốc Dân (NEU)',
    authorRating: 4.9,
    authorReviewsCount: 24,
    isVerifiedStudent: true,
    offersCount: 5,
  },
  {
    id: 'tsk-003',
    title: 'Kèm ôn thi Toeic cấp tốc (Mục tiêu 650+) 3 buổi/tuần qua Google Meet',
    categoryName: 'Gia sư & Học tập',
    budget: 1200000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '2 giờ trước',
    deadlineText: 'Còn 4 ngày',
    deadlineTime: '21:30',
    description:
      'Tìm bạn sinh viên có Toeic 850+ hoặc Ielts 7.0+ kèm phần Listening và Reading part 5-7, có giáo trình và phương pháp rõ ràng...',
    acceptanceCriteria: 'Hoàn thành 12 buổi học + đánh giá tiến độ làm bài test',
    authorName: 'Thu Thảo',
    authorInitials: 'TT',
    authorSchool: 'ĐH Ngoại Thương Hà Nội (FTU)',
    authorRating: 5.0,
    authorReviewsCount: 31,
    isVerifiedStudent: true,
    offersCount: 8,
  },
  {
    id: 'tsk-004',
    title: 'Hỗ trợ trực bàn check-in hội thảo AI tại ĐHQG Hà Nội (Khu vực Cầu Giấy)',
    categoryName: 'Trợ lý sự kiện',
    budget: 350000,
    isRemote: false,
    deliveryModeText: 'Tại chỗ',
    locationLabel: 'Cầu Giấy, Hà Nội',
    timeAgoText: '3 giờ trước',
    deadlineText: 'Còn 1 ngày',
    deadlineTime: '07:30',
    description:
      'Cần 2 bạn sinh viên hỗ trợ đón tiếp khách mời, phát tài liệu và quét mã QR vé tham dự sự kiện sáng thứ 7 tuần này...',
    acceptanceCriteria: 'Có mặt đúng 7h30, hỗ trợ check-in hoàn tất cho 200 khách',
    authorName: 'CLB Công Nghệ',
    authorInitials: 'CN',
    authorSchool: 'ĐH Bách Khoa Hà Nội (HUST)',
    authorRating: 4.8,
    authorReviewsCount: 12,
    isVerifiedStudent: true,
    offersCount: 6,
  },
  {
    id: 'tsk-005',
    title: 'Biên dịch 20 trang tài liệu kỹ thuật từ tiếng Anh sang tiếng Việt',
    categoryName: 'Viết lách & Dịch thuật',
    budget: 600000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '5 giờ trước',
    deadlineText: 'Còn 3 ngày',
    deadlineTime: '17:00',
    description:
      'Tài liệu về quy trình DevOps và Cloud Computing. Cần bản dịch chuẩn xác thuật ngữ kỹ thuật, câu văn lưu loát...',
    acceptanceCriteria: 'File Word hoàn chỉnh song ngữ và định dạng bảng biểu gốc',
    authorName: 'Thành Long',
    authorInitials: 'TL',
    authorSchool: 'ĐH FPT Hà Nội',
    authorRating: 5.0,
    authorReviewsCount: 9,
    isVerifiedStudent: true,
    offersCount: 4,
  },
  {
    id: 'tsk-006',
    title: 'Làm sạch và chuẩn hóa dữ liệu khảo sát sinh viên 500 dòng trên Excel',
    categoryName: 'Nhập liệu & Admin',
    budget: 300000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '6 giờ trước',
    deadlineText: 'Còn 1 ngày',
    deadlineTime: '12:00',
    description:
      'Dữ liệu khảo sát từ Google Form bị trùng lặp và sai định dạng số điện thoại/email. Cần làm sạch và tạo biểu đồ tổng kết...',
    acceptanceCriteria: 'File Excel sạch lỗi, các sheet phân tích pivot table hoàn chỉnh',
    authorName: 'Phòng CTSV',
    authorInitials: 'SV',
    authorSchool: 'Học viện Ngân Hàng (BA)',
    authorRating: 4.9,
    authorReviewsCount: 19,
    isVerifiedStudent: true,
    offersCount: 7,
  },
  {
    id: 'tsk-007',
    title: 'Thiết kế mẫu bao bì và nhãn dán sản phẩm trà hoa cúc cho đồ án tốt nghiệp',
    categoryName: 'Thiết kế đồ họa',
    budget: 550000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '7 giờ trước',
    deadlineText: 'Còn 2 ngày',
    deadlineTime: '15:00',
    description:
      'Cần bạn sinh viên thành thạo Illustrator / Photoshop vẽ file bao bì hộp trà 10x15cm, có sẵn logo và mã vạch...',
    acceptanceCriteria: 'File thiết kế vector .AI xuất chuẩn in ấn CMYK + file mockup 3D',
    authorName: 'Thanh Vân',
    authorInitials: 'TV',
    authorSchool: 'ĐH Kiến Trúc Hà Nội (HAU)',
    authorRating: 5.0,
    authorReviewsCount: 14,
    isVerifiedStudent: true,
    offersCount: 5,
  },
  {
    id: 'tsk-008',
    title: 'Hướng dẫn giải bài tập Xác suất Thống kê và Kinh tế Lượng qua Google Meet',
    categoryName: 'Gia sư & Học tập',
    budget: 800000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '8 giờ trước',
    deadlineText: 'Còn 3 ngày',
    deadlineTime: '20:30',
    description:
      'Tìm bạn sinh viên học lực Giỏi/Xuất sắc kèm 4 buổi ôn thi giữa kỳ phần ước lượng hồi quy và kiểm định giả thuyết...',
    acceptanceCriteria: 'Hoàn thành giải thích chi tiết 5 đề thi mẫu và phương pháp bấm máy',
    authorName: 'Hải Đăng',
    authorInitials: 'HĐ',
    authorSchool: 'ĐH Ngoại Thương Hà Nội (FTU)',
    authorRating: 4.9,
    authorReviewsCount: 22,
    isVerifiedStudent: true,
    offersCount: 6,
  },
  {
    id: 'tsk-009',
    title: 'Hỗ trợ quay dựng 3 clip ngắn TikTok/Reels review đồ ăn quanh khu Bách Khoa',
    categoryName: 'Trợ lý sự kiện',
    budget: 450000,
    isRemote: false,
    deliveryModeText: 'Tại chỗ',
    locationLabel: 'Hai Bà Trưng, Hà Nội',
    timeAgoText: '10 giờ trước',
    deadlineText: 'Còn 1 ngày',
    deadlineTime: '18:00',
    description:
      'Cần 1 bạn sinh viên có điện thoại quay tốt đi cùng ghi hình 3 quán ăn vặt sinh viên và hỗ trợ cắt ghép CapCut cơ bản...',
    acceptanceCriteria: 'Bàn giao 3 video hoàn thiện 30-45 giây tỉ lệ 9:16 có phụ đề và nhạc',
    authorName: 'CLB Sinh Viên',
    authorInitials: 'BK',
    authorSchool: 'ĐH Bách Khoa Hà Nội (HUST)',
    authorRating: 4.8,
    authorReviewsCount: 8,
    isVerifiedStudent: true,
    offersCount: 3,
  },
  {
    id: 'tsk-010',
    title: 'Xây dựng script automation cào dữ liệu tin tuyển dụng bằng Python Selenium',
    categoryName: 'Lập trình & CNTT',
    budget: 950000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '12 giờ trước',
    deadlineText: 'Còn 2 ngày',
    deadlineTime: '23:59',
    description:
      'Cần viết script Python tự động thu thập thông tin vị trí thực tập, mức lương và lưu vào file CSV / SQLite có xử lý paging...',
    acceptanceCriteria: 'Mã nguồn Python chạy mượt, có file README hướng dẫn cài đặt và chạy thử',
    authorName: 'Quốc Bảo',
    authorInitials: 'QB',
    authorSchool: 'Đại học Công Nghệ - ĐHQGHN (UET)',
    authorRating: 5.0,
    authorReviewsCount: 17,
    isVerifiedStudent: true,
    offersCount: 9,
  },
  {
    id: 'tsk-011',
    title: 'Thiết kế slide thuyết trình Canva 25 trang cho môn Marketing Căn Bản',
    categoryName: 'Thiết kế đồ họa',
    budget: 400000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '14 giờ trước',
    deadlineText: 'Còn 2 ngày',
    deadlineTime: '19:00',
    description:
      'Cần 1 bạn sinh viên thiết kế bộ slide pitch deck môn Marketing chủ đề đồ uống healthy. Có sẵn dàn ý và nội dung bài thuyết trình...',
    acceptanceCriteria: 'File link Canva chỉnh sửa được kèm file xuất PDF chất lượng cao',
    authorName: 'Minh Trang',
    authorInitials: 'MT',
    authorSchool: 'Đại học Kinh Tế Quốc Dân (NEU)',
    authorRating: 4.9,
    authorReviewsCount: 15,
    isVerifiedStudent: true,
    offersCount: 7,
  },
  {
    id: 'tsk-012',
    title: 'Hỗ trợ setup âm thanh và máy chiếu cho buổi workshop tại hội trường Bách Khoa',
    categoryName: 'Trợ lý sự kiện',
    budget: 350000,
    isRemote: false,
    deliveryModeText: 'Tại chỗ',
    locationLabel: 'Hai Bà Trưng, Hà Nội',
    timeAgoText: '16 giờ trước',
    deadlineText: 'Còn 1 ngày',
    deadlineTime: '13:00',
    description:
      'Cần bạn sinh viên hỗ trợ kỹ thuật kết nối laptop, mic không dây và test video mở màn sự kiện trong vòng 3 tiếng chiều thứ Bảy...',
    acceptanceCriteria: 'Có mặt đúng giờ, đảm bảo hệ thống âm thanh và máy chiếu hoạt động ổn định',
    authorName: 'Hội Sinh Viên',
    authorInitials: 'SV',
    authorSchool: 'ĐH Bách Khoa Hà Nội (HUST)',
    authorRating: 5.0,
    authorReviewsCount: 20,
    isVerifiedStudent: true,
    offersCount: 4,
  },
  {
    id: 'tsk-013',
    title: 'Viết bài phân tích SWOT và chiến lược kinh doanh cho chuỗi cà phê sinh viên',
    categoryName: 'Viết lách & Dịch thuật',
    budget: 500000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '18 giờ trước',
    deadlineText: 'Còn 3 ngày',
    deadlineTime: '22:00',
    description:
      'Tiểu luận 12 trang môn Quản trị chiến lược. Yêu cầu có số liệu khảo sát thực tế và phân tích ma trận cạnh tranh chi tiết...',
    acceptanceCriteria: 'Bản Word hoàn chỉnh, kiểm tra không đạo văn (<15%), danh mục tài liệu APA',
    authorName: 'Khánh Linh',
    authorInitials: 'KL',
    authorSchool: 'Đại học Ngoại Thương (FTU)',
    authorRating: 4.8,
    authorReviewsCount: 11,
    isVerifiedStudent: true,
    offersCount: 6,
  },
  {
    id: 'tsk-014',
    title: 'Lập trình ứng dụng React Native hiển thị lịch học và thời khóa biểu sinh viên',
    categoryName: 'Lập trình & CNTT',
    budget: 1200000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '1 ngày trước',
    deadlineText: 'Còn 5 ngày',
    deadlineTime: '23:59',
    description:
      'Cần bạn sinh viên CNTT hỗ trợ xây dựng 3 màn hình chính: Trang chủ, Lịch tuần, và Thông báo sự kiện bằng Expo / React Native...',
    acceptanceCriteria: 'Mã nguồn sạch, có state management và hướng dẫn chạy trên Android/iOS Simulator',
    authorName: 'Việt Hoàng',
    authorInitials: 'VH',
    authorSchool: 'Đại học Công Nghệ - ĐHQGHN (UET)',
    authorRating: 5.0,
    authorReviewsCount: 24,
    isVerifiedStudent: true,
    offersCount: 8,
  },
  {
    id: 'tsk-015',
    title: 'Dịch thuật tóm tắt 10 bài báo khoa học quốc tế lĩnh vực Trí tuệ nhân tạo',
    categoryName: 'Viết lách & Dịch thuật',
    budget: 750000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '1 ngày trước',
    deadlineText: 'Còn 4 ngày',
    deadlineTime: '17:00',
    description:
      'Dịch tóm tắt (Abstract + Conclusion) từ tiếng Anh sang tiếng Việt cho nhóm nghiên cứu lab AI, câu văn chuẩn học thuật...',
    acceptanceCriteria: 'Bàn giao file Docs chuẩn thuật ngữ khoa học máy tính kèm link gốc bài báo',
    authorName: 'Đức Thắng',
    authorInitials: 'ĐT',
    authorSchool: 'ĐH Bách Khoa TP.HCM (HCMUT)',
    authorRating: 4.9,
    authorReviewsCount: 16,
    isVerifiedStudent: true,
    offersCount: 5,
  },
  {
    id: 'tsk-016',
    title: 'Gia sư kèm 3 buổi giải đề thi Giải tích 2 và Đại số tuyến tính cho tân sinh viên',
    categoryName: 'Gia sư & Học tập',
    budget: 600000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '1 ngày trước',
    deadlineText: 'Còn 2 ngày',
    deadlineTime: '21:00',
    description:
      'Tìm bạn sinh viên học lực Giỏi đạt A môn Giải tích 2 kèm trực tiếp qua Google Meet, giải mẫu 4 bộ đề thi cuối kỳ gần nhất...',
    acceptanceCriteria: 'Giảng dạy dễ hiểu, cung cấp file tóm tắt công thức trọng tâm và bài tập mẫu',
    authorName: 'Hồng Nhung',
    authorInitials: 'HN',
    authorSchool: 'ĐH Bách Khoa Hà Nội (HUST)',
    authorRating: 5.0,
    authorReviewsCount: 18,
    isVerifiedStudent: true,
    offersCount: 9,
  },
  {
    id: 'tsk-017',
    title: 'Chụp ảnh kỷ yếu cá nhân và chỉnh sửa 20 file ảnh tone thanh xuân tại khuôn viên trường',
    categoryName: 'Trợ lý sự kiện',
    budget: 500000,
    isRemote: false,
    deliveryModeText: 'Tại chỗ',
    locationLabel: 'Hai Bà Trưng, Hà Nội',
    timeAgoText: '2 ngày trước',
    deadlineText: 'Còn 3 ngày',
    deadlineTime: '16:30',
    description:
      'Cần 1 bạn sinh viên chụp máy ảnh cơ hoặc máy compact chụp ảnh tốt trong 2 tiếng tại thư viện Tạ Quang Bửu và sân trường...',
    acceptanceCriteria: 'Bàn giao toàn bộ ảnh gốc và 20 ảnh blend màu hoàn thiện sau 24h',
    authorName: 'Thu Phương',
    authorInitials: 'TP',
    authorSchool: 'ĐH Bách Khoa Hà Nội (HUST)',
    authorRating: 4.9,
    authorReviewsCount: 13,
    isVerifiedStudent: true,
    offersCount: 4,
  },
  {
    id: 'tsk-018',
    title: 'Vẽ wireframe và thiết kế UI prototype ứng dụng đặt món ăn sinh viên trên Figma',
    categoryName: 'Thiết kế đồ họa',
    budget: 850000,
    isRemote: true,
    deliveryModeText: 'Làm Online',
    timeAgoText: '2 ngày trước',
    deadlineText: 'Còn 4 ngày',
    deadlineTime: '23:00',
    description:
      'Đồ án môn UI/UX Design. Cần thiết kế 5 màn hình chính theo phong cách hiện đại, có tương tác click prototype cơ bản...',
    acceptanceCriteria: 'Link file Figma có hệ thống Auto Layout và Design System mini',
    authorName: 'Quang Huy',
    authorInitials: 'QH',
    authorSchool: 'ĐH FPT Hà Nội',
    authorRating: 5.0,
    authorReviewsCount: 27,
    isVerifiedStudent: true,
    offersCount: 8,
  },
];

export const MOCK_STATS: PlatformStat[] = [
  {
    value: '5.000+',
    label: 'Sinh viên & Tasker',
    description: 'Từ các trường đại học hàng đầu',
  },
  {
    value: '12.000+',
    label: 'Công việc hoàn thành',
    description: 'Thanh toán an toàn, nghiệm thu rõ ràng',
  },
  {
    value: '99.2%',
    label: 'Hài lòng',
    description: 'Đánh giá tích cực từ người đăng việc',
  },
  {
    value: '< 15 phút',
    label: 'Nhận chào giá đầu tiên',
    description: 'Kết nối nhu cầu tức thì',
  },
];

export const MOCK_STEPS: HowItWorkStep[] = [
  {
    step: '01',
    stepLabel: 'BƯỚC 01',
    title: 'Đăng Task trong 2 phút',
    description:
      'Nhập tiêu đề, mô tả và quan trọng nhất là Tiêu chuẩn nghiệm thu (Expected Output) cùng ngân sách minh bạch.',
    footerTag: 'Rõ ràng · Không rủi ro',
    iconType: 'file',
  },
  {
    step: '02',
    stepLabel: 'BƯỚC 02',
    title: 'Chọn Người thực hiện',
    description:
      'Các freelancer gửi báo giá. Bạn so sánh hồ sơ, đánh giá sao và chọn người ưng ý nhất.',
    footerTag: 'Rõ ràng · Không rủi ro',
    iconType: 'user',
  },
  {
    step: '03',
    stepLabel: 'BƯỚC 03',
    title: 'Không gian Order an toàn',
    description:
      'Hai bên trao đổi tin nhắn, gửi tệp và theo dõi tiến độ. Ngân sách được hệ thống tạm giữ an toàn, bảo vệ cả hai bên.',
    footerTag: 'Rõ ràng · Không rủi ro',
    iconType: 'message',
  },
  {
    step: '04',
    stepLabel: 'BƯỚC 04',
    title: 'Nghiệm thu & Đánh giá',
    description:
      'Kiểm tra sản phẩm bàn giao. Chỉ khi bạn hài lòng và bấm nghiệm thu, thù lao mới được chuyển giao cho Người thực hiện.',
    footerTag: 'Rõ ràng · Không rủi ro',
    iconType: 'award',
  },
];

