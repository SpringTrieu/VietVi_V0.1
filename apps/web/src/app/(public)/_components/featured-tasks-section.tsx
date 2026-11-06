'use client';

import { useState, useMemo, useEffect, type FormEvent } from 'react';
import {
  Search,
  Clock,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Button, cn } from '@vietvi/ui';
import { TaskCard } from '@/features/task/components/task-card';
import { MOCK_FEATURED_TASKS, type MockTaskItem } from '@/mocks/landing.mock';

const PAGE_SIZE = 9;

const SUGGESTION_TAGS = [
  'Canva',
  'Python',
  'Slide Đồ án',
  'Gia sư',
  'Bách Khoa',
  'Tiểu luận',
  'Figma',
];

const QUICK_FILTERS = [
  { id: 'all', label: 'Tất cả Task' },
  { id: 'latest', label: 'Mới nhất', icon: Clock },
  { id: 'verified', label: 'Đã xác minh', icon: ShieldCheck },
  { id: 'urgent', label: 'Hạn gấp (< 48h)' },
  { id: 'online', label: 'Làm Online' },
  { id: 'onsite', label: 'Onsite tại trường' },
];

const UNIVERSITIES = [
  'Toàn quốc',
  'Đại học Bách Khoa Hà Nội',
  'Đại học Kinh Tế Quốc Dân',
  'Đại học Ngoại Thương',
  'Đại học Công Nghệ - ĐHQGHN',
  'Đại học Bách Khoa TP.HCM',
  'Đại học Kinh Tế TP.HCM',
];

export type TaskFilterState = {
  query: string;
  quickFilter: string;
  timeFilter: string;
  trustFilter: string;
  budgetFilter: string;
  universityFilter: string;
};

export type FeaturedTasksSectionProps = {
  tasks?: MockTaskItem[];
  onFilterChange?: (filters: TaskFilterState) => void;
};

