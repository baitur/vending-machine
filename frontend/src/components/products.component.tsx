import React, { Component } from 'react';
import ProductService from '../services/product.service';
import { Link, Navigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

type Props = {};

type State = {
  redirect: string | null,
  products: any,
  loading: boolean
}
export default class Products extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirect: null,
      products: null,
      loading: false,
    };
  }

  async componentDidMount() {
    const currentUser = await AuthService.getCurrentUser();

    if (!currentUser || currentUser.user.role !== 'seller') {
      this.setState({ redirect: '/home' });
    } else {
      this.setState({ loading: true });
      const products = await ProductService.my();

      this.setState({ products, loading: false });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect}/>;
    }

    const { loading, products } = this.state;

    return (
      <div className="container">
        {loading && (
          <span className="spinner-border spinner-border-sm"/>
        )}

        {products && (
          <>
            <h3>Products</h3>
            <div className="list-group" style={{ marginBottom: 30 }}>
              {products.map(q => (
                <a key={`product_${q.id}`} href={'product/' + q.id}
                   className="list-group-item list-group-item-action"><strong>{q.productName}</strong> Cost: {q.cost}.
                  Available: {q.amountAvailable}</a>
              ))}
            </div>
          </>
        )}

        <Link to={'/create'} type="button" className="btn btn-primary btn-lg px-4 gap-3">
          Create Product
        </Link>
      </div>
    );
  }
}
