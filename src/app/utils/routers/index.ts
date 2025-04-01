import { authRoute } from './auth';
import { dashboardRoute } from './dashboard';

export const AppRouter = {
  Auth: new authRoute(),
  Dashboard: new dashboardRoute(),
};
