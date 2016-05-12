import moment from 'moment';
import number from './number';

class Timer {

  getTimeRemaining(endDateString) {
    const totals = Date.parse(moment(endDateString)) - Date.parse(moment());
    const seconds = Math.floor((totals / 1000) % 60);
    const minutes = Math.floor((totals / 1000 / 60) % 60);
    const hours = Math.floor((totals / (1000 * 60 * 60)) % 24);
    const days = Math.floor(totals / (1000 * 60 * 60 * 24));
    return {
      totals: totals,
      days: number.prefixInteger(days, 2),
      hours: number.prefixInteger(hours, 2),
      minutes: number.prefixInteger(minutes, 2),
      seconds: number.prefixInteger(seconds, 2),
    };
  }

}

export default new Timer();
