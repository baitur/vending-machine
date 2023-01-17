import React, { Component } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductService from '../services/product.service';
import AuthService from '../services/auth.service';


function withParams(Component) {
  return props => <Component {...props} params={useParams()}/>;
}

type Props = {
  params: any;
};

type State = {
  product: any,
  loading: boolean,
  redirect: string | null,
}

class ProductComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirect: null,
      product: null,
      loading: false,
    };
  }

  async componentDidMount() {
    const currentUser = await AuthService.getCurrentUser();

    if (!currentUser || currentUser.user.role !== 'seller') {
      this.setState({ redirect: '/home' });
    } else {
      this.setState({ loading: true });
      const product = await ProductService.one(this.props.params.id);

      this.setState({ product, loading: false });
    }
  }

  render() {
    const { loading, product } = this.state;

    return (
      <div className="container">
        {loading && (
          <span className="spinner-border spinner-border-sm"/>
        )}

        {product && (
          <>
            <h3>
              {product.productName}
              <div className="float-right">
                {!product.isPublished ? (
                  <Link to={'/edit/' + product.id} type="button" className="btn btn-primary btn-lg px-4 gap-3">
                    Edit Product
                  </Link>
                ) : (
                  <span className="badge bg-primary text-white float-right">
                      {process.env['REACT_APP_FRONTEND_URL'] + 'q/' + product.permalink}
                  </span>
                )
                }
              </div>
            </h3>

            <p><strong>Cost:</strong> {product.cost}</p>
            <p><strong>Amount available:</strong> {product.amountAvailable}</p>
          </>
        )}
      </div>
    );
  }
}

export default withParams(ProductComponent);
