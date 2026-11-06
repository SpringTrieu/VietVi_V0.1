import type { DashboardUIState, DashboardViewData } from '../types.placeholder';

export type DashboardScreenProps = {
  state?: DashboardUIState;
  data?: DashboardViewData;
};

export function DashboardScreen({ state = 'ready' }: DashboardScreenProps) {
  // Tuân thủ nghiêm ngặt chỉ đạo: Không tạo bất kỳ section nào, để trống hoàn toàn giữa Header và Footer
  return <div className="w-full min-h-[60vh]" data-state={state} />;
}

