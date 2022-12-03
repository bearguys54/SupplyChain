import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
//import { sendToWholesaler } from "../../../servers/models/transact";

const User = (props) => (
  <tr>
    <td>{props.user.UserID}</td>
    <td>{props.user.Name}</td>
    <td>{props.user.Email}</td>
    <td>{props.user.UserType}</td>
    <td>{props.user.Address}</td>
  </tr>
);

const WS = (props) => (
  <option
    key={props.user.UserID}
    value={props.user.UserID}
  >
    {props.user.UserID}
  </option>
);

export class EditProduct extends Component {
  constructor(props) {
    super(props);

    this.onChangeWholesalerId = this.onChangeTransactTargetId.bind(this);
    this.beginTransact = this.beginTransact.bind(this);
    this.handleTransactSubmit = this.handleTransactSubmit.bind(this);
    this.transactTargetId = "";
    // this.transactMsg = "Placeholder";

    this.state = {
      //user: { id: sessionStorage.getItem("userId") },
      product_name: "",
      date: {
        manufacturerDate: "",
        sendToWholesalerDate: "",
        sendToDistributorDate: "",
        sendToRetailerDate: "",
        sellToConsumerDate: "",
        orderedDate: "",
        deliveredDate: "",
      },
      manufacturer_id: "",
      distributor_id: "",
      wholesaler_id: "",
      consumer_id: "",
      retailer_id: "",
      status: "",
      price: 0,
      manufacturers: [],
      users: [],
      transactMsg: "Placeholder"
    };

  }

  componentDidMount() {
    //console.log(sessionStorage.getItem("role"));
    axios.get("http://localhost:8090/product/" + this.props.match.params.id + "/" + sessionStorage.getItem("role"))
      .then((response) => {
        this.setState({
          product_name: response.data.data.Name,
          manufacturer_id: response.data.data.ManufacturerID,
          manufacturerDate: response.data.data.Date.ManufacturerDate,
          status: response.data.data.Status,
          price: response.data.data.Price,
        })
        //console.log(response.data);
      })
    axios
      .get("http://localhost:8090/user/all/manufacturer")
      .then((response) => {
        this.setState({
          users: response.data.data,
        });
        //console.log(response.data.data);
      })
      .catch((error) => console.log(error));

    console.log(this.state.wholesaler_id);
  }

  TransactLabel() {
    const currUserType = sessionStorage.getItem("userType");
    if (currUserType === "manufacturer") {
      return "Send to Wholesaler"
    } else if (currUserType === "wholesaler") {
      return "Send to Distributor"
    } else if (currUserType === "distributor") {
      return "Send to Retailer"
    } else if (currUserType === "retailer") {
      return "sell to Custommer"
    }
  }

  handleTransactSubmit(e) {
    e.preventDefault(); console.log('You clicked submit.');
  }

  beginTransact(e) {
    e.preventDefault(); console.log('You clicked submit.');
    console.log("product id: " + this.props.match.params.id);

    const currProduct = {
      id: "admin",
      loggedUserType: sessionStorage.getItem("userType"),
      productId: this.props.match.params.id,
      userId: this.transactTargetId,
    };
    console.log("sending product with: " + currProduct.loggedUserType);

    axios
      .post("http://localhost:8090/transact", currProduct)
      .then((response) => {
        // this.setState({
        //   users: response.data.data,
        // });
        console.log("respond received, " + response.data.data);
        this.setState({
          transactMsg: "Transaction completed",
        });
      })
      .catch((error) => {
        this.setState({
          transactMsg: "Transaction failed",
        });
        console.log("transact failed");
        console.log(error);
      })

  }

  onChangeProductName(e) {
    this.setState({
      product_name: e.target.value,
    });
  }

  onChangePrice(e) {
    this.setState({
      price: e.target.value,
    });
  }

