import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env['REACT_APP_BACKEND_URL'] + 'api/products/';

class ProductService {
  all() {
    return axios.get(API_URL, { headers: authHeader() }).then(res => res.data);
  }

  my() {
    return axios.get(API_URL + 'my', { headers: authHeader() }).then(res => res.data);
  }

  one(id: string) {
    return axios.get(API_URL + id, { headers: authHeader() }).then(res => res.data);
  }

  update(id, body: any) {
    return axios.put(API_URL + id, body, { headers: authHeader() }).then(res => res.data);
  }

  create(body: any) {
    return axios.post(API_URL, body, { headers: authHeader() }).then(res => res.data);
  }
}

export default new ProductService();
