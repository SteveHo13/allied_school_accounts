import React, { useState, useEffect } from "react";
import { firebase } from "../services/firebase";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  CardTitle,
  Table,
  Row,
  Col,
  Alert,
  Button,
  FormGroup,
  Form,
  Input,
  InputGroup,
  Label,
  TabContent,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CardText,
} from "reactstrap";
import classnames from "classnames";
import LoaderSpinner from "react-loader-spinner";
import SubCategoryComponent from "./SubCategoryComponent";

function TableComponent(headName, nature) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null);
  const [netHead, setNetHead] = useState(0);
  const [head, setHead] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState(null);
  const [subCategoryBool, setSubCategoryBool] = useState(null);
  const [subTypes, setSubTypes] = useState([""]);
  var sub = [];

  const [netSubHead, setnetSubHead] = useState(0);
  const [subHead, setsubHead] = useState(null);

  useEffect(() => {
    const head1 = [];
    var netHead1 = 0;
    var netHead2 = 0;
    firebase
      .firestore()
      .collection("users")
      .doc(JSON.parse(localStorage.getItem("uid")))
      .get()
      .then((doc) => {
        setName(doc.data().name);
        firebase
          .firestore()
          .collection(headName) //          .collection("Asset")
          .orderBy("voucher", "asc")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((docSnap) => {
              head1.push(docSnap.data());
              if (nature === "debit") {
                netHead2 = docSnap.data().debit - docSnap.data().credit;
                netHead1 = netHead2 + netHead1;
              } else if (nature === "credit") {
                netHead2 = docSnap.data().credit - docSnap.data().debit;
                netHead1 = netHead2 + netHead1;
              }
            });
            setNetHead(netHead1);
            setHead(head1);
            checkSubTypes();
          });
      });
  }, []);

  const subHeadFunction = (subHeadName) => {
    //for subcategories display
    const subHead1 = [];
    var netSubHead1 = 0;
    var netSubHead2 = 0;
    if (subHeadName !== null) {
      firebase
        .firestore()
        .collection(subHeadName) //          .collection("Asset")
        .orderBy("voucher", "asc")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((docSnap) => {
            subHead1.push(docSnap.data());
            if (nature === "debit") {
              netSubHead2 = docSnap.data().debit - docSnap.data().credit;
              netSubHead1 = netSubHead2 + netSubHead1;
            } else if (nature === "credit") {
              netSubHead2 = docSnap.data().credit - docSnap.data().debit;
              netSubHead1 = netSubHead2 + netSubHead1;
            }
          });
          setnetSubHead(netSubHead1);
          setsubHead(subHead1);
          setLoading(false);
          // console.log(subHead1.length)
          if (subHead1.length > 0) {
            setSubCategoryBool(false);
          }
        });
    } else alert("Error");
  };

  const checkSubTypes = () => {
    // var sub = [];
    if (headName === "Asset") {
      sub = ["Cash", "Receivables", "Bank", "FurnitureAndFittings"];
    } else if (headName === "Liabilities") {
      sub = [""];
    } else if (headName === "Income") {
      sub = ["TutionFee", "AnnualFee", "AdmissionFee", "MiscellaneousIncome"];
    } else if (headName === "Expense") {
      sub = [
        "SiblingsDiscount",
        "ArmyDiscount",
        "StaffFamilyDiscount",
        "AdvertisingExpense",
        "MiscellaneousExpense",
        "SalaryExpense",
        "BadDebt",
        "Rent",
        "Royalty",
        "Utilities",
        "Stationary",
        "RepairsAndMaintenance",
      ];
    } else if (headName === "Capital") {
      sub = ["Capital(M.Daud-25)","Capital(IrfanKiyani-75)","RetainedEarnings"];
    }
    setSubTypes(sub);
  };

  const subCategoryToggle = (data) => {
    setLoading(true);
    setSubCategoryName(data);
    setSubCategoryBool(true);
    subHeadFunction(data);

    // console.log(subCategoryName);
    // console.log(data);
    // return setSubCategoryName(data);
  };

  //   const callingFunction=()=>{

  // if(subCategoryName!==null){

  //   return    SubCategoryComponent(subCategoryName, nature)
  // }
  // else return null

  //   }

  const triggerMainTable = () => {
    // console.log("clicked");
    setSubCategoryBool(null);
    setSubCategoryName(null);
  };

  return (
    <>
      <div>
        <Nav className="justify-content-center">
          {subTypes &&
            subTypes.map((data, index) => {
              return (
                <NavItem key={index}>
                  <NavLink
                    href="#"
                    onClick={() => subCategoryToggle(data)}
                    // onClick={()=>console.log(subTypes.length)}
                  >
                    {data}
                  </NavLink>
                </NavItem>
              );
            })}

          {subCategoryName ? (
            <Card>
              {loading ? (
                <div style={{ margin: "100px", textAlign: "center" }}>
                  <LoaderSpinner
                    type="MutatingDots"
                    color="#00BFFF"
                    height={100}
                    width={100}
                    // timeout={100000} //1 secs
                  />
                </div>
              ) : subCategoryBool ? (
                <CardHeader>
                  <CardTitle tag="h4">
                    No vouchers were found
                    <Button
                      onClick={triggerMainTable}
                      style={{ float: "right" }}
                      className="btn-icon"
                      color="danger"
                      size="sm"
                    >
                      <i className="fa fa-times" />
                    </Button>
                  </CardTitle>
                </CardHeader>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle tag="h4">
                      {subCategoryName}

                      <Button
                        onClick={triggerMainTable}
                        style={{ float: "right" }}
                        className="btn-icon"
                        color="danger"
                        size="sm"
                      >
                        <i className="fa fa-times" />
                      </Button>
                    </CardTitle>

                    <h4
                      style={{
                        margin: "5px",
                        color: netSubHead > 0 ? "green" : "red",
                      }}
                    >
                      Net {subCategoryName} : {netSubHead}
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th className="text-center">Voucher #</th>
                          <th className="text-center">Reference #</th>
                          <th className="text-center">Description</th>
                          <th className="text-center">Date (Y-M-D)</th>
                          <th className="text-center">Credit</th>
                          <th className="text-center">Debit</th>
                          {/* <th className="text-right">Actions</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {subHead &&
                          subHead.map((data, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-center">{data.voucher}</td>
                                <td className="text-center">{data.referenceNumber}</td>

                                <td className="text-center">
                                  {data.description ? data.description : "null"}
                                </td>
                                <td className="text-center">{data.date}</td>
                                <td className="text-center">
                                  {data.credit ? data.credit : "0"}
                                </td>
                                <td className="text-center">
                                  {data.debit ? data.debit : "0"}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </CardBody>
                </>
              )}
            </Card>
          ) : null}
        </Nav>

        {subCategoryBool === null ? (
          <>
            <h3
              style={{
                margin: "5px",
                color: netHead > 0 ? "green" : "red",
              }}
            >
              Net {headName} : {netHead}
            </h3>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">{headName}</CardTitle>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th className="text-center">Voucher #</th>
                      <th className="text-center">Reference #</th>
                      <th className="text-center">Description</th>
                      <th className="text-center">Date (Y-M-D)</th>
                      <th className="text-center">Credit</th>
                      <th className="text-center">Debit</th>
                      
                      {/* <th className="text-right">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {head &&
                      head.map((data, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-center">{data.voucher}</td>
                            <td className="text-center">{data.referenceNumber}</td>

                            <td className="text-center">
                              {data.description ? data.description : "null"}
                            </td>
                            <td className="text-center">{data.date}</td>
                            <td className="text-center">
                              {data.credit ? data.credit : "0"}
                            </td>
                            <td className="text-center">
                              {data.debit ? data.debit : "0"}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </>
        ) : null}
      </div>



    </>
  );
}

export default TableComponent;
