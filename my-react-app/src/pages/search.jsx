import {
    Routes, Route, Link, NavLink, useParams, Outlet, useNavigate
} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { useCookies } from 'react-cookie'


const SearchLayout = () => {
    return (
        <>
            <div
                className='p-5 text-center bg-image'
                style={{ backgroundImage: "url('https://img.freepik.com/free-vector/cinema-open-neon-sign_1262-15882.jpg?w=1380&t=st=1671272486~exp=1671273086~hmac=0b6812aa897b6fda9c355a881667e89df08b25342000ddfd4554d5fb77f11bc1')", height: 400 }}
            >
                <div className='mask custom-inner' style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                    <div className='d-flex justify-content-center align-items-center h-100'>
                        <div className='text-white'>
                            <h1 className='mb-3'>Movies</h1>
                            <h2 className='mb-3'>Have you checked out the movies yet?</h2>

                        </div>
                    </div>
                </div>
            </div>
            <Container fluid>
                <Row>
                    <Col>
                        <div>
                            <Outlet /> { /* subpages will appear here */}
                        </div>
                    </Col >
                </Row >
            </Container >
        </>
    )
};




function SearchList() {
    const { input } = useParams();
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [cookies, setCookie] = useCookies(['token', 'user_id']);
    const navigate = useNavigate();

    async function loadSearch(string) {
        const myArray = string.split(" ");

        try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(myArray)
            };
            let userdata = {
                "userid": cookies.user_id,
                "tconst": string
            }
            const requestOptions2 = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + cookies.token
                },
                body: JSON.stringify(userdata)
            };

            const res = await fetch("http://localhost:5001/api/movies/bestmatch", requestOptions)
            const json = await res.json();
            setItems(json);
            setStatus("done");
            try {
                await fetch("http://localhost:5001/api/users/create_search_word", requestOptions2)
            } catch (e) {
                setStatus("done")
            }
        } catch (e) {
            setStatus("an error")
        }
    }

    async function userClickedMovie(tconst) {
        let data = {
            "userid": cookies.user_id,
            "tconst": tconst
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + cookies.token
            },
            body: JSON.stringify(data)
        };
        console.log(requestOptions);
        console.log(data);
        try {
            const res = await fetch("http://localhost:5001/api/users/create_title_search", requestOptions);
        } catch (e) {
            setStatus("an error")
        }
    }

    function goToMovie(tconst) {
        {
            (cookies.user_id != undefined) &&
                userClickedMovie(tconst);
        }
        navigate("/movies/" + tconst);
        navigate(0);
    }

    useEffect(() => { loadSearch(input) }, []);


    return (
        <div><h1> Pleses wait some time.... </h1>
            {(status === "done") &&
                    <Container className="custom-grid-flex">
                    <Row xs={1} md={3} className="custom-width g-4">
                        {
                            
                            items.$values.map((item) => (

                            <Col>
                                    <Card onClick={() => goToMovie(item.tconst)} className="card-element-movie" key={item.tconst} style={{ width: '18rem' }} >
                                        <Card.Title style={{ padding: '20px' }}>{item.tconst}</Card.Title>
                                
                                </Card>
                            </Col>
                        ))
                        }
                        </Row>
                    </Container>
                    }
           </div >

        );
}

export { SearchLayout, SearchList };

