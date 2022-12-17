import {
    Routes, Route, Link, NavLink, useParams, Outlet
} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';


const MoviesLayout = () => {
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
                        
                        <NavLink className="btn" to="/movies">Movies</NavLink>
                        <NavLink className="btn" to="/movies/1">Movie 1</NavLink>
                        <NavLink className="btn" to="/movies/2">Movie 2</NavLink>
                        <Outlet /> { /* subpages will appear here */}
                    </div>
                </Col >
            </Row >
        </Container >
</>
    )
};




function MoviesList() {

    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");

        
    async function loadMovies() {
        try {
            const res = await fetch("http://localhost:5001/api/movies/")
            const json = await res.json();
            setItems(json);
            setStatus("done");
        } catch (e) {
            setStatus("an error")
        }
    }

    useEffect(() => { loadMovies() }, []);

    return (
        <div><h1> Pleses wait some time.... </h1>
            {(status === "done") &&
                <Container className="custom-grid-flex">
                    <Row xs={1} md={3} className="custom-width g-4">
                        {

                            items.$values.map((item) => (

                                <Col>
                                    <Card className="card-element-movie" key={item.url} style={{ width: '18rem' }} >
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
        </div >
    );
}





    /*const [movies, setMovies] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5001/api/movies')
            .then((res) => res.json())
            .then((movieData) => {
                setMovies(movieData);
            });
    }, []);

    return <div> {movies?.map((movies) => {
        return <li className="" key={movies.tconst}> {movies.tconst} </li>
    })}</div>*/
   



/*function MovieItemGrid() {
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5001/api/movies')
            .then((res) => res.json())
            .then((movieData) => {
                setMovies(movieData);
            });
    }, []);

    /*<Route exact path='/'>
        <Home movies={movies} />
    </Route>*/ // this code is for a page
    /*------------above code should maybe be placed in app.jsx----------------------------------------------*/

    //}

  /*  function Moviecontainer({ movies }) {
        const movieArr = movies.map((movie) => {
            return <movieCard key={movie.tconst} movie={movie} />
        });
        return <div id="image-field"> {movieArr} </div>

    } // remember to export this*/

   /* function MovieCard({ movie }) {
        function displayMovie() {
        }

        <div id="image-container" onClick={displayMovie}>
            <div id="card-image">
                <img
                    className="movieCard-image"
                    src={movie.omdB_Datasets.poster}
                    alt="Movie poster"
                />
            </div>
            <h2 id="tittles">{movie.title}</h2>
        </div>

    } // data might be different - movie.title - might be called something else

*/
    const Movie = () => {
        const { tconst } = useParams();
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <div>
                            <p>This is Movie #{tconst}.</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

export { MoviesLayout, MoviesList, Movie };

