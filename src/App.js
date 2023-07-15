import React, { useState } from "react";
import {
  Layout,
  Table,
  Pagination,
  Button,
  Modal,
  Form,
  Input,
  Card,
  Checkbox,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addPerson, deletePerson, updatePerson } from "./data/peopleSlice";
import { Row, Col, DatePicker, Select } from "antd";
import axios from 'axios';


const { Header, Content, Footer } = Layout;

const App = () => {
  const dispatch = useDispatch();
  const people = useSelector((state) => state.people.people);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [prefix, setPrefix] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [date, setDate] = useState(null);
  const [nationality, setNationality] = useState("");
  const [idnumber, setIdnumber] = useState("");
  const [telnumber, setTelnumber] = useState("");
  const [passport, setPassport] = useState("");
  const [salary, setSalary] = useState("");
  const [gender, setGender] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [language, setLanguage] = useState("th");
  const translateText = async (text, targetLanguage) => {
    const apiKey = 'YOUR_API_KEY'; // ใส่ API key ที่คุณได้รับจาก OpenAI
    const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
  
    try {
      const response = await axios.post(apiUrl, {
        prompt: `Translate the following text from English to ${targetLanguage}: ${text}`,
        max_tokens: 50,
        temperature: 0.3,
        n: 1,
        stop: '\n',
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
  
      const translatedText = response.data.choices[0].text.trim();
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return null;
    }
  };
  
  const handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const handleGenderChange = (checkedValues) => {
    setGender(checkedValues);
  };

  const handleLanguageChange = async (value) => {
    setLanguage(value);
    if (value === 'th') {
      const translatedName = await translateText(name, 'th');
      const translatedLastName = await translateText(lastname, 'th');
  
      if (translatedName && translatedLastName) {
        setName(translatedName);
        setLastName(translatedLastName);
      }
    } else {
      setName('');
      setLastName('');
    }
  };

  const handleAddPerson = () => {
    const newPerson = {
      id: Date.now(),
      prefix,
      name,
      telnumber,
      lastname,
      date,
      nationality,
      idNumber: idnumber,
      passport,
      salary,
      gender,
      email,
    };
    dispatch(addPerson(newPerson));
    setIsModalVisible(false);
    resetForm();
  };

  const handleEditPerson = () => {
    const updatedPerson = {
      prefix,
      name,
      telnumber,
      lastname,
      passport,
      date,
      nationality,
      gender,
      email,
    };
    dispatch(updatePerson({ id: editingPerson.id, updatedPerson }));
    setIsModalVisible(false);
    setEditingPerson(null);
  };

  const handleDeletePerson = (id) => {
    dispatch(deletePerson(id));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPerson(null);
    resetForm();
  };

  const resetForm = () => {
    setPrefix("");
    setName("");
    setLastName("");
    setDate(null);
    setNationality("");
    setIdnumber("");
    setTelnumber("");
    setPassport("");
    setSalary("");
    setGender("");
    setEmail("");
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectionChange,
  };

  const actionColumn = {
    // title: "Delete",
    // key: "delete",
    // render: (_, record) => (
    //   <Button type="link" danger onClick={() => handleDeletePerson(record.id)}>
    //     Delete
    //   </Button>
    // ),
  };

  const columns = [
    actionColumn,
    { title: "ชื่อ", dataIndex: "name", key: "name" },
    { title: "เพศ", dataIndex: "gender", key: "gender" },
    { title: "หมายเลขโทรศัพท์", dataIndex: "telnumber", key: "telnumber" },
    { title: "สัญชาติ", dataIndex: "nationality", key: "nationality" },
    { title: "เลขประจำตัวประชาชน", dataIndex: "idNumber", key: "idNumber" },
    { title: "จัดการ", dataIndex: "email", key: "email" },
  ];

  const handleDeleteSelected = () => {
    selectedRows.forEach((row) => {
      dispatch(deletePerson(row.id));
    });
    setSelectedRows([]); // เคลียร์รายการที่ถูกเลือก
  };

  const deleteAllButton = (
    <>
    <p>เลือกทั้งหมด</p><Button type="link" danger onClick={handleDeleteSelected}>ลบข้อมูล</Button>
    
  </>
  );

  columns.unshift({
    title: deleteAllButton,
    key: "deleteAll",
    width: 100,
    fixed: "left",
  });

  return (
    <Layout>
      <Header>Header</Header>
     
      <div style={{ width: "10px", height: "20px" }}>
        {/* เพิ่มส่วนเลือกภาษา */}
        <div>
    <select
      value={language}
      onChange={(e) => handleLanguageChange(e.target.value)}
    >
      <option value="en">English</option>
      <option value="th">ไทย</option>
    </select>
  </div>
      </div>

      <Content style={{ padding: "0 50px" }}>
        <div>
        <p>การจัดการหน้าฟอร์ม</p>
          <Card>
            <Form>
              <Row>
                <Col span={6}>
                  <Form.Item label="คำนำหน้าชื่อ">
                    <Select value={prefix} onChange={setPrefix}>
                      <Select.Option value="Mr">นาย</Select.Option>
                      <Select.Option value="Mrs">นาง</Select.Option>
                      <Select.Option value="Miss">นางสาว</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="ชื่อจริง">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ชื่อจริง"
                      maxLength={50}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="นามสกุล">
                    <Input
                      value={lastname}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="นามสกุล"
                      maxLength={50}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="วันเดือนปีเกิด">
                    <DatePicker
                      value={date}
                      onChange={(date) => setDate(date)}
                      placeholder="ว/ด/ป"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="สัญชาติ">
                    <Select value={nationality} onChange={setNationality}>
                      <Select.Option value="TH">ไทย</Select.Option>
                      <Select.Option value="EN">อังกฤษ</Select.Option>
                      <Select.Option value="JP">ญี่ปุ่น</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="เลขประจำตัวประชาชน">
                    <Input
                      value={idnumber}
                      onChange={(e) => setIdnumber(e.target.value)}
                      maxLength={17}
                      placeholder="12104-00059-28-9"
                      style={{ textTransform: "uppercase" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="หมายเลขโทรศัพท์">
                    <Input
                      type="tel"
                      value={telnumber}
                      onChange={(e) => setTelnumber(e.target.value)}
                      maxLength={10}
                      placeholder="098-58XXXXX"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="หนังสือเดินทาง">
                    <Input
                      value={passport}
                      onChange={(e) => setPassport(e.target.value)}
                      maxLength={13}
                      placeholder="XX,XXX-X,XXX,XXX"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="เงินเดือนที่ต้องการ">
                    <Input
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="XXXXXXXX"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="เพศ">
                    <Checkbox.Group
                      onChange={handleGenderChange}
                      value={gender}
                    >
                      <Checkbox value="ผู้ชาย">ผู้ชาย</Checkbox>
                      <Checkbox value="ผู้หญิง">ผู้หญิง</Checkbox>
                      <Checkbox value="ไม่ระบุ">ไม่ระบุ</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="อีเมล์">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@gmail.com"
                      />
                   
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="end">
                <Col span={24}>
                  <div className="modal-actions">
                    <Button onClick={handleCancel}>ล้างข้อมูล</Button>
                    <Button
                      type="primary"
                      onClick={
                        editingPerson ? handleEditPerson : handleAddPerson
                      }
                    >
                      {editingPerson ? "Save" : "ส่งข้อมูล"}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
        <Table
          dataSource={people}
          columns={columns}
          pagination={false}
          rowSelection={rowSelection}
          rowKey="id"
          style={{ marginTop: 16 }}
        />

        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Pagination />
        </div>

        {isModalVisible && (
          <div className="modal-wrapper">
            <div className="modal">
              <h2>{editingPerson ? "Edit Person" : "Add Person"}</h2>
              {/* เนื้อหาโมดัล */}
            </div>
          </div>
        )}
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default App;
