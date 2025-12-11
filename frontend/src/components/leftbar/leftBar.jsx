import ImageComponent from '../image/image'
import {Link} from 'react-router'
import './leftBar.css'

export default function LeftBar() {
  return (
    <div className='leftBar'>
      <div className="menuIcons">
        <Link to="/" className="menuIcon">
        <ImageComponent path="/general/abc.png" alt="" className='logo' />
        </Link>
        <Link to="/" className="menuIcon">
        <ImageComponent path="/general/home.svg" alt="" />
        </Link>
        <Link to="/create" className="menuIcon">
        <ImageComponent path="/general/create.svg" alt="" />
        </Link>
        <Link to="/" className="menuIcon">
        <ImageComponent path="/general/updates.svg" alt="" />
        </Link>
        <Link to="/" className="menuIcon">
        <ImageComponent path="/general/messages.svg" alt="" />
        </Link>
      </div>
      <Link to="/" className="menuIcon">
        <ImageComponent path="/general/settings.svg" alt="" />
        </Link>
    </div>
  )
}

