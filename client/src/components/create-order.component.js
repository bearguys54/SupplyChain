import React, { Component } from 'react';
import axios from "axios";
const Products = (props) => (
  <option
    key={props.product.ProductID}
    value={props.product.ProductID}
  >
    {props.product.Name}
  </option>
);

export class CreateOrder extends Component {
  constructor(props) {
    super(props);
    this.onSubmit= this.onSubmit.bind(this);
    this.currproductId="";
    this.state = {
      products:[],
    };
  }
  onChangeProductName(e) {
    console.log("before" + this.currproductId)
    this.currproductId = e.target.value;
    
    console.log("after" + this.currproductId)
  }
  componentDidMount() {
    const headers = {
      "x-access-token": sessionStorage.getItem('jwtToken')
      // "id": "User1"
    };
    axios
        .get("http://localhost:8090/product/manufacturer", {headers: headers})
        .then((response) => {
          this.setState({
            products:response.data.data,
          });
        })
        .catch((error) => console.log(error));
  }

  ProductList() {
    return this.state.products.map((currentProduct) => {
      return (
        <Products
          product={currentProduct.Record}
          deleteProduct={this.deleteUser}
          key={currentProduct.Key}
        />
      );
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    const order = {
      user_id:sessionStorage.getItem("userId"),
      currproductId: this.currproductId,
    };
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };
    await axios
      .put("http://localhost:8090/transact/order/" + sessionStorage.getItem("role"), order, {
        headers: headers,
      })
      .then((res) => console.log(res));

    window.location = "/products";
  }

  render() {
    return (
      <div>
        <h3>Create Order</h3>
        <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Product Name: </label>
              <select
                ref="manufacturerInput"
                required
                className="form-control"
                value={this.state.product_name}
                onChange={this.onChangeProductName}
              >
                {this.ProductList()}
              </select>
            </div>
            <div className="form-group">
              <input
                type="submit"
                value="Order Product"
                className="btn btn-primary"
              />
            </div>
          </form>
        </div>
    )
  }
}

export default CreateOrder
