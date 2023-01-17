import axios from 'axios';

const API_URL = process.env['REACT_APP_BACKEND_URL'] + 'api/';


class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + 'login', {
        username,
        password,
      })
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(first_name: string, last_name: string, username: string, email: string, password: string) {
    return axios.post(API_URL + 'users', {
      firstName: first_name,
      lastName: last_name,
      email,
      username,
      password,
    }).then(response => {
      this.login(username, password).then(r => {
          if (response.data.access_token) {
            localStorage.setItem('user', JSON.stringify(response.data));
          }
        },
      );


      return response.data;
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
