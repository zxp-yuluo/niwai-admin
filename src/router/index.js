import { Navigate, useRoutes } from "react-router-dom";
import Login from "../pages/login/login";
import Admin from "../pages/admin/admin";
import Home from "../components/home/Home";
import Sheet from '../components/sheet/Sheet';
import Manage from '../components/manage/Manage';
import Role from "../components/role/role";
import Song from '../components/song/Song';
import AddSong from "../components/song/add_song/add_song";
import SongRoot from "../components/song/song_root/song_root";
import Singer from "../components/singer/singer";
import Album from "../components/album/album";


const GetRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to="/login" />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/admin',
      element: <Admin />,
      children: [
        {
          path: '',
          element: <Navigate to="/admin/home" />
        },
        {
          path: 'home',
          element: <Home />
        },
        {
          path: 'sheet',
          element: <Sheet />
        },
        {
          path: 'song',
          element: <Song />,
          children: [
            {
              path: '',
              element: <SongRoot />
            },
            {
              path: 'add_song',
              element: <AddSong />
            },
            {
              path: 'modify_song/:id',
              element: <AddSong />
            }
          ]
        },
        {
          path: 'manage',
          element: <Manage />
        },
        {
          path: 'singer',
          element: <Singer />
        },
        {
          path: 'album',
          element: <Album />
        },
        {
          path: 'role',
          element: <Role />
        }
      ]
    },
  ])
  return routes
}

export default GetRoutes