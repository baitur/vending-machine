import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import IUser from '../types/user.type';

type Props = {};

type State = {
  redirect: string | null,
  userReady: boolean,
  currentUser: IUser & { access_token: string }
}
export default class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { access_token: '', user: {} },
    };
  }

  async componentDidMount() {
    const currentUser = await AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: '/home' });
    this.setState({ currentUser: currentUser, userReady: true });
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect}/>;
    }

    const { currentUser } = this.state;

    return (
      <div className="container">
        {(this.state.userReady) ?
          <div>
            <header className="jumbotron">
              <h3>
                <strong>{currentUser.user.full_name}</strong> Profile
              </h3>
            </header>
            <p>
              <strong>Token:</strong>{' '}
              {currentUser.access_token.substring(0, 20)} ...{' '}
              {currentUser.access_token.substr(currentUser.access_token.length - 20)}
            </p>
            <p>
              <strong>Id:</strong>{' '}
              {currentUser.user.id}
            </p>
            <p>
              <strong>Email:</strong>{' '}
              {currentUser.user.email}
            </p>
            <strong>Authorities:</strong>
            <ul>
              {currentUser.user.role &&
              <li>{currentUser.user.role}</li>
              }
            </ul>
          </div> : null}
      </div>
    );
  }
}
