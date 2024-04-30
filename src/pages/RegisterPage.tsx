import { Col, Container, Row, Form, Button } from "react-bootstrap";
import MainCard from "../components/card";
import { useMainContext } from "../utils/context";
import { NavLink, redirect } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function RegisterPage() {

    const { isLogin, setIsLogin } = useMainContext();
    const [userEmail, setUserEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [cpassword, setCPassword] = useState<string>("");

    const register = async () => {

        if(userEmail === "" || password === "" || cpassword === "") {
            toast.error("Please enter user information");;
            return;
        }

        if(password !== cpassword) {
            toast.error("Passwords do not match.");;
            return;
        }

        const body = {
           email: userEmail,
           password: password
        }

        await axios.post(`${process.env.REACT_APP_API_URL}/user/signUp`, body)
            .then(function (response) {
                toast.success(response.data.message);
                return redirect("/");
            })
            .catch(function (error) {
                toast.error(error.response.data.message);
            });

    }

    return (
        <div className="LoginPage d-flex align-items-center h-full py-5">
            <Container>
                <Row>
                    <Col sm={12} md={6} className="mx-auto">
                        <MainCard title="Register">
                            <Col sm={12} lg={12} className="mb-3">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control type="email" className="rounded-0 bg-transparent" value={userEmail} onChange={(e) => {setUserEmail(e.target.value)}} required />
                                </Form.Group>
                            </Col>
                            <Col sm={12} lg={12} className="mb-3">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" className="rounded-0 bg-transparent" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </Form.Group>
                            </Col>
                            <Col sm={12} lg={12} className="mb-3">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" className="rounded-0 bg-transparent" value={cpassword} onChange={(e) => setCPassword(e.target.value)} required />
                                </Form.Group>
                            </Col>
                            <Col sm={12} lg={12} className="mb-3 text-center">
                                <Button className="Main-btn rounded-0 fw-bold px-5" onClick={register}>Register</Button>
                            </Col>
                            <Col sm={12} lg={12} className="mb-3 text-end">
                                <NavLink to="/" className="nav-item"><small>Login</small></NavLink>
                            </Col>
                        </MainCard>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default RegisterPage;