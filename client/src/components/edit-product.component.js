import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export class EditProduct extends Component {
  constructor(props) {
    super(props);

    this.onChangeProductName = this.onChangeProductName.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeManufacturerDate = this.onChangeManufacturerDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
        loggedUserType:sessionStorage.getItem("UserType"),
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
    };
  }
  componentDidMount() {
    axios.get("http://localhost:8090/product/" + this.props.match.params.id+"/"+sessionStorage.getItem("role"))
    .then((response) => {
      this.setState({
        product_name: response.data.data.Name,
        manufacturer_id: response.data.data.ManufacturerID,
        manufacturerDate: response.data.data.Date.ManufacturerDate,
        status: response.data.data.Status,
        price: response.data.data.Price,
      })
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
    this.setState({
      manufacturer_id: e.target.value,
    });
  }

  onChangeManufacturerDate(date) {
    const newDate = { ...this.state.date, manufacturerDate: date };
    this.setState({ date: newDate });
  }

  async onSubmit(e) {
    e.preventDefault();
    const product = {
        id: sessionStorage.getItem("userId"),
        name: this.state.product_name,
        price: this.state.price,
        loggedUserType:sessionStorage.getItem("userType")
      };
    const headers = {
      "x-access-token": sessionStorage.getItem("jwtToken"),
    };
    await axios
      .put("http://localhost:8090/product/" + this.props.match.params.id+"/" + sessionStorage.getItem("role"), product, {
        headers: headers,
      })
      .then((res) => console.log(res));

    window.location = "/products";
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
              value="Update Product"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default EditProduct;