export function FeaturedTasksSection({
  tasks = MOCK_FEATURED_TASKS,
  onFilterChange,
}: FeaturedTasksSectionProps) {
  // State bộ lọc giao diện
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [trustFilter, setTrustFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [selectedUniversity, setSelectedUniversity] = useState('Toàn quốc');
  const [currentPage, setCurrentPage] = useState(1);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    activeQuickFilter !== 'all' ||
    timeFilter !== 'all' ||
    trustFilter !== 'all' ||
    budgetFilter !== 'all' ||
    selectedUniversity !== 'Toàn quốc';

  // Xử lý gửi tìm kiếm
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    notifyFilterChange();
  };

  // Chọn tag gợi ý
  const handleTagClick = (tag: string) => {
    const nextTag = searchQuery === tag ? '' : tag;
    setSearchQuery(nextTag);
    setCurrentPage(1);
    notifyFilterChange({ query: nextTag });
  };

  // Đặt lại toàn bộ bộ lọc
  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveQuickFilter('all');
    setTimeFilter('all');
    setTrustFilter('all');
    setBudgetFilter('all');
    setSelectedUniversity('Toàn quốc');
    setCurrentPage(1);
    notifyFilterChange({
      query: '',
      quickFilter: 'all',
      timeFilter: 'all',
      trustFilter: 'all',
      budgetFilter: 'all',
      universityFilter: 'Toàn quốc',
    });
  };

  const notifyFilterChange = (overrides?: Partial<TaskFilterState>) => {
    const current: TaskFilterState = {
      query: searchQuery,
      quickFilter: activeQuickFilter,
      timeFilter,
      trustFilter,
      budgetFilter,
      universityFilter: selectedUniversity,
      ...overrides,
    };
    onFilterChange?.(current);
    // TODO(integration): Nối API danh sách task GET /tasks?q=${query}&deliveryMode=... theo SDD §2.3.1
  };

  // Lắng nghe sự kiện click Logo từ Header/Footer để reset toàn bộ trạng thái về ban đầu (Trang 1, xóa filter)
  useEffect(() => {
    const handleResetHome = () => {
      setSearchQuery('');
      setActiveQuickFilter('all');
      setTimeFilter('all');
      setTrustFilter('all');
      setBudgetFilter('all');
      setSelectedUniversity('Toàn quốc');
      setCurrentPage(1);
      onFilterChange?.({
        query: '',
        quickFilter: 'all',
        timeFilter: 'all',
        trustFilter: 'all',
        budgetFilter: 'all',
        universityFilter: 'Toàn quốc',
      });
    };

    window.addEventListener('vietvi:reset-home', handleResetHome);
    return () => {
      window.removeEventListener('vietvi:reset-home', handleResetHome);
    };
  }, [onFilterChange]);

  // Lọc dữ liệu Mock phục vụ hiển thị UI trực quan
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Lọc theo từ khóa tìm kiếm
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchCat = task.categoryName.toLowerCase().includes(q);
        const matchDesc = task.description?.toLowerCase().includes(q);
        const matchSchool = task.authorSchool?.toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchDesc && !matchSchool) {
          return false;
        }
      }

      // 2. Lọc theo Quick Filter
      if (activeQuickFilter === 'verified' && !task.isVerifiedStudent) return false;
      if (activeQuickFilter === 'online' && !task.isRemote) return false;
      if (activeQuickFilter === 'onsite' && task.isRemote) return false;
      if (
        activeQuickFilter === 'urgent' &&
        !task.deadlineText?.includes('1 ngày') &&
        !task.deadlineText?.includes('2 ngày')
      ) {
        return false;
      }

      // 3. Lọc theo Ngân sách Dropdown
      if (budgetFilter === 'under400k' && task.budget >= 400000) return false;
      if (budgetFilter === '400k-700k' && (task.budget < 400000 || task.budget > 700000))
        return false;
      if (budgetFilter === 'over700k' && task.budget <= 700000) return false;

      // 4. Lọc theo Độ tin cậy Dropdown
      if (trustFilter === 'verified' && !task.isVerifiedStudent) return false;
      if (trustFilter === 'highRating' && (task.authorRating ?? 0) < 4.9) return false;

      // 5. Lọc theo Trường ĐH
      if (selectedUniversity !== 'Toàn quốc') {
        const uniNormalized = selectedUniversity.toLowerCase();
        const authorSchoolNormalized = (task.authorSchool || '').toLowerCase();
        if (
          !authorSchoolNormalized.includes(uniNormalized) &&
          !uniNormalized
            .split(' ')
            .some((word) => word.length > 3 && authorSchoolNormalized.includes(word))
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    tasks,
    searchQuery,
    activeQuickFilter,
    timeFilter,
    trustFilter,
    budgetFilter,
    selectedUniversity,
  ]);

  // Tính tổng số trang (10 trang ở chế độ mock mặc định, hoặc theo filteredTasks)
  const totalPages = useMemo(() => {
    if (hasActiveFilters) {
      return Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
    }
    return 10;
  }, [hasActiveFilters, filteredTasks.length]);

  // Phân trang: hiển thị tối đa 9 công việc cho mỗi trang (lưới 3x3 cân đối)
  const paginatedTasks = useMemo(() => {
    if (filteredTasks.length === 0) return [];
    const start = (currentPage - 1) * PAGE_SIZE;
    const slice = filteredTasks.slice(start, start + PAGE_SIZE);
    if (slice.length === PAGE_SIZE) return slice;

    // Khi có bộ lọc và ở trang cuối có ít hơn 9 task, hiển thị đúng số task đó
    if (slice.length > 0 && hasActiveFilters) return slice;

    // Fallback lặp mock mượt mà để các trang luôn hiển thị đủ 9 card ổn định, không sụp layout
    return Array.from({ length: Math.min(PAGE_SIZE, filteredTasks.length) }, (_, i) => {
      const index = (start + i) % filteredTasks.length;
      const task = filteredTasks[index]!;
      return {
        ...task,
        id: `${task.id}-p${currentPage}-${i}`,
      };
    });
  }, [filteredTasks, currentPage, hasActiveFilters]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);

    // Cuộn êm đến đầu lưới danh sách task (trừ đi khoảng offset của Sticky Header)
    const anchor = document.getElementById('task-grid-top');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="tasks" className="py-12 sm:py-16 bg-[#FAFAFA] border-t border-[#dadbdd] scroll-mt-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Header Block: Tiêu đề + Phụ đề + Bộ đếm Task chuẩn DDESIGN.md */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#222325] tracking-tight">
              Khám phá các Task đang mở
            </h2>
            <p className="mt-1 text-sm text-[#62646a]">
              Tìm kiếm công việc học tập, bài tập lớn, slide thuyết trình và hỗ trợ từ sinh viên
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-[#dadbdd] text-[#62646a] shadow-xs">
              Hiển thị <strong className="mx-1 text-[#222325] font-bold">{paginatedTasks.length}</strong> / {filteredTasks.length} Task
            </span>
          </div>
        </div>

        {/* Thanh tìm kiếm chính (Search Bar chuẩn Input Field 12px DDESIGN.md) */}
        <form onSubmit={handleSearchSubmit} className="relative mb-3.5">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-[#74767e] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhanh theo từ khóa Task, kỹ năng (Canva, Python, Slide...), môn học, trường đại học..."
              aria-label="Tìm kiếm Task nhanh"
              className="w-full h-12 pl-11 pr-28 text-sm text-[#222325] placeholder:text-[#74767e] bg-white border border-[#c5c6c9] hover:border-[#62646a] rounded-[12px] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] shadow-xs transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4 rounded-[8px] bg-[#222325] hover:bg-[#404145] text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              Lọc ngay
            </button>
          </div>
        </form>

        {/* Hàng gợi ý từ khóa (Suggestion Tags) */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-medium text-[#74767e] mr-1">
            Gợi ý phổ biến:
          </span>
          {SUGGESTION_TAGS.map((tag) => {
            const isSelected = searchQuery === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border',
                  isSelected
                    ? 'bg-[#222325] text-white border-[#222325]'
                    : 'bg-white text-[#404145] border-[#dadbdd] hover:border-[#1dbf73] hover:text-[#1dbf73]'
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Khung bộ lọc trắng (Filter Panel Card - 16px radius, Mist border) */}
        <div className="bg-white rounded-[16px] border border-[#dadbdd] p-4 sm:p-5 shadow-xs mb-8 space-y-4">
          {/* Tầng 1: Hàng Pills phân loại nhanh */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_FILTERS.map((f) => {
              const Icon = f.icon;
              const isActive = activeQuickFilter === f.id;

              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    const next = isActive && f.id !== 'all' ? 'all' : f.id;
                    setActiveQuickFilter(next);
                    setCurrentPage(1);
                    notifyFilterChange({ quickFilter: next });
                  }}
                  className={cn(
                    'shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border',
                    isActive
                      ? 'bg-[#222325] text-white border-[#222325]'
                      : 'bg-white text-[#404145] border-[#dadbdd] hover:border-[#62646a] hover:text-[#222325]'
                  )}
                >
                  {Icon && <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-white' : 'text-[#74767e]')} />}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tầng 2: Cụm Dropdown 4 cột đồng đều, căn chỉnh sắc nét */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-3 border-t border-[#dadbdd]">
            {/* 1. Thời gian đăng */}
            <div>
              <label htmlFor="filter-time" className="block text-xs font-semibold text-[#404145] mb-1.5">
                Thời gian đăng
              </label>
              <div className="relative">
                <select
                  id="filter-time"
                  value={timeFilter}
                  onChange={(e) => {
                    setTimeFilter(e.target.value);
                    setCurrentPage(1);
                    notifyFilterChange({ timeFilter: e.target.value });
                  }}
                  aria-label="Chọn thời gian đăng"
                  className="w-full h-11 appearance-none bg-white border border-[#c5c6c9] hover:border-[#62646a] rounded-[12px] px-3.5 pr-8 text-xs font-medium text-[#222325] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] cursor-pointer transition-colors"
                >
                  <option value="all">Mọi thời điểm</option>
                  <option value="24h">24 giờ qua</option>
                  <option value="3d">3 ngày qua</option>
                  <option value="7d">7 ngày qua</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74767e] pointer-events-none" />
              </div>
            </div>

            {/* 2. Độ tin cậy */}
            <div>
              <label htmlFor="filter-trust" className="block text-xs font-semibold text-[#404145] mb-1.5">
                Độ tin cậy người đăng
              </label>
              <div className="relative">
                <select
                  id="filter-trust"
                  value={trustFilter}
                  onChange={(e) => {
                    setTrustFilter(e.target.value);
                    setCurrentPage(1);
                    notifyFilterChange({ trustFilter: e.target.value });
                  }}
                  aria-label="Chọn độ tin cậy người đăng"
                  className="w-full h-11 appearance-none bg-white border border-[#c5c6c9] hover:border-[#62646a] rounded-[12px] px-3.5 pr-8 text-xs font-medium text-[#222325] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] cursor-pointer transition-colors"
                >
                  <option value="all">Tất cả người yêu cầu</option>
                  <option value="verified">Đã xác minh</option>
                  <option value="highRating">Đánh giá cao (≥ 4.9★)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74767e] pointer-events-none" />
              </div>
            </div>

            {/* 3. Ngân sách */}
            <div>
              <label htmlFor="filter-budget" className="block text-xs font-semibold text-[#404145] mb-1.5">
                Mức ngân sách
              </label>
              <div className="relative">
                <select
                  id="filter-budget"
                  value={budgetFilter}
                  onChange={(e) => {
                    setBudgetFilter(e.target.value);
                    setCurrentPage(1);
                    notifyFilterChange({ budgetFilter: e.target.value });
                  }}
                  aria-label="Chọn mức ngân sách"
                  className="w-full h-11 appearance-none bg-white border border-[#c5c6c9] hover:border-[#62646a] rounded-[12px] px-3.5 pr-8 text-xs font-medium text-[#222325] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] cursor-pointer transition-colors"
                >
                  <option value="all">Mọi mức giá</option>
                  <option value="under400k">Dưới 400.000 ₫</option>
                  <option value="400k-700k">400.000 ₫ - 700.000 ₫</option>
                  <option value="over700k">Trên 700.000 ₫</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74767e] pointer-events-none" />
              </div>
            </div>

            {/* 4. Trường ĐH */}
            <div>
              <label htmlFor="filter-university" className="block text-xs font-semibold text-[#404145] mb-1.5">
                Trường đại học
              </label>
              <div className="relative">
                <select
                  id="filter-university"
                  value={selectedUniversity}
                  onChange={(e) => {
                    setSelectedUniversity(e.target.value);
                    setCurrentPage(1);
                    notifyFilterChange({ universityFilter: e.target.value });
                  }}
                  aria-label="Chọn trường đại học"
                  className="w-full h-11 appearance-none bg-white border border-[#c5c6c9] hover:border-[#62646a] rounded-[12px] px-3.5 pr-8 text-xs font-medium text-[#222325] focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] cursor-pointer transition-colors"
                >
                  {UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74767e] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Dòng tóm tắt trạng thái lọc & Nút Đặt lại */}
          <div className="flex items-center justify-between text-xs text-[#74767e] pt-1">
            <span>
              Đang hiển thị <strong className="font-semibold text-[#222325]">{paginatedTasks.length}</strong> / {filteredTasks.length} kết quả phù hợp
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-[#1dbf73] hover:text-[#19a463] font-semibold cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa tất cả bộ lọc</span>
              </button>
            )}
          </div>
        </div>

        {/* Điểm neo cuộn êm cho phân trang (tránh giật màn hình và cấn sticky header) */}
        <div id="task-grid-top" className="scroll-mt-28" />

        {/* Lưới hiển thị danh sách Task (Khóa min-height để chống sụp layout khi chuyển trang) */}
        {paginatedTasks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-[600px] content-start">
              {paginatedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {/* Thanh chuyển trang (Pagination) chuẩn theo thiết kế tham khảo */}
            {totalPages > 1 && (
              <nav
                aria-label="Điều hướng phân trang"
                className="flex items-center justify-center gap-4 sm:gap-6 md:gap-7 mt-12 select-none"
              >
                {/* Nút Prev (←) */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Trang trước"
                  className={cn(
                    'w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition-all shrink-0',
                    currentPage === 1
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white'
                      : 'border-[#dadbdd] hover:border-[#222325] text-[#404145] hover:text-[#222325] bg-white cursor-pointer shadow-xs'
                  )}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {/* Danh sách các số trang 1..10 */}
                <div className="flex items-center gap-5 sm:gap-6 md:gap-7 overflow-x-auto scrollbar-none px-1 py-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    const isActive = page === currentPage;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'min-w-[20px] py-1 text-sm sm:text-[15px] transition-colors cursor-pointer relative',
                          isActive
                            ? 'font-bold text-[#222325]'
                            : 'font-semibold text-[#74767e] hover:text-[#222325]'
                        )}
                      >
                        <span>{page}</span>
                        {isActive && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#222325] rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Nút Next (→) */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Trang sau"
                  className={cn(
                    'w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition-all shrink-0',
                    currentPage === totalPages
                      ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white'
                      : 'border-[#dadbdd] hover:border-[#222325] text-[#404145] hover:text-[#222325] bg-white cursor-pointer shadow-xs'
                  )}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </>
        ) : (
          /* Trạng thái trống (Empty State) chuẩn DDESIGN.md & AGENTS.md §6 */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-[16px] border border-[#dadbdd] shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#dadbdd] flex items-center justify-center text-[#74767e] mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#222325]">
              Không tìm thấy task phù hợp với bộ lọc
            </h3>
            <p className="mt-1.5 text-sm text-[#74767e] max-w-md">
              Hãy thử tìm kiếm với từ khóa khác, thay đổi tiêu chí hoặc đặt lại bộ lọc để xem toàn bộ danh sách công việc.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResetFilters}
              className="mt-5 h-9 px-4 rounded-[8px] border-[#1dbf73] text-[#1dbf73] hover:bg-[#1dbf73] hover:text-white font-semibold text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>Đặt lại bộ lọc</span>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
