import {Routes, Route, Link, NavLink, useParams, Outlet} from "react-router-dom";
import './App.css';
//page imports
import Header from "./components/Header.jsx";
import Main from "./pages/home";
import { UsersLayout, UsersList, User, NewUser, LoginUser } from "./pages/users";
import { MoviesLayout, MoviesList, Movie } from "./pages/movies";
import { PersonsLayout, PersonsList, Person } from "./pages/persons";
import { SearchLayout, SearchList } from "./pages/search";
import Error from "./pages/error";
import Footer from "./components/Footer.jsx";
// bootstrap imports
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
    return(
    <>
        <Header />

        <Routes>
                <Route path="/" element={<Main />} >
                    <Route index element={<MoviesList />}></Route>
                    <Route path="/movies/:page/:pagesize" index element={<MoviesList />} />
                    <Route path="/persons/:page/:pagesize" element={<PersonsList />} />
            </Route>

            <Route path="/users" element={<UsersLayout />}>
                <Route index element={<User />} />
                <Route path="/users/:userid" element={<User />} />
                <Route path="/users/new" element={<NewUser />} />
                <Route path="/users/login" element={<LoginUser />} />
            </Route>
            <Route path="/movies" element={<MoviesLayout />} >
                <Route path="/movies/:page/:pagesize" index element={<MoviesList />} />
                <Route path="/movies/:tconst" element={<Movie />} />
            </Route>
            <Route path="/persons" element={<PersonsLayout />} >
                <Route path="/persons/:page/:pagesize" index element={<PersonsList />} />
                <Route path="/persons/:nconst" element={<Person />} />
            </Route>
            <Route path="/search/:input" element={<SearchLayout />} >
                <Route index element={<SearchList />} />
            </Route>
            <Route path="*" element={<Error />} />
        </Routes>

        <Footer />

    </>);
}


export default App;
