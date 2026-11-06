/**
 * Định dạng tiền tệ VND số nguyên theo chuẩn nghiệp vụ VIETVI (SDD 4.1 & 8.5)
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

