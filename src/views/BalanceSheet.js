import React, { useRef, useState, useEffect } from "react";
import { firebase } from "../services/firebase";
import moment from "moment";
import { jsPDF } from "jspdf";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { ThemeContext, themes } from "../contexts/ThemeContext";
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
function BalanceSheet() {
  const [name, setName] = useState(null);

  const [dateFrom, setDateFrom] = useState("2000-01-01");
  const [dateTo, setDateTo] = useState("3000-01-01");

  const [furnitureAndFittings, setFurnitureAndFittings] = useState(null);
  const [cash, setCash] = useState(null);
  const [bank, setBank] = useState(null);
  const [receivables, setReceivables] = useState(null);
  const [totalAsset, setTotalAsset] = useState(null);

  const [capitalMD, setCapitalMD] = useState(null);
  const [capitalIK, setCapitalIK] = useState(null);
  const [retainedEarnings, setRetainedEarnings] = useState(null);
  const [liabilities, setLiabilities] = useState(null);
  const [totalCapitalAndLiabilities, setTotalCapitalAndLiabilities] =
    useState(null);

  const [balanceSheetToggle, setBalanceSheetToggle] = useState(false);
  const [loading, setLoading] = useState(false);

  const pdfExportComponent = useRef(null);
  //     useEffect(() => {
  // export_div()
  //   }, []);

  function export_div() {
    var doc = new jsPDF("p", "mm", "legal");

    doc.addFont("ArialMS", "Arial", "normal", "Times New Roman");
    doc.setFont("Times New Roman");

    doc.setFontSize(10);
    doc.setTextColor(40);
    doc.text("DISHA EDUCATIONAL SOCIETY'S", 70, 13);

    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Disha English Medium School, Ichalkaranji", 40, 20);
    doc.setFontSize(15);
    doc.setTextColor(40);
    doc.text("Admission form", 80, 25);

    doc.setFontSize(13);
    doc.setTextColor(40);
    doc.text("Respected principal,", 10, 30);

    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(`Kindly admit my child :-  Sahfeeq payian `, 10, 40);

    //  doc.save(`dasd.pdf`);
  }

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
        if (headName === "FurnitureAndFittings") {
          setFurnitureAndFittings(add);
        } else if (headName === "Cash") {
          setCash(add);
        } else if (headName === "Bank") {
          setBank(add);
        } else if (headName === "Receivables") {
          setReceivables(add);
        } else if (headName === "Capital(M.Daud-25)") {
          setCapitalMD(add);
        } else if (headName === "Capital(IrfanKiyani-75)") {
          setCapitalIK(add);
        } else if (headName === "RetainedEarnings") {
          setRetainedEarnings(add);
        } else if (headName === "Liabilities") {
          setLiabilities(add);
        }
      });
  };

  const whitePdfSave = () => {



    // pdfExportComponent.current.save();




    // changeTheme(themes.light).then(()=>{

    //   pdfExportComponent.current.save()

    // })
    // <ThemeContext.Consumer>
    //   </ThemeContext.Consumer>
  }

  const ff = () => {
    setLoading(true);
    setBalanceSheetToggle(true);
    //assets
    getHeadsTotal("FurnitureAndFittings", "debit");
    getHeadsTotal("Cash", "debit");
    getHeadsTotal("Bank", "debit");
    getHeadsTotal("Receivables", "debit");
    //capital&liailities
    getHeadsTotal("Capital(M.Daud-25)", "credit");
    getHeadsTotal("Capital(IrfanKiyani-75)", "credit");
    getHeadsTotal("RetainedEarnings", "credit");
    getHeadsTotal("Liabilities", "credit");
    getTotalCapitalAndLiabilities();
  };

  useEffect(() => {
    getTotalAssets();
  }, [furnitureAndFittings, cash, bank, receivables]);

  useEffect(() => {
    getTotalCapitalAndLiabilities();
  }, [capitalMD, capitalIK, retainedEarnings, liabilities]);

  var getTotalAssets = () => {
    if ((furnitureAndFittings, cash, bank, receivables) !== null) {
      var total = 0;
      total = furnitureAndFittings + cash + bank + receivables;
      setTotalAsset(total);
      //   console.log("assets total: ", totalAsset);
    }
  };

  var getTotalCapitalAndLiabilities = () => {
    if ((capitalMD, capitalIK, retainedEarnings, liabilities) !== null) {
      var total = 0;
      total = capitalMD + capitalIK + retainedEarnings + liabilities;
      setTotalCapitalAndLiabilities(total);
      console.log("assets total: ", totalCapitalAndLiabilities);
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
      <div id="content" className="content">
        <div>
          {!balanceSheetToggle ? (
            <Card>
              <CardHeader>
                <h4>BALANCE SHEET</h4>
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
                color="info"
                size="sm"
                style={{ width: "20%", alignSelf: "center" }}
                onClick={ff}
              >
                Generate
              </Button>
            </Card>
          ) : !loading ? (
            <PDFExport
              ref={pdfExportComponent}
              fileName={"BalanceSheet(" + dateFrom + "to" + dateTo + ")"}
            //  paperSize="A4"
            >
              <Card id="pdfCard">
                <CardHeader>
                  <Button
                    //   onClick={triggerstatementToggle}
                    onClick={() => setBalanceSheetToggle(false)}
                    style={{ float: "right" }}
                    className="btn-icon" color="danger" size="sm" > <i className="fa fa-times" />
                  </Button>
                  <ThemeContext.Consumer>
                    {({ changeTheme, theme }) => (
                      <>
                        <Button

                          onClick={() => {
                            // changeTheme(themes.light);
                            // if (theme == themes.light) { pdfExportComponent.current.save() }
                          
                            changeTheme(themes.light).then(()=>{
if(theme=themes.light){

  pdfExportComponent.current.save();
}
                            })
                          
                          
                          }}
                          style={{ float: "right" }}
                          className="btn-icon"
                          color="info" size="sm" >
                          <i className="tim-icons icon-paper" />
                        </Button>
                      </>
                    )}
                  </ThemeContext.Consumer>
                  <CardTitle tag="h1">Balance Sheet</CardTitle>
                  <h5>

                    From {dateFrom} to {dateTo}
                  </h5>
                </CardHeader>

                <CardBody style={{ fontFamily: "sans-serif" }}>
                  <h2>ASSETS</h2>
                  <Row style={{ paddingBottom: "10px", paddingTop: "10px" }}>
                    <Col sm={8}>
                      {" "}
                      <p
                        style={{
                          fontSize: "medium",
                          fontWeight: "normal",
                          // textDecoration: "underline",
                          fontStyle: "italic",
                        }}
                      >
                        NON-CURRENT ASSETS{" "}
                      </p>
                    </Col>
                    <Col sm={4}></Col>
                  </Row>
                  <Row>
                    <Col xs={1}></Col>
                    <Col xs={5}>
                      {" "}
                      <p style={{ fontSize: "medium" }}>
                        FurnitureAndFittings:
                      </p>
                    </Col>
                    <Col xs={4}>
                      <p className="text-right" style={{ fontSize: "medium" }}>
                        {furnitureAndFittings
                          ? furnitureAndFittings.toLocaleString()
                          : 0}
                      </p>
                    </Col>
                    <Col xs={2}></Col>
                  </Row>

                  <Row style={{ paddingBottom: "10px", paddingTop: "10px" }}>
                    <Col sm={8}>
                      {" "}
                      <p
                        style={{
                          fontSize: "medium",
                          fontWeight: "normal",
                          // textDecoration: "underline",
                          fontStyle: "italic",
                        }}
                      >
                        CURRENT ASSETS{" "}
                      </p>
                    </Col>
                    <Col sm={4}></Col>
                  </Row>

                  <Row>
                    <Col xs={1}></Col>
                    <Col xs={5}>
                      <p style={{ fontSize: "medium" }}>Cash: </p>
                    </Col>
                    <Col xs={4}>
                      <p className="text-right" style={{ fontSize: "medium" }}>
                        {" "}
                        {cash ? cash.toLocaleString() : 0}
                      </p>
                    </Col>
                    <Col xs={2}></Col>
                  </Row>

                  <Row>
                    <Col xs={1}></Col>
                    <Col xs={5}>
                      <p style={{ fontSize: "medium" }}>Bank: </p>
                    </Col>
                    <Col xs={4}>
                      <p className="text-right" style={{ fontSize: "medium" }}>
                        {" "}
                        {bank ? bank.toLocaleString() : 0}
                      </p>
                    </Col>
                    <Col xs={2}></Col>
                  </Row>

                  <Row>
                    <Col xs={1}></Col>
                    <Col xs={5}>
                      {" "}
                      <p style={{ fontSize: "medium" }}>Receivables:</p>{" "}
                    </Col>
                    <Col xs={4}>
                      <p className="text-right" style={{ fontSize: "medium" }}>
                        {" "}
                        {receivables ? receivables.toLocaleString() : 0}
                      </p>{" "}
                    </Col>
                    <Col xs={2}></Col>
                  </Row>

                  <Row style={{ paddingTop: "20px" }}>
                    <Col xs={1}></Col>
                    <Col xs={5}>
                      <h3>Total Assets:</h3>
                    </Col>
                    <Col xs={4}>
                      <h3 className="text-right">
                        {" "}
                        {totalAsset ? totalAsset.toLocaleString() : 0}
                      </h3>
                    </Col>
                    <Col xs={2}></Col>
                  </Row>

                  <h2>CAPITAL & LIABILITIES</h2>
                  <Row>
                    <Col xs={1}></Col>

                    <Col xs={5}>
                      {" "}
                      <p style={{ fontSize: "medium" }}>
                        Capital (M. Daud / 25%):
                      </p>
                    </Col>
                    <Col xs={4}>
                      <p className="text-right" style={{ fontSize: "medium" }}>
                        {capitalMD ? capitalMD.toLocaleString() : 0}
                      </p>
                    </Col>
                    <Col xs={2}></Col>
                  </Row>

                  <Row>
                    <Col xs={1}></Col>

                    <Col xs={5}>
                      {" "}
                      <p style={{ fontSize: "medium" }}>
                        Capital (Irfan Kiyani / 75%):
                      </p>
                    </Col>
                    <Col xs={4}>
                      <p className="text-right" style={{ fontSize: "medium" }}>
                        {capitalIK ? capitalIK.toLocaleString() : 0}
                      </p>
                    </Col>
                    <Col xs={2}></Col>
                  </Row>

                  <Row>
                    <Col xs={1}></Col>

                    <Col xs={5}>
                      {" "}
                      <p style={{ fontSize: "medium" }}>Retained Earnings:</p>
                    </Col>
                    <Col xs={4}>
                      <p className="text-right" style={{ fontSize: "medium" }}>
                        {retainedEarnings
                          ? retainedEarnings.toLocaleString()
                          : 0}
                      </p>
                    </Col>
                    <Col xs={2}></Col>
                  </Row>

                  <Row>
                    <Col xs={1}></Col>
                    <Col xs={5}>
                      {" "}
                      <p style={{ fontSize: "medium" }}>Liabilites:</p>
                    </Col>
                    <Col xs={4}>
                      <p className="text-right" style={{ fontSize: "medium" }}>
                        {liabilities ? liabilities.toLocaleString() : 0}
                      </p>
                    </Col>
                    <Col xs={2}></Col>
                  </Row>

                  <Row style={{ paddingTop: "20px" }}>
                    <Col xs={1}></Col>

                    <Col xs={5}>
                      <h3>Total Capital & Liabilites:</h3>
                    </Col>
                    <Col xs={4} style={{ alignSelf: "center" }}>
                      <h3 className="text-right">
                        {" "}
                        {totalCapitalAndLiabilities
                          ? totalCapitalAndLiabilities.toLocaleString()
                          : 0}
                      </h3>
                    </Col>
                    <Col xs={2}></Col>
                  </Row>
                </CardBody>
              </Card>
            </PDFExport>
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

export default BalanceSheet;
