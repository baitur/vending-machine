import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env['REACT_APP_BACKEND_URL'] + 'api/';

export class VendingService {
  reset() {
    return axios.get(API_URL + 'reset', { headers: authHeader() }).then(res => res.data);
  }

  deposit(coin: number) {
    return axios.post(API_URL + 'deposit', { coin },  { headers: authHeader() }).then(res => res.data);
  }

  buy(productId: number, amount: number) {
    return axios.post(API_URL + 'buy', { productId, amount },  { headers: authHeader() }).then(res => res.data);
  }
}

export default new VendingService();
