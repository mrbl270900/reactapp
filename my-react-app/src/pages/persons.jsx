import {
    Routes, Route, Link, NavLink, useParams, Outlet, useNavigate
} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { useCookies } from 'react-cookie'


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




function PersonsList() {
    const { page } = useParams();
const { pagesize } = useParams();
const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [cookies, setCookie] = useCookies(['token', 'user_id'])
    const navigate = useNavigate();
    let backpage = Number(page) - 1;
    let nextPage = Number(page) + 1;
    const bacOnePage = "/persons/" + backpage + "/25"
    const nextPageOne = "/persons/" + nextPage + "/25"

    function changePage(input) {
        if (input === "back") {
            navigate(bacOnePage);
            navigate(0);
        } else {
            navigate(nextPageOne);
            navigate(0);
        }

    }
async function loadMovies() {
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
        console.log(requestOptions);
        console.log(data);
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
        navigate(0);
    }

useEffect(() => { loadMovies() }, []);

return (
    <div><h1> Pleses wait some time.... </h1>
        <button onClick={() => changePage("back")}>forige side</button>
        <button onClick={() => changePage("next")}>naeste side</button>
        {(status === "done") &&
            <Container className="custom-grid-flex">
                {console.log(items)}
                <Row xs={1} md={3} className="custom-width g-4">
                    {

                        items.$values.map((item) => (

                            <Col>
                                <Card onClick={() => goToPerson(item.url.slice(-9))} className="card-element-movie" key={item.url} style={{ width: '18rem' }} >
                                    <Card.Title style={{ padding: '20px' }}>{item.primaryname}</Card.Title>
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



function Person() {
    const [cookies, setCookie] = useCookies(['token', 'user_id'])
    const { nconst } = useParams();
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [coPlayers, setCoPlayers] = useState([]);
    const [CoPlayerStatus, setCoPlayerStatus] = useState("idle");

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
        console.log(requestOptions);
        console.log(data);
        try {
            const res = await fetch("http://localhost:5001/api/users/create_person_bookmark", requestOptions);
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
            setStatus("done");
        } catch (e) {
            setStatus("an error")
        }
    }

    async function loadCoPlayers() { // ikke anvendt
        let string = items.primaryname
        let newStr = string.replace(" ", "%20");
        try {
            const res2 = await fetch("http://localhost:5001/api/person/" + newStr + "/findcoplayers");
            const json2 = await res2.json();
            setCoPlayers(json2);
            setCoPlayerStatus("coplayers loaded");
        } catch (e) {
            setCoPlayerStatus("an error")
        }
    }

    useEffect(() => { loadPersons() }, []);

    return (
        <div><h1> Pleses wait some time.... </h1>
            {(status === "done") &&
                <Container className="custom-grid-flex">
                    <h1>{items.primaryname}</h1>
                    {console.log(items)}
                    {(cookies.user_id != undefined) &&
                        <form onSubmit={bookmarkPerson}>
                            <button type="submit" variant="outline-success" >bookmark</button>
                        </form>
                    }
                </Container>
            }
        </div >
    );
}

export { PersonsLayout, PersonsList, Person };

