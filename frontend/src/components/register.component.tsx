import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import AuthService from '../services/auth.service';
import { Navigate } from 'react-router-dom';

type Props = {};

type State = {
  first_name: string,
  last_name: string,
  email: string,
  username: string,
  password: string,
  successful: boolean,
  message: string,
  redirect: string | null,
};

export default class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      successful: false,
      message: '',
      redirect: null,
    };
  }

  validationSchema() {
    return Yup.object().shape({
      first_name: Yup.string()
        .test(
          'len',
          'The First name must be between 2 and 20 characters.',
          (val: any) =>
            val &&
            val.toString().length >= 2 &&
            val.toString().length <= 20,
        )
        .required('This field is required!'),
      last_name: Yup.string()
        .test(
          'len',
          'The Last name must be between 2 and 20 characters.',
          (val: any) =>
            val &&
            val.toString().length >= 2 &&
            val.toString().length <= 20,
        )
        .required('This field is required!'),
      email: Yup.string()
        .email('This is not a valid email.')
        .required('This field is required!'),
      password: Yup.string()
        .test(
          'len',
          'The password must be between 6 and 40 characters.',
          (val: any) =>
            val &&
            val.toString().length >= 6 &&
            val.toString().length <= 40,
        )
        .required('This field is required!'),
    });
  }

  handleRegister(formValue: { first_name: string; last_name: string; username: string; email: string; password: string }) {
    const { first_name, last_name, email, username, password } = formValue;

    this.setState({
      successful: false,
    });

    AuthService.register(
      first_name,
      last_name,
      username,
      email,
      password,
    ).then(
      response => {
        this.setState({
          successful: true,
          redirect: '/home',
        });

      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          successful: false,
          message: resMessage,
        });
      },
    );
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect}/>;
    }

    const { successful, message } = this.state;

    const initialValues = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    };

    return (
      <div className="col-md-12 text-center">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleRegister}
          >
            <Form>
              {!successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="first_name"> First name </label>
                    <Field name="first_name" type="text" className="form-control"/>
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="last_name"> First name </label>
                    <Field name="last_name" type="text" className="form-control"/>
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="username"> Username </label>
                    <Field name="username" type="username" className="form-control"/>
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email"> Email </label>
                    <Field name="email" type="email" className="form-control"/>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password"> Password </label>
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                  </div>
                </div>
              )}

              {message && (
                <div className="form-group">
                  <div
                    className={
                      successful ? 'alert alert-success' : 'alert alert-danger'
                    }
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
        <a className="link-primary" href="/login">Login</a>
      </div>
    );
  }
}
