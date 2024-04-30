import { Col, Container, Row, Form, Button } from "react-bootstrap";
import MainCard from "../components/card";
import { useMainContext } from "../utils/context";
import { NavLink, Navigate, redirect } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function LoginPage() {

    const { isLogin, user, setIsLogin, setUser } = useMainContext();
    const [userEmail, setUserEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // let _user = window.localStorage.getItem('user');
    // const user = JSON.parse(_user!);

    const login = async () => {

        if (userEmail === "" || password === "") {
            toast.error("Please enter user information");;
            return;
        }

        const body = {
            email: userEmail,
            password: password
        }

        await axios.post(`${process.env.REACT_APP_API_URL}/user/signIn`, body)
            .then(function (response) {
                toast.success(response.data.message);
                window.localStorage.setItem('token', response.data.token);
                window.localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                setIsLogin(true);
            })
            .catch(function (error) {
                toast.error(error.response.data.message);
            });
    }

    console.log(isLogin)

    if (user) {
        return (
            <Navigate to="/home" replace />
        )
    }

    return (
        <div className="LoginPage d-flex align-items-center h-full py-5">
            <Container>
                <Row>
                    <Col sm={12} md={6} className="mx-auto">
                        <MainCard title="Login">
                            <Col sm={12} lg={12} className="mb-3">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control type="email" className="rounded-0 bg-transparent" value={userEmail} onChange={(e) => { setUserEmail(e.target.value) }} required />
                                </Form.Group>
                            </Col>
                            <Col sm={12} lg={12} className="mb-3">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" className="rounded-0 bg-transparent" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </Form.Group>
                            </Col>
                            <Col sm={12} lg={12} className="mb-3 text-center">
                                <Button className="Main-btn rounded-0 fw-bold px-5" onClick={login}>Login</Button>
                            </Col>
                            <Col sm={12} lg={12} className="mb-3 text-end">
                                <NavLink to="/register" className="nav-item d-none"><small>Register account?</small></NavLink>
                            </Col>
                        </MainCard>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default LoginPage;