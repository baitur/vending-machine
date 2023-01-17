import React, { Component } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ProductService from '../services/product.service';
import IUser from '../types/user.type';
import AuthService from '../services/auth.service';


function withParams(Component) {
  return props => <Component {...props} params={useParams()}/>;
}

type Props = {
  params: any;
};

type State = {
  redirect: string,
  currentUser: IUser | undefined
  product: any,
  loading: boolean,
  productName: string,
  amountAvailable: number,
  cost: number,
  id: number
}

class EditProductComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentUser: undefined,
      redirect: null,
      product: {},
      loading: false,
      id: 0,
      cost: 0,
      amountAvailable: 0,
      productName: '',
    };
  }

  async componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    } else {
      this.setState({ redirect: '/login' });
    }

    const id = this.props.params.id || 0;
    if (id) {
      this.setState({ loading: true });
      const product = await ProductService.one(this.props.params.id);
      this.setState({
        product, loading: false,
        productName: product.productName,
        cost: product.cost,
        amountAvailable: product.amountAvailable,
        id,
      });
    }

  }

  render() {
    const { loading, product, productName, amountAvailable, cost, id } = this.state;

    if (this.state.redirect) {
      return <Navigate to={this.state.redirect}/>;
    }

    const isCostInvalid = cost % 5 !== 0;

    return (
      <div className="container">
        {loading && (
          <span className="spinner-border spinner-border-sm"/>
        )}

        {product && (
          <>
            <h3>
              {id === 0 ? 'Create' : 'Edit'} Product
            </h3>
            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <input type="text" className="form-control" placeholder="Name" value={productName}
                     onChange={e => this.setState({
                       productName: e.target.value,
                     })}/>
            </div>

            <div className="mb-3">
              <label className="form-label">Cost</label>
              <input type="text" className={'form-control ' + (isCostInvalid ? 'is-invalid' : '')} placeholder="Cost"
                     value={cost}
                     onChange={e => this.setState({
                       cost: parseInt(e.target.value, 10) || 0,
                     })}/>
              {isCostInvalid && (
                <div className="invalid-feedback">
                  Cost should be dividable by 5.
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Amount Available</label>
              <input type="text" className="form-control" placeholder="Amount available" value={amountAvailable}
                     onChange={e => this.setState({
                       amountAvailable: parseInt(e.target.value, 10) || 0,
                     })}/>
            </div>
            <button type="button" className="btn btn-success" onClick={e => this.save()}>Save</button>
          </>
        )}
      </div>
    );
  }

  private async save() {
    this.setState({ loading: true });
    try {
      const { id, productName, amountAvailable, cost } = this.state;
      let productId = id;
      if (productId > 0) {
        await ProductService.update(productId, { productName, amountAvailable, cost });
      } else {
        const newProduct = await ProductService.create({ productName, amountAvailable, cost });
        productId = newProduct.id;
        this.setState({ id: productId });
      }
      this.setState({ redirect: '/products' });
    } catch (e) {
      if (e.response.data.errors) {
        alert((e.response.data.message || e.message) + '\n\n' + e.response.data.errors.map(i => Object.values(i.constraints).join('\n')).join('\n'));
      } else alert(e.response.data.message || e.message);
    } finally {
      this.setState({ loading: false });
    }


  }
}

export default withParams(EditProductComponent);
