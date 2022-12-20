import {
    Routes, Route, Link, NavLink, useParams, Outlet, useNavigate
} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useCookies } from 'react-cookie'
import Pagination from 'react-bootstrap/Pagination';
import Figure from 'react-bootstrap/Figure';
import Accordion from 'react-bootstrap/Accordion';
import Carousel from 'react-bootstrap/Carousel';


function MoviesLayout() {
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
            <Container className="body-container">
                <Container fluid>
                    <Row>
                        <Col>
                            <div>
                                <div className="custom-grid-flex justify-content-center" style={{marginTop:"20px"}}>
                                    <NavLink className="btn" to="/movies/0/25" style={{ borderColor: "black", marginTop: "20px" }}>Movies</NavLink>
                                    <NavLink className="btn" to="/persons/0/25" style={{ borderColor: "black", marginTop: "20px" }}>Persons</NavLink>
                                </div>
                                <Outlet /> { /* subpages will appear here */}
                            </div>
                        </Col >
                    </Row >
                </Container >
            </Container>
        </>
    )
};




function MoviesList() {
    const [cookies, setCookie] = useCookies(['token', 'user_id'])
    var { page } = useParams();
    var { pagesize } = useParams();
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const navigate = useNavigate();
    let pagPages = [];
    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    var minPage = Number(page) - 2;
    var maxPage = Number(page) + 4;
    if (minPage < 1) {
        minPage = 1;
        maxPage = 7;
    }

    for (let number = minPage; number <= maxPage; number++) {
        var numbers = Number(number) - 1;
        var pagnavlink = "/movies/" + numbers + "/25";
        pagPages.push(
            <NavLink onClick={goToTop} className="btn" to={pagnavlink}>
                {number}
            </NavLink>,
        );
    }




    async function loadMovies() {
        if (page === undefined) {
            page = 0;
        }
        if (pagesize === undefined) {
            pagesize = 25;
        }


        try {
            const res = await fetch("http://localhost:5001/api/movies/" + page + "/" + pagesize)
            const json = await res.json();
            setItems(json);
            setStatus("done");
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

    async function goToMovie(tconst) {
        {
            await fetch("http://localhost:5001/api/movies/" + tconst + "/visited");
            (cookies.user_id != undefined) &&
                userClickedMovie(tconst);
        }
        navigate("/movies/" + tconst);
    }


    useEffect(() => { loadMovies() }, [page]);

    return (
        <div><h2 className="custom-grid-flex justify-content-center"> All movies </h2>
            <div className="custom-grid-flex justify-content-center">
                <Pagination linkAs={NavLink}
                    total={100} limit={10} >{pagPages}</Pagination>
            </div>


            {(status === "done") &&
                <Container className="custom-grid-flex justify-content-center">
                    <Row xs={1} md={3} className="custom-width g-4">
                        {

                            items.$values.map((item) => (

                                <Col>
                                    <Card onClick={() => goToMovie(item.omdB_Datasets.tconst)} className="card-element-movie" key={item.url} style={{}} >
                                        <Card.Img src={item.omdB_Datasets?.poster} style={{ maxHeight: '18rem' }}></Card.Img>
                                        <Card.Title style={{ padding: '20px' }}>{item.primarytitle}</Card.Title>
                                        <Card.Text style={{ padding: '20px' }}>{item.omdB_Datasets?.plot.slice(0, 250) + "..."}</Card.Text>
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                </Container>
            }
            <div className="custom-grid-flex justify-content-center">
                <Pagination linkAs={NavLink}
                    total={100} limit={10} >{pagPages}</Pagination>
            </div>

        </div >
    );
}

function Movie() {
    const [cookies, setCookie] = useCookies(['token', 'user_id'])
    const { tconst } = useParams();
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [similarMovies, setSimilarMovies] = useState([]);
    const [movieActors, setmovieActors] = useState([]);


    async function bookmarkMovie(event) {
        event.preventDefault();

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
            const res = await fetch("http://localhost:5001/api/users/create_title_bookmark", requestOptions);
            setStatus("done");
        } catch (e) {
            setStatus("an error")
        }
    }

    async function rateMovie(event) {
        event.preventDefault();
        let data = {
            "userid": cookies.user_id,
            "tconst": tconst,
            "rating": event.target[0].value

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
            const res = await fetch("http://localhost:5001/api/users/create_rating", requestOptions);
            setStatus("done");
        } catch (e) {
            setStatus("an error")
        }
    }


    async function loadMovie() {
        try {
            const res = await fetch("http://localhost:5001/api/movies/" + tconst);
            const json = await res.json();
            setItems(json);
            const res2 = await fetch("http://localhost:5001/api/movies/" + tconst + "/similarmovies");
            const json2 = await res2.json();
            setSimilarMovies(json2);
            const res3 = await fetch("http://localhost:5001/api/person/" + tconst + "/movieactorsbyrating");
            const json3 = await res3.json();
            setmovieActors(json3);
            setStatus("done");
        } catch (e) {
            setStatus("an error")
        }
    }


    useEffect(() => { loadMovie() }, [tconst]);

    return (
        <div>
            {(status === "done") &&
                <Container fluid style={{ padding: "20px" }}>
                    {console.log(items)}
                    {console.log(similarMovies)}
                    {console.log(movieActors)}
                    <Container className="custom-grid-flex justify-center" style={{ border: "solid 1px", padding: "20px", borderRadius: "5px" }}>
                        <Row xs={1} md={2} className="custom-grid-flex">
                            <Col className="sm">
                                <Figure style={{ display: "block" }}>
                                    <Figure.Image
                                        width="100%"
                                        height="100%"
                                        alt="Movie poster"
                                        src={items.movie_Ratings.movie_title.omdB_Datasets.poster}
                                    />
                                    <Figure.Caption>
                                        Poster for movie {items.primarytitle}
                                    </Figure.Caption>
                                </Figure>
                            </Col>
                            <Col className="sm">
                                <h2>{items.primarytitle}</h2>
                                <p>{items.movie_Ratings.movie_title.omdB_Datasets.plot}</p>
                            </Col>
                        </Row>

                    </Container>
                    <Container style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                        <Row>
                            <Col>
                                <Accordion defaultActiveKey="0">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Actors</Accordion.Header>
                                        <Accordion.Body>
                                            {
                                                movieActors.$values.map((item) => (


                                                    <li><NavLink to={"/persons/" + item.nconst}>{item.primaryname}</NavLink> Rating: {item.name_rating}</li>

                                                ))
                                            }
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </Col>
                        </Row>
                    </Container>
                    {(similarMovies.$values.length > 0) &&
                        <Container style={{ paddingBottom: "20px" }}>
                            <Row>
                                <Col>
                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>Similar Movies</Accordion.Header>
                                            <Accordion.Body>
                                                {
                                                    similarMovies.$values.map((item) => (


                                                        <li><NavLink to={"/movies/" + item.tconst}>{item.primarytitle}</NavLink></li>

                                                    ))
                                                }
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </Col>
                            </Row>
                        </Container>
                    }
                    {(similarMovies.$values.length < 1) &&
                        <h2>No similar movies found :-(</h2>
                    }

                    {(cookies.user_id != undefined) &&
                        <div>
                            <h2>Write your rating: </h2>
                            <form onSubmit={rateMovie}>
                                <Form.Control
                                    type="Rating"
                                    placeholder="Rating"
                                    className="me-3"
                                    aria-label="Rating"
                                    style={{ width:"20px" }}
                                />
                                <button className="btn" type="submit" variant="outline-success" style={{marginTop: "10px" }} >rate movie</button>
                            </form>
                            <form onSubmit={bookmarkMovie}>
                                <button className="btn" type="submit" variant="outline-success" style={{width: "100px", marginTop: "10px"}} >bookmark</button>
                            </form>
                        </div>
                    }
                </Container>
            }
        </div >
    );
}

export { MoviesLayout, MoviesList, Movie };

