import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Main = () => {
    return (
        <>
    <div
            className='p-5 text-center bg-image'
                style={{ backgroundImage: "url('https://img.freepik.com/free-vector/cinema-open-neon-sign_1262-15882.jpg?w=1380&t=st=1671272486~exp=1671273086~hmac=0b6812aa897b6fda9c355a881667e89df08b25342000ddfd4554d5fb77f11bc1')", height: 400 }}
        >
                <div className='mask custom-inner' style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                <div className='d-flex justify-content-center align-items-center h-100'>
                    <div className='text-white'>
                        <h1 className='mb-3'>Group 7's AMAZING app</h1>
                        <h2 className='mb-3'>This is the front page of Group 7's AMAZING app</h2>
                       
                    </div>
                </div>
            </div>
        </div>
    
        <Container fluid>
            <Row>
                <Col>

                    <h1>Front page</h1>

                </Col>
            </Row>
        </Container>
        </>
    );
}

export default Main;