import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Product0 = 0;

const Product = (props) => (

  <tr>
    <td>{props.product.ProductID}</td>
    <td>{props.product.Name}</td>
    <td>{props.product.ManufacturerID}</td>
    <td>{props.product.Date.ManufactureDate.substring(0, 10)}</td>
    <td>{props.product.Date.SendToWholesalerDate.substring(0, 10)}</td>
    <td>{props.product.Date.SendToDistributorDate.substring(0, 10)}</td>
    <td>{props.product.Date.SendToRetailerDate.substring(0, 10)}</td>
    <td>{props.product.Date.SellToConsumerDate.substring(0, 10)}</td>
    <td>{props.product.Status}</td>
    <td>{props.product.Price}</td>
    { (sessionStorage.getItem('userType') === "manufacturer") ? 
    <td class="">
    <Link to={"/product/edit/" + props.product.ProductID}>Edit</Link>

    </td>:""}
    <td class="">
    <Link to={"/product/send/" + props.product.ProductID}>Send</Link>

    </td>
  </tr>
);

export class ProductsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      role: sessionStorage.getItem('role'),
      //role: "manufacturer",
      products: [],
    };

    this.setState({
      role: sessionStorage.getItem('role'),
    });
  }

  componentDidMount() {
    const headers = {
      "x-access-token": sessionStorage.getItem('jwtToken')
      // "id": "User1"
    };
    const signIn = {
      id: this.state.name,
      password: this.state.password,
    };
    const userType = sessionStorage.getItem('userType');
    if(userType){
      axios
        .get("http://localhost:8090/product/manufacturer", {headers: headers})
        .then((response) => {
          this.setState({
            products: response.data.data,
          });
        })
        .catch((error) => console.log(error));
    }
  }

  productsList() {
    return this.state.products.map((currentProduct) => {
      return (
        <Product
          product={currentProduct.Record}
          deleteProduct={this.deleteProduct}
          key={currentProduct.Key}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <h3>Products List</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>ProductId</th>
              <th>ProductName</th>
              <th>ManufacturerId</th>
              <th>ManufacturerDate</th>
              <th>SendToWholesalerDate</th>
              <th>SendToDistributorDate</th>
              <th>SendToRetailerDate</th>
              <th>SellToConsumerDate</th>
              <th>Status</th>
              <th>Price</th>
              { (sessionStorage.getItem('userType') === "manufacturer") ? 
              <th colSpan={2}>Actions</th>:<th>Actions</th>}
            </tr>
          </thead>
          <tbody>{this.productsList()}</tbody>
        </table>
      </div>
    );
  }
}

export default ProductsList;