  onChangeManufacturerId(e) {
    console.log("before " + this.state.wholesaler_id)
    this.setState({
      manufacturer_id: e.target.key,
    });
    console.log("after" + this.state.wholesaler_id)
  }

  onChangeTransactTargetId(e) {
    console.log("before" + this.transactTargetId)
    this.transactTargetId = e.target.value;
    this.setState({
      wholesaler_id: this.transactTargetId,
    });
    console.log("after" + this.transactTargetId)
  }

  onChangeManufacturerDate(date) {
    const newDate = { ...this.state.date, manufacturerDate: date };
    this.setState({ date: newDate });
  }

  usersList() {
    return this.state.users.map((currentUser) => {
      return (
        <User
          user={currentUser.Record}
          deleteUser={this.deleteUser}
          key={currentUser.Key}
        />
      );
    });
  }

  usersList() {
    return this.state.users.map((currentUser) => {
      return (
        <User
          user={currentUser.Record}
          deleteUser={this.deleteUser}
          key={currentUser.Key}
        />
      );
    });
  }

  wholesalerList() {
    return this.state.users.map((currentUser) => {
      return (
        <WS
          user={currentUser.Record}
          deleteUser={this.deleteUser}
          key={currentUser.Key}
        />
      );
    });
  }



  render() {
    return (
      <div>
        <h3>Update Product</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>ProductName: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.product_name}
              onChange={this.onChangeProductName}
            />
          </div>
          <div className="form-group">
            <label>ManufacturerID: </label>
            <select
              ref="manufacturerInput"
              required
              className="form-control"
              value={this.state.manufacturer_id}
              onChange={this.onChangeManufacturerId}
            >
              <option
                key={this.state.manufacturer_id}
                value={this.state.manufacturer_id}
              >
                {this.state.manufacturer_id}
              </option>
              {/* {this.state.manufacturers.map(function (manufacturer) {
                return (
                  <option
                    key={manufacturer.user_id}
                    value={manufacturer.user_id}
                  >
                    {manufacturer.user_id}
                  </option>
                );
              })} */}
            </select>
          </div>
          <div className="form-group">
            <label>RetailerID: </label>
            <select
              ref="manufacturerInput"
              required
              className="form-control"
              value={this.state.manufacturer_id}
              onChange={this.onChangeManufacturerId}
            >
              <option
                key={this.state.manufacturer_id}
                value={this.state.manufacturer_id}
              >
                {this.state.manufacturer_id}
              </option>
              {/* {this.state.manufacturers.map(function (manufacturer) {
                return (
                  <option
                    key={manufacturer.user_id}
                    value={manufacturer.user_id}
                  >
                    {manufacturer.user_id}
                  </option>
                );
              })} */}
            </select>
          </div>
          <div className="form-group">
            <label>Manufacturer Date: </label>
            <div>
              <DatePicker
                selected={this.state.date.manufacturerDate}
                onChange={this.onChangeManufacturerDate}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Price: </label>
            <input
              type="number"
              required
              className="form-control"
              value={this.state.price}
              onChange={this.onChangePrice}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Create Product"
              className="btn btn-primary"
            />
          </div>
        </form>

        {/*======================================== This is for user other than manufacturer (move this somewhere later) ================================*/}

        <form onSubmit={this.beginTransact}>
          <h3>{this.TransactLabel()}</h3>
          <div className="form-group">
            <label>{this.TransactLabel()} with ID:</label>
            <select
              // ref="manufacturerInput"
              required
              className="form-control"
              onChange={this.onChangeTransactTargetId}
            >
              {this.wholesalerList()}
            </select>
          </div>
          <div>
            <label>{this.state.transactMsg}</label>
          </div>

          <div className="form-group">
            <button type="submit"
              className="btn btn-primary"
            >Submit</button>
          </div>
        </form>

        <div>
          <h3>Users List</h3>
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th>UserID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Usertype</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>{this.usersList()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default EditProduct;
