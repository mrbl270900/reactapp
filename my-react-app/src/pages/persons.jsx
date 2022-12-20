import {
    Routes, Route, Link, NavLink, useParams, Outlet, useNavigate
} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { useCookies } from 'react-cookie'
import Pagination from 'react-bootstrap/Pagination';
import ReactWordcloud from 'react-wordcloud';
import Accordion from 'react-bootstrap/Accordion';


const PersonsLayout = () => {
    return (
        <>
            <div
                className='p-5 text-center bg-image'
                style={{ backgroundImage: "url('https://img.freepik.com/free-vector/cinema-open-neon-sign_1262-15882.jpg?w=1380&t=st=1671272486~exp=1671273086~hmac=0b6812aa897b6fda9c355a881667e89df08b25342000ddfd4554d5fb77f11bc1')", height: 400 }}
            >
                <div className='mask custom-inner' style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                    <div className='d-flex justify-content-center align-items-center h-100'>
                        <div className='text-white'>
                            <h1 className='mb-3'>Persons</h1>
                            <h2 className='mb-3'>Have you checked out the people yet?</h2>

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
                                    <NavLink style={{ borderColor: "black", marginTop: "20px", marginRight: "10px" }} className="btn" to="/movies/0/25">Movies</NavLink>
                                    <NavLink style={{ borderColor: "black", marginTop: "20px" }} className="btn" to="/persons/0/25">Persons</NavLink>

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




function PersonsList() {
    const { page } = useParams();
    const { pagesize } = useParams();
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [cookies, setCookie] = useCookies(['token', 'user_id'])
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
        var pagnavlink = "/persons/" + numbers + "/25";
        pagPages.push(
            <NavLink onClick={goToTop} className="btn" to={pagnavlink}>
                {number}
            </NavLink>,
        );
    }

    async function loadPersons() {
        try {
            const res = await fetch("http://localhost:5001/api/person/" + page + "/" + pagesize)
            const json = await res.json();
            setItems(json);
            setStatus("done");
        } catch (e) {
            setStatus("an error")
        }
    }

    async function userClickedPerson(nconst) {
        let data = {
            "userid": cookies.user_id,
            "tconst": nconst
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + cookies.token
            },
            body: JSON.stringify(data)
        };
        try {
            const res = await fetch("http://localhost:5001/api/users/create_person_search", requestOptions);
        } catch (e) {
            setStatus("an error")
        }
    }

    function goToPerson(nconst) {
        {
            (cookies.user_id != undefined) &&
                userClickedPerson(nconst);
        }
        navigate("/persons/" + nconst);
    }

    useEffect(() => { loadPersons() }, [page]);

    return (
        <div><h2 className="custom-grid-flex justify-content-center"> All persons </h2>
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
                                    <Card onClick={() => goToPerson(item.url.slice(-9))} className="card-element-movie" key={item.url} style={{}} >
                                        <Card.Title style={{ padding: '20px' }}>{item.primaryname}</Card.Title>
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



function Person() {
    const [cookies, setCookie] = useCookies(['token', 'user_id'])
    const { nconst } = useParams();
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [coPlayers, setCoPlayers] = useState([]);
    const [CoPlayerStatus, setCoPlayerStatus] = useState("idle");
    const [words, setWords] = useState([]);
    const [cludeStatus, setCludeStatus] = useState("idle");
    var formatetwords = [];

    async function bookmarkPerson(event) {
        event.preventDefault();
        let data = {
            "userid": cookies.user_id,
            "tconst": nconst
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + cookies.token
            },
            body: JSON.stringify(data)
        };
        try {
            const res = await fetch("http://localhost:5001/api/users/create_name_bookmark", requestOptions);
            setStatus("done");
        } catch (e) {
            setStatus("an error")
        }
    }

    async function loadPersons() {
        try {
            const res = await fetch("http://localhost:5001/api/person/" + nconst)
            const json = await res.json();
            setItems(json);
            setStatus("next");
        } catch (e) {
            setStatus("an error")
        }
    }

    async function loadWordsForClude() {
        try {
            const res4 = await fetch("http://localhost:5001/api/person/" + items.primaryname + "/person_words");
            const json4 = await res4.json();
            setWords(json4);
            setCludeStatus("done")
        } catch (e) {
            setCludeStatus("an error")
        }
    }

    async function loadCoPlayers() {
        try {
            const res2 = await fetch("http://localhost:5001/api/person/" + items.primaryname + "/findcoplayers");
            const json2 = await res2.json();
            setCoPlayers(json2);
            setCoPlayerStatus("done");
        } catch (e) {
            setCoPlayerStatus("an error")
        }
    }
    /* const words1 = [
         { text: 'told', value: 64, },
         { text: 'mistake', value: 11, },
         { text: 'thought', value: 16, },
         { text: 'bad', value: 17, }
     ];*/

    useEffect(() => { loadPersons() }, [nconst]);

    if (status === "next") {
        loadCoPlayers()
        loadWordsForClude()
        setStatus("done");

    }
    console.log(words)
    console.log(words.$values)
    if (cludeStatus === "done") {
        for (var i = 0; i < words.$values.length; i++) {
            var wordFormat = { text: words.$values[i].word, value: words.$values[i].weight, };
            formatetwords.push(wordFormat);
        }
    }
    console.log(items)
    const options = {

        fontSizes: [15, 30],
        rotations: 2,
        rotationAngles: [90, 10],
    };
    const size = [300, 300];

    return (
        <div>
            {(status === "done") &&
                <div>
                    <Container className="">
                        {<ReactWordcloud
                            options={options}
                            size={size}
                            words={formatetwords}

                        />}
                        <h2>{items.primaryname}</h2>

                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>About {items.primaryname} </Accordion.Header>
                                <Accordion.Body>
                                    <li><strong>Name:</strong> {items.primaryname}</li>


                                    <li><strong>Birth Year:</strong> {items.birthyear} {(items.birthyear === "") &&
                                        <p>No data available</p>
                                    }</li>
                                    <li><strong>Death Year:</strong> {items.deathyear} {(items.deathyear === "") &&
                                        <p>No data available</p>
                                    }</li>
                                    <li><strong>Profession:</strong> {items.primaryprofession}</li>

                                    <li><strong>Rating:</strong> {items.name_rating} {(items.name_rating === null) &&
                                        <p>No data available</p>
                                    }</li>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>{items.primaryname} works with: </Accordion.Header>
                                <Accordion.Body>
                                    {(CoPlayerStatus === "done") &&
                                        <div>
                                            {coPlayers.$values.map((item) => (


                                                <li><NavLink to={"/persons/" + item.nconst}>{item.name}</NavLink> Appered together {item.frequency} time{(item.frequency > 1) && 
                                                "s"}</li>

                                            ))}
                                        </div>
                                    }
                                </Accordion.Body>
                                </Accordion.Item>
                            {/*<Accordion.Item eventKey="1">
                                <Accordion.Header>{items.primaryname} appered in movies </Accordion.Header>
                                <Accordion.Body>
                                    {(status === "done") &&
                                        <div>
                                            {items.partof.$values.map((item) => (


                                                <li><NavLink to={"/persons/" + item.movie_Title.tconst}>{item.movie_Title.primarytitle}</NavLink> and played {item.movie_Title.characters}</li>

                                            ))}
                                        </div>
                                    }
                                </Accordion.Body>
                            </Accordion.Item>*/}
                        </Accordion>



                        {(cookies.user_id != undefined) &&
                            <form onSubmit={bookmarkPerson}>
                                <button className="btn" type="submit" variant="outline-success" style={{ borderColor: "black", marginTop: "20px", marginBottom: "20px" }} >bookmark</button>
                            </form>
                        }
                    </Container>                   
                </div>
            }
        </div >
    );
}

export { PersonsLayout, PersonsList, Person };

