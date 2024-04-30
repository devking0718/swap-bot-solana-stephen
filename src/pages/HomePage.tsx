import { Button, Col, Container, Form, InputGroup, Row, Dropdown, Image, Spinner, Modal, Card } from "react-bootstrap";
import MainCard from "../components/card";
import { TransactionTable } from "../components/table";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState, ReactNode } from "react";
import { useMainContext } from "../utils/context";
import { Navigate, } from "react-router-dom";
import RefreshIcon from '../assets/images/refresh.svg';
import ClipboardIcon from '../assets/images/clipboard.svg';
import KeyIcon from '../assets/images/key.svg';
import SettingIcon from '../assets/images/setting.svg';
import LogoutIcon from '../assets/images/logout.svg';
import copy from 'copy-to-clipboard';
import base58 from "bs58";

export interface WalletProps {
    id: number;
    address: string;
    privateKey: string;
    balance: number;
    active: boolean;
}

export interface CurrentTradingProps {
    id: number,
    token: string,
    buyAmount: number,
    sellAmount: number,
    frequency: number,
    walletId: number,
    status: boolean
}

export interface TransactionListItemProps {
    id: number;
    hash: string;
    sol: number;
    token: number;
    action: string;
    status: ReactNode;
}

function HomePage() {

    const { isLogin, user, setUser } = useMainContext();
    let _user = window.localStorage.getItem('user');

    const [walletList, setWalletList] = useState<WalletProps[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<WalletProps | null>(null);
    const [currentTrading, setCurrentTrading] = useState<CurrentTradingProps | null>(null);
    const [transactionList, setTransactionList] = useState<TransactionListItemProps[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoading1, setIsLoading1] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);

    const [password, setPassword] = useState<string>("");
    const [opassword, setOPassword] = useState<string>("");
    const [cpassword, setCPassword] = useState<string>("");

    const [tokenAddress, setTokenAddress] = useState<string>("");
    const [buyAmount, setBuyAmount] = useState<number>(0);
    const [sellAmount, setSellAmount] = useState<number>(0);
    const [frequency, setFrequency] = useState<number>(0);
    const [slippage, setSlippage] = useState<number>(0);


    let token = window.localStorage.getItem('token');

    const headers = {
        authorization: `${token}`
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const createWallet = async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/wallets/createWallet`, { headers })
            .then(function (response) {
                toast.success(response.data.message);
                setWalletList(JSON.parse(atob(response.data.wallets)));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const selectWallet = async (id: number) => {
        const selectwallet = walletList.filter((wallet) => wallet.id === id);
        setSelectedWallet(selectwallet[0]);

        const body = {
            walletAddress: selectwallet[0].address,
        }

        await axios.post(`${process.env.REACT_APP_API_URL}/wallets/getBalance`, body, { headers })
            .then(function (response) {
                setBalance(response.data.balance);
            })
            .catch(function (error) {
                toast.error(error.response.data.message);
            });
    }

    const getWalletLists = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/wallets/walletLists`, { headers })
            .then(function (response) {
                setWalletList(JSON.parse(atob(response.data.wallets)));
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const getTradingStatus = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/tradingInfos/getTradingStatus`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `${token}`
            }
        })
            .then(function (response) {
                setCurrentTrading(response.data.currentTrading);
                setSelectedWallet(JSON.parse(atob(response.data.selectedWallet)));
                setTokenAddress(response.data.currentTrading.token)
                setBuyAmount(response.data.currentTrading.buyAmount)
                setSellAmount(response.data.currentTrading.sellAmount)
                setFrequency(response.data.currentTrading.frequency)
                setSlippage(response.data.currentTrading.slippage)
                setBalance(response.data.balance);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const startTrading = async () => {

        if (selectedWallet === null) {
            toast.error("Please Select Wallet!");
            return;
        }

        if (tokenAddress === "" || tokenAddress === null || buyAmount === 0 || buyAmount === null || sellAmount === 0 || sellAmount === null) {
            toast.error("Please Enter Trading Information");
            return;
        }

        if ((balance / (10 ** 9)) < buyAmount || (balance / (10 ** 9)) < sellAmount) {
            toast.error("Balance is insufficient!");
            return;
        }

        setIsLoading(true);

        const body = {
            token: tokenAddress,
            buyAmount: buyAmount,
            sellAmount: sellAmount,
            frequency: frequency,
            slippage: slippage,
            walletId: selectedWallet?.id,
            status: true
        }

        console.log("body", body)

        await axios.post(`${process.env.REACT_APP_API_URL}/tradingInfos/startTrading`, body, { headers })
            .then(function (response) {
                toast.success(response.data.message);
                setCurrentTrading(response.data.currentTrading);
                setIsLoading(false);
            })
            .catch(function (error) {
                toast.error(error.response.data.message);
                setIsLoading(false);
            });

    }

    const stopTrading = async () => {
        setIsLoading(true);
        await axios.post(`${process.env.REACT_APP_API_URL}/tradingInfos/stopTrading`, { headers })
            .then(function (response) {
                toast.success(response.data.message);
                setCurrentTrading(response.data.latestInfo);
                setTokenAddress(response.data.latestInfo.token)
                setBuyAmount(response.data.latestInfo.buyAmount)
                setSellAmount(response.data.latestInfo.sellAmount)
                setFrequency(response.data.latestInfo.frequency)
                setIsLoading(false);
            })
            .catch(function (error) {
                toast.error(error.response.data.message);
                setIsLoading(false);
            });
    }

    const getTransactionList = async () => {
        setIsLoading1(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/transactions/getTransactionList`, { headers })
            .then(function (response) {
                setTransactionList(response.data.transactionList);
                setIsLoading1(false);
            })
            .catch(function (error) {
                console.log(error);
                setIsLoading1(false);
            })
    }

    const updatePassword = async () => {
        if (opassword === "" || password === "" || cpassword === "") {
            toast.error("Please enter passwords");;
            return;
        }

        if (password !== cpassword) {
            toast.error("Passwords do not match.");;
            return;
        }

        const userData = JSON.parse(_user!);
        console.log("userData", userData)


        const body = {
            userId: userData.id,
            opassword: opassword,
            password: password,
        }

        await axios.post(`${process.env.REACT_APP_API_URL}/user/updatePassword`, body, { headers })
            .then(function (response) {
                toast.success(response.data.message);
                handleClose();
            })
            .catch(function (error) {
                toast.error(error.response.data.message);
            });
    }

    const logOut = async () => {
        setUser(null);
        window.localStorage.setItem('user', '');
        window.localStorage.setItem('token', '');
    }

    useEffect(() => {
        getWalletLists();
    }, [selectedWallet]);

    useEffect(() => {
        getTransactionList();
        getWalletLists();
        getTradingStatus();
    }, []);

    if (!user && _user === '') {
        return (
            <Navigate to="/" replace />
        )
    }


    return (
        <div className="HomePage">
            <section className="py-5">
                <Container>
                    <Row>
                        <Col sm={12} lg={12} className="mb-3 text-end">
                            <Button className="mb-3 ms-3 text-center rounded-0 py-1 px-2 bg-transparent border-1 Main-btn" onClick={handleShow}><Image src={SettingIcon} width={20} alt="clipboard" className="mb-1" /></Button>
                            <Button className="mb-3 ms-3 text-center rounded-0 py-1 px-2 bg-transparent border-1 Main-btn" onClick={logOut}><Image src={LogoutIcon} width={20} alt="clipboard" className="mb-1" /></Button>
                        </Col>
                        <Col sm={12} lg={6} className="mb-5">
                            <MainCard title="Trading Info">
                                <Row>
                                    <Col xs={6} lg={6} className="mb-3 d-flex align-items-center">
                                        {walletList.length < 1 ? (
                                            <Button className="Main-btn rounded-0 fw-bold" onClick={createWallet}>CREATE WALLET</Button>
                                        ) : (
                                            <Dropdown role="menuitemradio">
                                                <Dropdown.Toggle variant="success" id="dropdown-basic" className="Main-btn rounded-0 fw-bold mb-3" disabled={((currentTrading?.status === false || currentTrading === null) || currentTrading === null) ? false : true}>
                                                    {selectedWallet === null ? "Select Wallet" : ((JSON.parse(selectedWallet?.address)).slice(0, 4) + "..." + (JSON.parse(selectedWallet?.address)).slice(-4))}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {walletList?.map((item, index) => (
                                                        <Dropdown.Item as="li" key={index}>
                                                            <Form.Check
                                                                inline
                                                                label={(JSON.parse(item.address)).slice(0, 4) + "..." + (JSON.parse(item.address)).slice(-4)}
                                                                name={`group`}
                                                                type='radio'
                                                                id={`inline-radio-${index}`}
                                                                onClick={() => selectWallet(item.id)}
                                                                defaultChecked={item.active}
                                                            />
                                                        </Dropdown.Item>
                                                    ))}
                                                    <Dropdown.Item as="li">
                                                        <Button className="Main-btn rounded-0 fw-bold" onClick={createWallet}>CREATE WALLET</Button>
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        )}
                                        <Button className="mb-3 ms-3 text-center rounded-0 py-1 px-2 bg-transparent border-1 Main-btn" onClick={() => { copy(selectedWallet?.address as string); toast.info("Wallet Address Copied!") }}><Image src={ClipboardIcon} width={20} alt="clipboard" className="mb-1" /></Button>
                                        <Button className="mb-3 ms-3 text-center rounded-0 py-1 px-2 bg-transparent border-1 Main-btn" onClick={() => { copy(base58.encode(Object.values(JSON.parse(selectedWallet?.privateKey as string))) as string); toast.info("Private key Copied!"); console.log(base58.encode(Object.values(JSON.parse(selectedWallet?.privateKey as string)))) }}><Image src={KeyIcon} width={20} alt="clipboard" className="mb-1" /></Button>
                                    </Col>
                                    <Col xs={6} lg={6} className="mb-3 text-end fw-bold fs-6 d-flex align-items-center justify-content-end">
                                        Balance: {balance / (10 ** 9)} SOL
                                    </Col>
                                    <Col sm={12} lg={12} className="mb-3">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Token address</Form.Label>
                                            <Form.Control type="text" className="rounded-0 bg-transparent" disabled={(currentTrading?.status === false || currentTrading === null) ? false : true} value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} required />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6} lg={6} className="mb-3">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Buy Amount <small>(SOL)</small></Form.Label>
                                            <Form.Control type="number" className="rounded-0 bg-transparent" disabled={(currentTrading?.status === false || currentTrading === null) ? false : true} value={buyAmount} onChange={(e) => setBuyAmount(parseFloat(e.target.value))} required />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6} lg={6} className="mb-3">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Sell Amount <small>(SOL)</small></Form.Label>
                                            <Form.Control type="number" className="rounded-0 bg-transparent" disabled={(currentTrading?.status === false || currentTrading === null) ? false : true} value={sellAmount} onChange={(e) => setSellAmount(parseFloat(e.target.value))} required />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12} lg={6} className="mb-3">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Delay <small>(Seconds)</small></Form.Label>
                                            <InputGroup>
                                                <Form.Control className="rounded-0 bg-transparent" type="number" disabled={(currentTrading?.status === false || currentTrading === null) ? false : true} value={frequency} onChange={(e) => setFrequency(parseFloat(e.target.value))} required />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12} lg={6} className="mb-3">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Slippage <small>(%)</small></Form.Label>
                                            <InputGroup>
                                                <Form.Control className="rounded-0 bg-transparent" type="number" disabled={(currentTrading?.status === false || currentTrading === null) ? false : true} value={slippage} onChange={(e) => setSlippage(parseFloat(e.target.value))} required />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12} lg={12} className="mb-3 text-center">
                                        {(currentTrading?.status === false || currentTrading === null) ? (
                                            <Button className="Main-btn rounded-0 fw-bold px-5" type="submit" onClick={startTrading}>{isLoading === true ? <Spinner animation="border" role="status" /> : "START"}</Button>
                                        ) : (
                                            <Button className="Main-btn rounded-0 fw-bold px-5" type="submit" onClick={stopTrading}>{isLoading === true ? <Spinner animation="border" role="status" /> : "STOP"}</Button>
                                        )}
                                    </Col>
                                </Row>
                            </MainCard>
                        </Col>
                        <Col sm={12} lg={6} className="ms-auto mb-5">
                            <MainCard title="Transaction List" button={<Button className="text-center rounded-0 py-1 px-2 bg-transparent border-1 Main-btn" onClick={getTransactionList}>{isLoading1 === true ? <Spinner animation="border" style={{width:20, height:20}} role="status" /> : <Image src={RefreshIcon} width={20} alt="refresh" />}</Button>}>
                                <TransactionTable data={transactionList} />
                            </MainCard>
                        </Col>
                    </Row>
                </Container >
            </section >
            <Modal show={show} onHide={handleClose} centered data-bs-theme="dark">
                <Modal.Body className="p-0">
                    <MainCard title="Update Password">
                        <Col sm={12} lg={12} className="mb-3">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Old Password</Form.Label>
                                <Form.Control type="password" className="rounded-0 bg-transparent" value={opassword} onChange={(e) => setOPassword(e.target.value)} required />
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
                            <Button className="Main-btn rounded-0 fw-bold px-5 mx-2" onClick={updatePassword}>Update Password</Button>
                            <Button className="Main-btn rounded-0 fw-bold px-5 mx-2" onClick={handleClose}>Cancel</Button>
                        </Col>
                    </MainCard>
                </Modal.Body>
            </Modal>
        </div >
    );
}

export default HomePage;
