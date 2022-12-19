import {
    Routes, Route, Link, NavLink, useParams, Outlet, useNavigate
} from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie'
import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';


const UsersLayout = () => {
    return (
        <>
            <div
                className='p-5 text-center bg-image'
                style={{ backgroundImage: "url('https://img.freepik.com/free-vector/cinema-open-neon-sign_1262-15882.jpg?w=1380&t=st=1671272486~exp=1671273086~hmac=0b6812aa897b6fda9c355a881667e89df08b25342000ddfd4554d5fb77f11bc1')", height: 400 }}
            >
                <div className='mask custom-inner' style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                    <div className='d-flex justify-content-center align-items-center h-100'>
                        <div className='text-white'>
                            <h1 className='mb-3'>A Page for users</h1>
                            <h2 className='mb-3'>This is a page for users</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div>

                <Outlet /> { /* subpages will appear here */}
            </div>
        </>
    )
};


function User() {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'user_id'])
    const navigate = useNavigate();

    async function GetUser() {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + cookies.token
                }
            };

            const res = await fetch("http://localhost:5001/api/users/" + cookies.user_id, requestOptions)
            const json = await res.json();
            setItems(json);
            setStatus("done");
        } catch (e) {
            setStatus("an error")
        }
    }

    function LogOut(e) {
        e.preventDefault();
        removeCookie("token", { path: '/' });
        removeCookie("user_id", { path: '/' });
        { navigate("/users/login") }
    }

    async function DeleteUser(e) {
        e.preventDefault();

        let data = {
            "userid": cookies.user_id,
            "tconst": "tt12345678"
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
            const res = await fetch("http://localhost:5001/api/users/delete_user", requestOptions);
            removeCookie("token", { path: '/' });
            removeCookie("user_id", { path: '/' });
            { navigate("/") }
        } catch (e) {
            setStatus("an error")
            { navigate("/users") }
        }

    }

    useEffect(() => { GetUser() }, [cookies]);

    return (
        <div>

            {(status === "done") &&
                <div>
                    {console.log(items)}
                    <h2 className="custom-grid-flex justify-content-center">Welcome to your page '{items.userid}'</h2>
                    <Container className="justify-content-center" >
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Your bookmarks</Accordion.Header>
                                <Accordion.Body>
                                    <h3>Movie bookmarks: </h3>
                                    {items.users_bookmark_titles.$values.map((item) => (

                                        < li > <NavLink to={"/movies/" + item.tconst} >{item.tconst}</NavLink></li>

                                    ))
                                    }
                                    <h3>Person bookmarks: </h3>
                                    {items.users_bookmark_names.$values.map((item) => (

                                        < li > <NavLink to={"/persons/" + item.nconst} >{item.nconst}</NavLink></li>

                                    ))
                                    }
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Your ratings</Accordion.Header>
                                <Accordion.Body>
                                    <h3>Movies ratings: </h3>
                                    {items.user_Ratings.$values.map((item) => (

                                        < li > <NavLink to={"/movies/" + item.tconst} >{item.tconst} </NavLink> Your Rating: {item.rating} </li>

                                    ))
                                    }
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Your search history</Accordion.Header>
                                <Accordion.Body>
                                    <h3>Search Words: </h3>
                                    {items.search_historys.$values.map((item) => (

                                        < li >{item.searchword} </li>

                                    ))
                                    }
                                    <h3>Searched Movies: </h3>
                                    {items.title_Searches.$values.map((item) => (

                                        < li > <NavLink to={"/movies/" + item.tconst} >{item.tconst} </NavLink> </li>

                                    ))
                                    }
                                    <h3>Searched Persons: </h3>
                                    {items.person_historys.$values.map((item) => (

                                        < li > <NavLink to={"/persons/" + item.nconst} >{item.nconst} </NavLink> </li>

                                    ))
                                    }
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <Form onSubmit={LogOut} style={{ marginTop: "10px" }}>
                            <Button type="submit" variant="outline-success">Log Out</Button>
                        </Form>
                        <Form onSubmit={DeleteUser} style={{ marginTop: "10px", marginBottom: "100px" }}>
                            <Button type="submit" variant="outline-success">Delete your user</Button>
                        </Form>
                    </Container>

                </div>
            }
            {(status === "an error") &&
                <div>
                    {navigate("/users/login")}
                </div>
            }
        </div>
    );
}

