import React, { useState, useEffect } from "react";
import { firebase } from "../services/firebase";
import { CreateUser, passwordReset, SigninUser } from "../services/authServices";
import { Redirect } from "react-router-dom";
// import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  FormGroup,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Container,
  Row,
  Col,
  Modal,
  // NavbarToggler,
  ModalHeader,
} from "reactstrap";

function Start(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [modalSearch, setmodalSearch] = React.useState(false);

  const toggleModalSearch = () => {
    setmodalSearch(!modalSearch);
  };

  // useEffect(() => {
  //   localStorage.setItem("lang", "en");

  //   firebase.auth().onAuthStateChanged((user) => {
  //     setIsSignedIn(!!user);
  //     //this.setState({ isSignedIn: !!user });
  //     console.log("user", user);
  //     if (isSignedIn) next(user);
  //   });
  // }, []);

  // const next = (user) => {
  //   localStorage.setItem(
  //     "uid",
  //     JSON.stringify(firebase.auth().currentUser.uid)
  //   );
  //   localStorage.setItem("user", JSON.stringify(firebase.auth().currentUser));
  //   props.history.push("/profile");
  // };

  const handleChangeData = (e, type) => {
    if (type === "email") {
      setEmail(e.target.value);
    } else if (type === "password") {
      setPassword(e.target.value);
    } else if (type === "name") {
      setName(e.target.value);
    }
  };

  const onLogin = (e) => {
    e.preventDefault();
    localStorage.clear();
    // const { email, password } = this.state;
    SigninUser(email, password)
      .then((res) => {
        // this.history.push("/admin/home");
        props.history.push("/admin/home");
      })
      .catch((err) => {
        // console.log(err);
        alert(err);
        // this.setState({ error: err.message });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // var pattern = new RegExp(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\? ]/); //unacceptable chars
    localStorage.clear();
    // const {name, email, password } = this.state;
    // console.log(this.state);
    // CreateUser()
    if (name == "" || email == "" || password == "") {
      alert("Please fill in the fields");
    } else {
      CreateUser(name, email, password)
        .then((res) => {
          // console.log(res);
          // this.props.history.push("/admin/home");
          props.history.push("/admin/home");
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const passwordRestEmail=()=>{
    passwordReset(email);
  }

  return (
    <>
      <div
        className="content"
        style={{
          padding: "78px 30px 30px ",
        }}
      >
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <h5 className="title">Log in</h5>
              
              </CardHeader>
              <CardBody className="all-icons">
                <Row style={{ placeContent: "center" }}>
                  <Col
                    className="font-icon-list col-xs-6 col-xs-6"
                    lg="4"
                    md="4"
                    sm="4"
                  >
                    <div
                      className="font-icon-detail"
                      style={{
                        borderRadius: "40px",
                        border: "1px solid #10caff",
                        padding: "10px",
                      }}
                    >
                      <h2
                        style={{
                          color: "#10caff",
                          fontSize: "35px",
                          fontFamily: "system-ui",
                          fontVariant: "all-small-caps",
                        }}
                      >
                        Login
                      </h2>
                      <Form id="formLogin" role="form" onSubmit={onLogin}>
                        <FormGroup className="mb-3">
                          <InputGroup className="input-group-alternative">
                            <Input
                              style={{ border: "1px solid #10caff" }}
                              id="email"
                              placeholder={"Email"}
                              type="email"
                              onChange={(e) => handleChangeData(e, "email")}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <Input
                              style={{ border: "1px solid #10caff" }}
                              id="password"
                              placeholder={"Password"}
                              type="password"
                              autoComplete="off"
                              onChange={(e) => handleChangeData(e, "password")}
                            />
                          </InputGroup>
                        </FormGroup>

                        {/* <div className="text-muted font-italic justify-content-center">
                        <small>
                          <span className="text-danger font-weight-100">
                            {"error"}
                          </span>
                        </small>
                      </div> */}

                        <div className="text-center">
                          <Button
                            className="my-4"
                            // color="primary"
                            style={{ color: "#10caff" }}
                            type="submit"
                            onClick={onLogin}
                          >
                            {"Log in"}
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <p
                style={{ padding: "10px", alignSelf: "center" }}
                className="category"
              >
                New User?{" "}
                <a
                  style={{ color: "rgb(16, 202, 255)" }}
                  href="#"
                  onClick={toggleModalSearch}
                >
                  Register
                </a>
              </p>
            { email?

<p
              style={{ padding: "10px", alignSelf: "center" }}
              className="category"
              >
                <a
                  style={{ color: "rgb(16, 202, 255)" }}
                  href="#"
                  onClick={passwordRestEmail}
                  >
                  Forgot Password?{" "}

                </a>
              </p>
                  :null
                  }
            </Card>
          </Col>
        </Row>
      </div>
      <Modal
        modalClassName="modal-black"
        isOpen={modalSearch}
        toggle={toggleModalSearch}
      >
        <div
          style={{
            padding: "9px 1px 0px 0px",
            borderRadius: " 5px",
          }}
        >
          <h2
            // className="text-dark"
            style={{
              textAlign: "center",
              textShadow: "0 0 black",
            }}
          >
            Register
          </h2>
          <Form id="formLogin" role="form" onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <Input
                  id="name"
                  placeholder={"Name"}
                  type="name"
                  maxLength={18}
                  onChange={(e) => handleChangeData(e, "name")}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <Input
                  id="email"
                  placeholder={"Email"}
                  type="email"
                  onChange={(e) => handleChangeData(e, "email")}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <Input
                  id="password"
                  placeholder={"Password"}
                  type="password"
                  autoComplete="off"
                  onChange={(e) => handleChangeData(e, "password")}
                />
              </InputGroup>
            </FormGroup>

            {/* <div className="text-muted font-italic justify-content-center">
                        <small>
                          <span className="text-danger font-weight-100">
                            {"error"}
                          </span>
                        </small>
                      </div> */}

            <div className="text-center">
              <Button
                className="my-4"
                color="info"
                type="submit"
                onClick={handleSubmit}
              >
                {"Register"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export default Start;
