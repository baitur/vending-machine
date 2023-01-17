import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import IUser from '../types/user.type';
import AuthService from '../services/auth.service';

type Props = {};

type State = {
  currentUser: IUser | undefined
}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
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
  }

  render() {
    const role = this.state.currentUser && this.state.currentUser.user.role;
    return (
      <div className="container">
        <div className="px-4 py-5 my-5 text-center">
          <h1 className="display-5 fw-bold">Vending Machine App</h1>
          <div className="col-lg-6 mx-auto">
            <p className="lead mb-4">A test task from Yerlan Baiturinov.</p>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              {role == 'buyer' && (
                <Link to={'/vending'} type="button" className="btn btn-primary btn-lg px-4 gap-3">
                  Start
                </Link>
              )}

              {role == 'seller' && (
                <Link to={'/product'} type="button" className="btn btn-primary btn-lg px-4 gap-3">
                  My Products
                </Link>
              )}

              {!role && (
                <Link to={'/login'} type="button" className="btn btn-primary btn-lg px-4 gap-3">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
