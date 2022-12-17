import {
    Routes, Route, Link, NavLink, useParams, Outlet
} from "react-router-dom";


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


const User = () => {
    const { uid } = useParams();
    return (
        <div>
            <p>This is user #{uid}.</p>
        </div>
    );
}

const NewUser = () =>
    <div>
        <p>Create a new user</p>
    </div>;







export { UsersLayout, UsersList, User, NewUser };