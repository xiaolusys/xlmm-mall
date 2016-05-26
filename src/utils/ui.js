import { LoadingSpinner } from 'components/Loader';
import { detector } from './detector';
import { plugins } from 'plugins';

export const loadingSpinner = detector.isApp() ? {
  show: () => {
    plugins.invoke({ method: 'showLoading', data: { isLoading: true } });
  },
  hide: () => {
    plugins.invoke({ method: 'showLoading', data: { isLoading: false } });
  },
} : new LoadingSpinner();
