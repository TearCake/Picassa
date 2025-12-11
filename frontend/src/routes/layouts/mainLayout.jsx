import './mainLayout.css';
import LeftBar from "../../components/leftbar/leftBar";
import TopBar from "../../components/topBar/topBar";
import Gallery from "../../components/gallery/gallery";
import { Outlet } from 'react-router';

export default function MainLayout() {
  return (
    <div className="app">
      <LeftBar />
      <div className="content">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
}
