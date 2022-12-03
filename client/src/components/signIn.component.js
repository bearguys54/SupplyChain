import React, { Component } from "react";
import axios from "axios";

import '../assets/scss/signin.css';

export class SignIn extends Component {
  constructor(props) {
    super(props);

    this.onChangeUserType = this.onChangeUserType.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      userType: "",
      name: "",
      password: "",
      role: "manufacturer",
    };
  }

  onChangeUserType(e) {
    if (e.target.value === "admin") {
      this.setState({
        role: "admin",
      });
    } else if (e.target.value === "manufacturer") {
      this.setState({
        role: "manufacturer",
      });
    } else if (e.target.value === "consumer") {
      this.setState({
        role: "consumer",
      });
    } else if (
      e.target.value === "wholesaler" ||
      e.target.value === "distributor" ||
      e.target.value === "retailer"
    ) {
      this.setState({
        role: "middlemen",
      });
    }
    this.setState({
      userType: e.target.value,
    });
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    const signIn = {
      id: this.state.name,
      password: this.state.password,
    };
    console.log(signIn);


    await axios
      .post("http://localhost:8090/user/signin/" + this.state.role, signIn)
      .then((res) => {
        console.log(res.data.data);
        //sessionStorage.clear();
        sessionStorage.setItem("jwtToken", res.data.data.accessToken);
        sessionStorage.setItem("role", this.state.role);
        sessionStorage.setItem("userType", res.data.data.UserType);
        // sessionStorage.setItem("detailUserType", res.data.data.UserType);
        sessionStorage.setItem("userId", res.data.data.id);
        this.userType = res.data.data.UserType;
        this.role = res.data.data.id;
      });
    console.log("logged in as: "+sessionStorage.getItem("userType"), sessionStorage.getItem("userId"));
    //console.log(this.userType,this.role);
    //if (this.state.usertype === "admin") {
    window.location = "/users";
    //}
    // else {
    //   window.location = "/products"
    // }
    // switch (this.state.userType) {
    //     case "admin":
    //         console.log("admin");
    //         window.location = "/users"
    //         break;
    //     case "manufacturer":
    //         console.log("manufacturer");
    //         window.location = "/products"
    //         break;
    //     case "middlemen":
    //         console.log("middlemen");
    //         window.location = "/products"
    //         break;
    //     case "consumer":
    //         console.log("consumer");
    //         window.location = "/products"
    //         break;
    //     default:
    //         break;
    // }

  }

  render() {
    return (
      <div class="container" id="signIn">
        <div class="row">
          <div class="col-lg-3 col-md-2"></div>
          <div class="col-lg-6 col-md-8 login-box">
            <div class="col-lg-12 login-key">
              <i class="fa fa-key" aria-hidden="true"></i>
            </div>
            <div class="col-lg-12 login-title">
              Sign-In
            </div>

            <div class="col-lg-12 login-form">
              <div class="col-lg-12 login-form">
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label>Usertype: </label>
                    <select
                      ref="usertypeInput"
                      required
                      className="form-control"
                      value={this.state.userType}
                      onChange={this.onChangeUserType}>
                      <option key="admin" value="admin">
                        Admin
                      </option>
                      <option key="manufacturer" value="manufacturer">
                        Manufacturer
                      </option>
                      <option key="distributor" value="distributor">
                        Distributor
                      </option>
                      <option key="wholesaler" value="wholesaler">
                        Wholesaler
                      </option>
                      <option key="retailer" value="retailer">
                        Retailer
                      </option>
                      <option key="consumer" value="consumer">
                        Consumer
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-control-label">USERNAME</label>
                    <input onChange={this.onChangeName} type="text" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label class="form-control-label">PASSWORD</label>
                    <input onChange={this.onChangePassword} type="password" class="form-control" />
                  </div>

                  <div class="col-lg-12 loginbttm">
                    <div class="col-lg-6 login-btm login-text">
                    </div>
                    <div class="col-lg-6 login-btm login-button">
                      <button type="submit" class="btn btn-outline-primary">LOGIN</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="col-lg-3 col-md-2"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignIn;
