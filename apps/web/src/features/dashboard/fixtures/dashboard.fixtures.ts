import type { DashboardUIState, DashboardViewData } from '../types.placeholder';

export type DashboardScreenFixture = {
  state?: DashboardUIState;
  data?: DashboardViewData;
};

// Fixture mặc định — Trạng thái sẵn sàng nhưng để trống hoàn toàn
export const defaultDashboardFixture: DashboardScreenFixture = {
  state: 'ready',
};

