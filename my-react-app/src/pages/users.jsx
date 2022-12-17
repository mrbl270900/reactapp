import {
    Routes, Route, Link, NavLink, useParams, Outlet, useNavigate
} from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';


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
            
            <NavLink className="btn" to="/users">index</NavLink>
            <NavLink className="btn" to="/users/1">User 1</NavLink>
            <NavLink className="btn" to="/users/2">User 2</NavLink>
            <NavLink className="btn" to="/users/new">Create new user</NavLink>
            <Outlet /> { /* subpages will appear here */}
            </div>
            </>
            )
};

const UsersList = () => {
   return( <div>
        <p>List of all users</p>
        <p>See for example <Link to="1">User 1</Link>.</p>
    </div>)
}


function User() {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const cookies = new Cookies();

    async function GetUser() {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': cookies.get("Token")
                }
            };

            const res = await fetch("http://localhost:5001/api/users/" + cookies.get("UserId"), requestOptions)
            const json = await res.json();
            setItems(json);
            setStatus("done");
        } catch (e) {
            setStatus("an error")
        }
    }
    return (
        <div>
            <p>This is user {items.userid}</p>
        </div>
    );
}

function NewUser() {
    const [status, setStatus] = useState("idle");
    const navigate = useNavigate();

        async function CreateUser(event) {
            event.preventDefault();
            console.log(event.target[0].value);
            console.log(event.target[1].value);
            console.log(event.target[2].value);
            console.log("submit");
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
                setStatus("done");
            } catch (e) {
                setStatus("an error")
            }
    }

    return(
    <div>
        <p>Create a new user</p>
            <Form onSubmit={CreateUser} className="d-flex">
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
                />
                <Form.Control
                    type="Password"
                    placeholder="Password"
                    className="me-3"
                    aria-label="Password"
                />
            <Button type="submit" variant="outline-success">Make User</Button>
            </Form>
            {(status === "done") &&
                <h1>
                    {console.log("du er registret")}
                    Du er nu registeret
                    {navigate("/users/login")}
                    {navigate(0)}
                </h1>
            }
    </div>);
}

function LoginUser() {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const cookies = new Cookies();

    async function Login(event) {
        event.preventDefault();
        console.log(event.target[0].value)
        console.log(event.target[1].value)
        console.log("submit");
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
            setStatus("done");
        } catch (e) {
            setStatus("an error")
        }
    }

    return (
        <div>
            <p>Create a new user</p>
            <Form onSubmit={Login} className="d-flex">
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
                />
                <Button type="submit" variant="outline-success">Log In</Button>
            </Form>
            {(status === "done") &&
                <h1>
                    {console.log(items.token)}
                    {cookies.set("Token", items.token)}
                    {cookies.set("UserId", items.userid)}
                    {console.log(cookies.get("Token"))}
                    {console.log(cookies.get("UserId"))}
                </h1>
            }
        </div>);
}


export { UsersLayout, UsersList, User, NewUser, LoginUser };