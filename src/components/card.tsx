import { ReactNode } from "react";
import { Card, Image } from "react-bootstrap";
import HeaderIcon from '../assets/images/subject-icon.svg';

const MainCard = ({children, title, button} : {children: ReactNode, title: string, button?: ReactNode}) => {
    return (
        <Card className="MainCard rounded-0">
            <Card.Header className="d-flex align-items-center fw-bold fs-5 justify-content-between"><div className="d-flex align-items-center"><Image src={HeaderIcon} width={15} alt="icon" className="me-2"/><span>{title}</span></div><div>{button}</div></Card.Header>
            <Card.Body>
                {children}
            </Card.Body>
        </Card>
    );
}

export default MainCard;
