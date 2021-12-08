import React, { useState, useEffect } from "react";
import { firebase } from "../services/firebase";
import moment from "moment";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Input,
  InputGroup,
  Modal,
  Alert,
  Label,
} from "reactstrap";
// import { data } from "jquery";
// reactstrap components

function showStudentRecord(studentData) {
//   const [reg, setReg] = useState(null);

  return (
    <>
      {/* <div className="content"> */}
        {/* <Row>
          <Col md="12"> */}
          {studentData?
          
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Student Data</CardTitle>
              </CardHeader>
              <CardBody>
                <div style={{ marginTop: "15px", marginBottom: "10px" }}>
                  <Table responsive>
                    <thead>
                      <tr>
                        {/* reg: reg, regDate: regDate, contact: contact,
                        studentName: studentName, gender: gender, bformNumber:
                        bformNumber, fatherName: fatherName, dob: dob, religion:
                        religion, gradeYear: gradeYear, studentEmail:
                        studentEmail, cnic: cnic, fatherEmail: fatherEmail,
                        landline: landline, address1: address1, address2:
                        address2, siblings: siblings, photo: downloadURL, */}
                        <th className="text-center">Reg. No.</th>
                        <th className="text-center">Name</th>
                        <th className="text-center">Gender</th>
                        <th className="text-center">B-Form No.</th>
                        <th className="text-center">Father Name</th>
                        <th className="text-center">Contact details</th>
                        <th className="text-center">Date of Admission</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                    { studentData.map((data, index) => {
                        return (
                          <tr key={index}>
                        <td className="text-center">{data.reg}</td>
                        <td className="text-center">{data.studentName}</td>
                        <td className="text-center">{data.gender}</td>
                        <td className="text-center">{data.bformNumber} </td>
                        <td className="text-center">{data.fatherName} </td>
                        <td className="text-center">{data.contact}</td>
                        <td className="text-center">{data.regDate}</td>
                      </tr>
                      )
                      })}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
       :null}
       {/* </Col>
        </Row> */}
      {/* </div> */}
    </>
  );
}

export default showStudentRecord;
