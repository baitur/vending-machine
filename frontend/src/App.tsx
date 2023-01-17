import { Component } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AuthService from './services/auth.service';
import IUser from './types/user.type';

import Login from './components/login.component';
import Register from './components/register.component';
import Home from './components/home.component';
import Profile from './components/profile.component';

import EventBus from './common/EventBus';
import Products from './components/products.component';
import ProductComponent from './components/product.component';
import EditProductComponent from './components/edit-product.component';

type Props = {};

type State = {
  showModeratorBoard: boolean,
  showAdminBoard: boolean,
  currentUser: IUser | undefined
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }

    EventBus.on('logout', this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove('logout', this.logOut);
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={'/'} className="navbar-brand">
            Vending Machine App
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={'/home'} className="nav-link">
                Home
              </Link>
            </li>

            {currentUser && currentUser.user.role == 'seller' && (
              <li className="nav-item">
                <Link to={'/products'} className="nav-link">
                  Products
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={'/profile'} className="nav-link">
                  {currentUser.user.full_name}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={'/login'} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={'/register'} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/products" element={<Products/>}/>
            <Route path="/product/:id" element={<ProductComponent/>}/>
            <Route path="/edit/:id" element={<EditProductComponent/>}/>
            <Route path="/create" element={<EditProductComponent/>}/>
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
