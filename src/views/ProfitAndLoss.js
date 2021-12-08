import React, { useRef, useState, useEffect } from "react";
import { firebase } from "../services/firebase";
import moment from "moment";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
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
function ProfitAndLoss() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null);

  const [dateFrom, setDateFrom] = useState("2000-01-01");
  const [dateTo, setDateTo] = useState("3000-01-01");

  const [tutionFee, setTutionFee] = useState(null);
  const [annualFee, setAnnualFee] = useState(null);
  const [admissionFee, setAdmissionFee] = useState(null);
  const [miscellaneousIncome, setMiscellaneousIncome] = useState(null);
  const [totalSale, setTotalSale] = useState(null);

  const [siblingsDiscount, setSiblingsDiscount] = useState(null);
  const [armyDiscount, setArmyDiscount] = useState(null);
  const [staffFamilyDiscount, setStaffFamilyDiscount] = useState(null);
  const [grossProfit, setGrossProfit] = useState(null);

  const [advertisingExpense, setAdvertisingExpense] = useState(null);
  const [salaryExpense, setSalaryExpense] = useState(null);
  const [badDebt, setBadDebt] = useState(null);
  const [rent, setRent] = useState(null);
  const [royalty, setRoyalty] = useState(null);
  const [utilities, setUtilities] = useState(null);
  const [stationary, setStationary] = useState(null);
  const [repairsAndMaintenance, setRepairsAndMaintenance] = useState(null);
  const [interest, setInterest] = useState(false);
  const [tax, setTax] = useState(false);
  const [netPBIT, setNetPBIT] = useState(false);
  const [netProfit, setNetProfit] = useState(false);

  const [statementToggle, setStatementToggle] = useState(false);

  const pdfExportComponent = useRef(null);

  //   useEffect(() => {

  // }, []);

  const getHeadsTotal = (headName, nature) => {
    setLoading(true);
    // console.log(dateFrom, dateTo);
    var add = 0;
    firebase
      .firestore()
      .collection(headName) //          .collection("Asset")
      .orderBy("date")
      .startAt(dateFrom)
      .endAt(dateTo)
      // .limit(5)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (nature === "debit") {
            add = doc.data().debit - doc.data().credit + add;
          } else if (nature === "credit") {
            add = doc.data().credit - doc.data().debit + add;
          }
        });
        console.log(headName, nature, add);
        if (headName === "TutionFee") {
          setTutionFee(add);
        } else if (headName === "AnnualFee") {
          setAnnualFee(add);
        } else if (headName === "AdmissionFee") {
          setAdmissionFee(add);
        } else if (headName === "MiscellaneousIncome") {
          setMiscellaneousIncome(add);
        } else if (headName === "SiblingsDiscount") {
          setSiblingsDiscount(add);
        } else if (headName === "ArmyDiscount") {
          setArmyDiscount(add);
        } else if (headName === "StaffFamilyDiscount") {
          setStaffFamilyDiscount(add);
        } else if (headName === "AdvertisingExpense") {
          setAdvertisingExpense(add);
        } else if (headName === "SalaryExpense") {
          setSalaryExpense(add);
        } else if (headName === "BadDebt") {
          setBadDebt(add);
        } else if (headName === "Rent") {
          setRent(add);
        } else if (headName === "Royalty") {
          setRoyalty(add);
        } else if (headName === "Utilities") {
          setUtilities(add);
        } else if (headName === "Stationary") {
          setStationary(add);
        } else if (headName === "RepairsAndMaintenance") {
          setRepairsAndMaintenance(add);
        }
      });
  };

  const ff = () => {
    setLoading(true);
    setStatementToggle(true);
    //sales or income
    getHeadsTotal("TutionFee", "credit");
    getHeadsTotal("AnnualFee", "credit");
    getHeadsTotal("AdmissionFee", "credit");
    getHeadsTotal("MiscellaneousIncome", "credit");
    //expense or cost
    getHeadsTotal("SiblingsDiscount", "debit");
    getHeadsTotal("ArmyDiscount", "debit");
    getHeadsTotal("StaffFamilyDiscount", "debit");
    //Operating Expense
    getHeadsTotal("AdvertisingExpense", "debit");
    getHeadsTotal("SalaryExpense", "debit");
    getHeadsTotal("BadDebt", "debit");
    getHeadsTotal("Rent", "debit");
    getHeadsTotal("Royalty", "debit");
    getHeadsTotal("Utilities", "debit");
    getHeadsTotal("Stationary", "debit");
    getHeadsTotal("RepairsAndMaintenance", "debit");
    getNetProfit();
  };

  useEffect(() => {
    getTotalSales();
  }, [tutionFee, annualFee, admissionFee, miscellaneousIncome]);

  useEffect(() => {
    getGrossProfit();
  }, [siblingsDiscount, armyDiscount, staffFamilyDiscount, totalSale]);

  useEffect(() => {
    getNetPBIT();
  }, [
    grossProfit,
    advertisingExpense,
    salaryExpense,
    badDebt,
    rent,
    royalty,
    utilities,
    stationary,
    repairsAndMaintenance,
  ]);

  useEffect(() => {
    getNetProfit();
  }, [tax, interest, netPBIT]);

  var getTotalSales = () => {
    if ((tutionFee, annualFee, admissionFee, miscellaneousIncome) !== null) {
      var total = 0;
      total = tutionFee + annualFee + admissionFee + miscellaneousIncome;
      setTotalSale(total);
      //   console.log("assets total: ", totalSale);
    }
  };

  var getGrossProfit = () => {
    if (
      (siblingsDiscount, armyDiscount, staffFamilyDiscount, totalSale) !== null
    ) {
      var total = 0;
      total =
        totalSale - (siblingsDiscount + armyDiscount + staffFamilyDiscount);
      setGrossProfit(total);
      //   console.log("assets total: ", totalSale);
    }
  };

  var getNetPBIT = () => {
    if (
      (grossProfit,
      advertisingExpense,
      salaryExpense,
      badDebt,
      rent,
      royalty,
      utilities,
      stationary,
      repairsAndMaintenance) !== null
    ) {
      var total = 0;
      total =
        grossProfit -
        (advertisingExpense +
          salaryExpense +
          badDebt +
          rent +
          royalty +
          utilities +
          stationary +
          repairsAndMaintenance);
      setNetPBIT(total);
    }
  };

  var getNetProfit = () => {
    if ((tax, interest, netPBIT) !== null) {
      var total = 0;
      total = netPBIT - (tax + interest);
      setNetProfit(total);
      setLoading(false);
    }
  };

  const handleChangeData = (e, type) => {
    if (type === "dateFrom") {
      setDateFrom(e.target.value);
    } else if (type === "dateTo") {
      setDateTo(e.target.value);
    }
  };

  return (
    <>
      <div className="content">
        <div>
          {!statementToggle ? (
            <Card>
              <CardHeader>
                <h4>STATEMENT OF PROFIT & LOSS</h4>
              </CardHeader>
              <FormGroup
                className="mb-3"
                style={{
                  padding: "20px",
                  display: "inline-flex",
                  alignSelf: "center",
                }}
              >
                <div style={{ padding: "inherit" }}>
                  <Label>Date From</Label>

                  <Input
                    id="dateFrom"
                    type="date"
                    autoComplete="off"
                    onChange={(e) => handleChangeData(e, "dateFrom")}
                  />
                </div>
                <div style={{ padding: "inherit" }}>
                  <Label>Date To</Label>

                  <Input
                    id="dateTo"
                    type="date"
                    autoComplete="off"
                    onChange={(e) => handleChangeData(e, "dateTo")}
                  />
                </div>
              </FormGroup>
              <Button
                color="success"
                size="sm"
                style={{ width: "20%", alignSelf: "center" }}
                onClick={ff}
              >
                Generate
              </Button>
            </Card>
          ) : !loading ? (
            <>
              <PDFExport
                ref={pdfExportComponent}
                fileName={"ProfitAndLoss(" + dateFrom + "to" + dateTo + ")"}
                // imageResolution={2000}
                //  paperSize="A4"
              >
                <Card>
                  <CardHeader>
                    <Button
                      //   onClick={triggerstatementToggle}
                      onClick={() => setStatementToggle(false)}
                      style={{ float: "right" }}
                      className="btn-icon"
                      color="danger"
                      size="sm"
                    >
                      <i className="fa fa-times" />
                    </Button>
                    <Button
                      onClick={() => pdfExportComponent.current.save()}
                      style={{ float: "right" }}
                      className="btn-icon"
                      color="info"
                      size="sm"
                    >
                      <i className="tim-icons icon-paper" />
                    </Button>
                    <CardTitle tag="h1">Statement of Profit & Loss</CardTitle>
                    <h5>
                      From {dateFrom} to {dateTo}
                    </h5>
                  </CardHeader>

                  <CardBody style={{ fontFamily: "sans-serif" }}>
                    <h4
                      style={{
                        fontWeight: "normal",
                        textDecoration: "underline",
                        fontStyle: "italic",
                      }}
                    >
                      SALES REVENUE
                    </h4>

                    <Row>
                      <Col xs={1}></Col>

                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>TutionFee:</p>
                      </Col>
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {tutionFee ? tutionFee.toLocaleString() : 0}
                        </p>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>

                    <Row>
                      <Col xs={1}></Col>

                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>Annual Fee: </p>
                      </Col>
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {" "}
                          {annualFee ? annualFee.toLocaleString() : 0}
                        </p>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>

                    <Row>
                      <Col xs={1}></Col>

                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>Admission Fee: </p>
                      </Col>
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {" "}
                          {admissionFee ? admissionFee.toLocaleString() : 0}
                        </p>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>

                    <Row>
                      <Col xs={1}></Col>
                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>
                          Miscellaneous Income:
                        </p>{" "}
                      </Col>
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {" "}
                          {miscellaneousIncome
                            ? miscellaneousIncome.toLocaleString()
                            : 0}
                        </p>{" "}
                      </Col>{" "}
                      <Col xs={2}></Col>
                    </Row>

                    <Row style={{ paddingTop: "20px" }}>
                      <Col xs={1}></Col>
                      <Col xs={5}>
                        {" "}
                        <h4 style={{ fontWeight: "bold" }}>Total Sales:</h4>
                      </Col>{" "}
                      <Col xs={4}>
                        <h4 className="text-right">
                          {" "}
                          {totalSale ? totalSale.toLocaleString() : 0}
                        </h4>
                      </Col>{" "}
                      <Col xs={2}></Col>
                    </Row>
                    <h4
                      style={{
                        fontWeight: "normal",
                        textDecoration: "underline",
                        fontStyle: "italic",
                      }}
                    >
                      COST OF SALES
                    </h4>
                    <Row>
                      <Col xs={1}></Col>
                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>Siblings Discount:</p>
                      </Col>
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {siblingsDiscount
                            ? siblingsDiscount.toLocaleString()
                            : 0}
                        </p>
                      </Col>{" "}
                      <Col xs={2}></Col>
                    </Row>

                    <Row>
                      <Col xs={1}></Col>
                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>Army Discount:</p>
                      </Col>{" "}
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {armyDiscount ? armyDiscount.toLocaleString() : 0}
                        </p>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>

                    <Row>
                      <Col xs={1}></Col>
                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>
                          Staff Family Discount:
                        </p>
                      </Col>{" "}
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {staffFamilyDiscount
                            ? staffFamilyDiscount.toLocaleString()
                            : 0}
                        </p>
                      </Col>{" "}
                      <Col xs={2}></Col>
                    </Row>

                    <Row style={{ paddingTop: "20px" }}>
                      <Col xs={1}></Col>
                      <Col xs={5}>
                        <h4 style={{ fontWeight: "bold" }}>Gross Profit:</h4>
                      </Col>
                      <Col xs={4}>
                        {/* <Col sm style={{ alignSelf: "center" }}> */}
                        <h4 className="text-right">
                          {" "}
                          {grossProfit ? grossProfit.toLocaleString() : 0}
                        </h4>
                      </Col>{" "}
                      <Col xs={2}></Col>
                    </Row>

                    <h4
                      style={{
                        fontWeight: "normal",
                        textDecoration: "underline",
                        fontStyle: "italic",
                      }}
                    >
                      OPERATING EXPENSES
                    </h4>
                    <Row>
                      <Col xs={1}></Col>
                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>
                          Advertising Expense:
                        </p>
                      </Col>
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {advertisingExpense
                            ? advertisingExpense.toLocaleString()
                            : 0}
                        </p>
                      </Col>{" "}
                      <Col xs={2}></Col>
                    </Row>

                    <Row>
                      <Col xs={1}></Col>
                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>Salary Expense:</p>
                      </Col>{" "}
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {salaryExpense ? salaryExpense.toLocaleString() : 0}
                        </p>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>

                    <Row>
                      {" "}
                      <Col xs={1}></Col>
                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>Bad Debt:</p>
                      </Col>
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {badDebt ? badDebt.toLocaleString() : 0}
                        </p>
                      </Col>{" "}
                      <Col xs={2}></Col>
                    </Row>
                    <Row>
                      <Col xs={1}></Col>
                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>Rent:</p>
                      </Col>{" "}
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {rent ? rent.toLocaleString() : 0}
                        </p>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>
                    <Row>
                      <Col xs={1}></Col>

                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>Royalty:</p>
                      </Col>
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {royalty ? royalty.toLocaleString() : 0}
                        </p>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>
                    <Row>
                      <Col xs={1}></Col>
                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>Utilities:</p>
                      </Col>{" "}
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {utilities ? utilities.toLocaleString() : 0}
                        </p>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>
                    <Row>
                      <Col xs={1}></Col>
                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>Stationary:</p>
                      </Col>{" "}
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {stationary ? stationary.toLocaleString() : 0}
                        </p>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>
                    <Row>
                      <Col xs={1}></Col>

                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>
                          Repairs & Maintenance:
                        </p>
                      </Col>
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {repairsAndMaintenance
                            ? repairsAndMaintenance.toLocaleString()
                            : 0}
                        </p>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>

                    <Row style={{ paddingTop: "20px" }}>
                      <Col xs={1}></Col>

                      <Col xs={5}>
                        {" "}
                        <h4 style={{ fontWeight: "bold" }}>
                          Profit Before Interest and Tax :
                        </h4>
                      </Col>
                      <Col xs={4}>
                        {/* <Col sm style={{ alignSelf: "center" }}> */}
                        <h4 className="text-right">
                          {" "}
                          {netPBIT ? netPBIT.toLocaleString() : 0}
                        </h4>
                      </Col>
                      <Col xs={4}></Col>
                    </Row>

                    <Row>
                      <Col xs={1}></Col>

                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>Interest:</p>
                      </Col>
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {interest ? interest.toLocaleString() : 0}
                        </p>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>
                    <Row>
                      <Col xs={1}></Col>
                      <Col xs={5}>
                        {" "}
                        <p style={{ fontSize: "medium" }}>Tax:</p>
                      </Col>{" "}
                      <Col xs={4}>
                        <p
                          className="text-right"
                          style={{ fontSize: "medium" }}
                        >
                          {tax ? tax.toLocaleString() : 0}
                        </p>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>

                    <Row style={{ paddingTop: "20px" }}>
                      <Col xs={1}></Col>

                      <Col xs={5}>
                        <h3 style={{ fontWeight: "bold" }}>Net Profit:</h3>
                      </Col>
                      {/* <Col sm style={{ alignSelf: "center" }}> */}
                      <Col xs={4}>
                        <h3 className="text-right">
                          {" "}
                          {netProfit ? netProfit.toLocaleString() : 0}
                        </h3>
                      </Col>
                      <Col xs={2}></Col>
                    </Row>
                  </CardBody>
                </Card>
              </PDFExport>
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "50px",
                marginBottom: "200px",
                // zoom:"60%"

                // mixBlendMode: "screen",
              }}
            >
              <LoaderSpinner
                type="MutatingDots"
                color="#00BFFF"
                height={100}
                width={100}
                // timeout={100000} //1 secs
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfitAndLoss;
