import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env['REACT_APP_BACKEND_URL'] + 'api/users/';

export class UserService {
  me() {
    return axios.get(API_URL + 'me', { headers: authHeader() }).then(res => res.data);
  }
}

export default new UserService();
