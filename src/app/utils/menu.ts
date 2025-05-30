import {
  faBitcoinSign,
  faCoins,
  faHome,
  faMoneyBillTrendUp,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { AppRouter } from './routers';

export const AppMenu = [
  { icon: faHome, label: 'SIDEBAR.HOME', route: AppRouter.Dashboard.Home },
  {
    icon: faMoneyBillTrendUp,
    label: 'SIDEBAR.STOCK_RATE',
    route: '/products',
  },
  {
    icon: faCoins,
    label: 'SIDEBAR.COIN_RATE',
    route: AppRouter.Dashboard.TradeMarket('BTC-USDT'),
  },
  {
    icon: faBitcoinSign,
    label: 'SIDEBAR.DETAIL_INFO',
    route: AppRouter.Dashboard.InfoDetail('BTC-USDT'),
  },
  { icon: faUser, label: 'SIDEBAR.AI_PREDICT', route: '/customers' },
  { icon: faUser, label: 'SIDEBAR.AI_TRADING_BOT', route: '/customers' },
  { icon: faUser, label: 'SIDEBAR.AI_CHAT_BOT', route: '/customers' },
  { icon: faUser, label: 'SIDEBAR.NEWS', route: AppRouter.Dashboard.News },
];
