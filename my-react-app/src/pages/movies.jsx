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
                                <div className="custom-grid-flex justify-content-center">
                                    <NavLink className="btn" to="/movies/0/25">Movies</NavLink>
                                    <NavLink className="btn" to="/persons/0/25">Persons</NavLink>

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
                                    <Card onClick={() => goToMovie(item.omdB_Datasets.tconst)} className="card-element-movie" key={item.url} style={{ }} >
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
        <div><h1> her er filmen </h1>
            {(status === "done") &&
                <Container className="custom-grid-flex">
                    {console.log(items)}
                    {console.log(similarMovies)}
                    {console.log(movieActors)}
                    <h1>{items.primarytitle}</h1>
                    {(cookies.user_id != undefined) &&
                        <div>
                            <form onSubmit={bookmarkMovie}>
                                <button type="submit" variant="outline-success" >bookmark</button>
                            </form>
                            <form onSubmit={rateMovie}>
                                <Form.Control
                                    type="Rating"
                                    placeholder="Rating"
                                    className="me-3"
                                    aria-label="Rating"
                                />
                                <button type="submit" variant="outline-success" >rate movie</button>
                            </form>
                        </div>
                    }
                </Container>
            }
        </div >
    );
}

export { MoviesLayout, MoviesList, Movie };