function NewUser() {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [cookies, setCookie] = useCookies(['token', 'user_id']);
    const navigate = useNavigate();

    async function CreateUser(event) {
        event.preventDefault();
        let userdata = {
            "Name": event.target[0].value,
            "UserName": event.target[1].value,
            "Password": event.target[2].value,
        }
        try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userdata)
            };

            const res = await fetch("http://localhost:5001/api/users/register", requestOptions)
            try {
                Login(event);
            } catch (e) {
                setStatus("an error")
            }
        } catch (e) {
            setStatus("an error")
        }
    }

    async function Login(event) {
        let userdata = {
            "Username": event.target[1].value,
            "Password": event.target[2].value,
        }
        try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userdata)
            };

            const res = await fetch("http://localhost:5001/api/users/login", requestOptions)
            const json = await res.json();
            if (json.title === "Bad Request") {
                setStatus("an error")
            } else {
                setItems(json);
                setStatus("done");
            }
        } catch (e) {
            setStatus("an error")
        }
    }

    return (
        <div>
            <h1 className="custom-grid-flex justify-content-center" style={{ marginTop: "10px", marginBottom: "10px" }}>Create user</h1>
            <Container fluid className="custom-grid-flex justify-content-center">
                <Form onSubmit={CreateUser} className="" style={{ width: "66.66%", paddingBottom: "100px" }}>
                    <Form.Control
                        type="Name"
                        placeholder="Name"
                        className="me-3"
                        aria-label="Name"
                    />
                    <Form.Control
                        type="Username"
                        placeholder="Username"
                        className="me-3"
                        aria-label="Username"
                        style={{ marginTop: "10px" }}
                    />
                    <Form.Control
                        type="Password"
                        placeholder="Password"
                        className="me-3"
                        aria-label="Password"
                        style={{ marginTop: "10px" }}
                    />

                    <Button type="submit" variant="outline-success" style={{ marginTop: "10px", marginRight: "10px", marginBottom: "10px" }}>Create user</Button>
                    <NavLink className="btn" to="/users/login" style={{ borderColor: "black", marginTop: "10px", marginBottom: "10px" }}> Log in</NavLink>
                </Form>
            </Container>
            {(status === "done") &&
                <h1>
                    {setCookie("token", items.token, { path: '/' })}
                    {setCookie("user_id", items.userid, { path: '/' })}
                    {navigate("/users")}
                </h1>
            }
            {(status === "an error") &&
                <h2 className="custom-grid-flex justify-content-center" style={{ color: "red" }}>
                    Creating user failed try diffrent user name
                </h2>
            }
        </div>);
}

function LoginUser() {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [cookies, setCookie] = useCookies(['token', 'user_id']);
    const navigate = useNavigate();


    async function Login(event) {
        event.preventDefault();
        let userdata = {
            "Username": event.target[0].value,
            "Password": event.target[1].value,
        }
        try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userdata)
            };

            const res = await fetch("http://localhost:5001/api/users/login", requestOptions)
            const json = await res.json();
            setItems(json);
            if (json.title === "Bad Request") {
                setStatus("an error")
            } else {
                setStatus("done");
            }
        } catch (e) {
            setStatus("an error")
        }
    }

    return (
        <div>
            <h1 className="custom-grid-flex justify-content-center" style={{ marginTop: "10px", marginBottom: "10px" }}>Log In</h1>
            <Container fluid className="custom-grid-flex justify-content-center">
                <Form onSubmit={Login} className="" style={{ width: "66.66%", paddingBottom: "100px" }}>
                    <Form.Control
                        type="Username"
                        placeholder="Username"
                        className="me-3"
                        aria-label="Username"
                    />
                    <Form.Control
                        type="Password"
                        placeholder="Password"
                        className="me-3"
                        aria-label="Password"
                        style={{ marginTop: "10px" }}
                    />

                    <Button type="submit" variant="outline-success" style={{ marginTop: "10px", marginRight: "10px", marginBottom: "10px" }}>Log In</Button>
                    <NavLink className="btn" to="/users/new" style={{ borderColor: "black", marginTop: "10px", marginBottom: "10px" }}> Create User</NavLink>
                </Form>
            </Container>
            {(status === "done") &&
                <h1>
                    {setCookie("token", items.token, { path: '/' })}
                    {setCookie("user_id", items.userid, { path: '/' })}
                    {navigate("/users")}
                </h1>
            }
            {(status === "an error") &&
                <h2 className="custom-grid-flex justify-content-center" style={{ color: "red" }}>
                    Log in failed try diffrent log in info
                </h2>
            }
        </div>);
}


export { UsersLayout, User, NewUser, LoginUser };