import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import ProductService from '../services/product.service';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import VendingService from '../services/vending.service';


function withParams(Component) {
  return props => <Component {...props} params={useParams()}/>;
}

type Props = {};

type State = {
  products: any,
  loading: boolean,
  redirect: string | null,
  currentUser: any | undefined,
  coin: number;
  productId: number;
  amount: number;
  maxAmount: number;
}

const coinsArr = [5, 10, 20, 50, 100];

class VendingComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirect: null,
      products: null,
      loading: false,
      currentUser: null,
      coin: 5,
      productId: 0,
      amount: 1,
      maxAmount: 0,
    };
  }

  async componentDidMount() {
    const currentUser = await AuthService.getCurrentUser();

    if (!currentUser || currentUser.user.role !== 'buyer') {
      this.setState({ redirect: '/home' });
    } else {
      await this.load();
    }
  }

  render() {
    const { loading, products, currentUser, amount, maxAmount } = this.state;
    const balance = currentUser && currentUser.deposit;
    console.log(this.state);


    return (
      <div className="container">
        {loading && (
          <span className="spinner-border spinner-border-sm"/>
        )}

        {products && (
          <>
            <h2>Vending machine</h2>
            <div className="jumbotron">
              <h4>Balance: {balance}c.
                <div className="float-right">
                  <button className="btn btn-primary px-4 gap-3" onClick={() => {
                    this.reset();
                  }}>Reset
                  </button>
                </div>
              </h4>

              <div style={{ marginTop: 40, marginBottom: 40 }}>
                <div className="input-group">
                  <select style={{ width: 400, marginRight: 20 }} className="form-select form-control"
                          aria-label="Add deposit"
                          onChange={(e) => {
                            this.setState({ coin: parseInt(e.target.value, 10) });
                          }}>
                    {coinsArr.map(coin => (
                      <option key={`coin_${coin}`} value={coin}>{coin}c</option>
                    ))}
                  </select>
                  <button className="btn btn-primary" type="button" onClick={async () => {
                    await this.deposit();
                  }}> Deposit amount
                  </button>
                </div>
              </div>

              {products.length > 0 ? (
                <div>
                  <div className="input-group">
                    <select style={{ width: 400, marginRight: 20 }} className="form-select form-control"
                            aria-label="Buy product"
                            onChange={(e) => {
                              this.setState({ productId: parseInt(e.target.value, 10) });
                            }}>
                      {products.map(product => (
                        <option key={`product_${product.id}`} value={product.id}>
                          {product.productName} | Price: {product.cost}c. Available: {product.amountAvailable}
                        </option>
                      ))}
                    </select>

                    {maxAmount > 0 && (
                      <input type="number" min={1} max={maxAmount}
                             className="form-control" aria-label="amount" value={amount} placeholder="amount"
                             style={{ marginRight: 20 }} onChange={(e) => {
                        this.setState({ amount: parseInt(e.target.value, 10) });
                      }}/>
                    )}
                    <button className="btn btn-primary" type="button" onClick={async () => {
                      await this.buy();
                    }}> Buy
                    </button>
                  </div>
                </div>
              ) : (
                <h4>No products available to buy</h4>
              )}
            </div>
          </>
        )}
      </div>
    );
  }


  private async load() {
    this.setState({ loading: true });
    const products = (await ProductService.all()).filter(p => p.amountAvailable > 0);
    const productId = products.length > 0 ? products[0].id : 0;
    const maxAmount = productId == 0 ? 0 : products[0].amountAvailable;
    const me = await UserService.me();
    this.setState({ products, maxAmount, productId, loading: false, currentUser: me });
  }

  private reset() {
    this.setState({ loading: true });
    VendingService.reset().then(({ balance }) => {
      this.setState({ loading: false });
      this.renderBalance('You have returned your deposit.', balance);
    });
  }

  private async deposit() {
    const { coin } = this.state;
    await VendingService.deposit(coin);
    await this.load();
  }

  private async buy() {
    try {
      const { productId, amount } = this.state;
      const { change } = await VendingService.buy(productId, amount);
      await this.load();
      this.renderBalance('Product purchased.', change);
    } catch (e) {
      alert(e.response.data.message || e.message);
    }
  }

  private renderBalance(message: string, balance: number[]) {
    const coins = coinsArr.map((coin, index) => `${coin}c: ${balance[index]}`).join('\n');

    alert(`${message}\n\nYou've got coins back:\n${coins}`);
  }
}

export default withParams(VendingComponent);
