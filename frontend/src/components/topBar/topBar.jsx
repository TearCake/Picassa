import './topBar.css'
import UserButton from '../userButton/userButton.jsx'
import ImageComponent from '../image/image.jsx'
import { useNavigate } from 'react-router';

export default function TopBar() {

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?search=${e.target[0].value}`);
  }

  return (
    <div className='topBar'>
      <form onSubmit={handleSubmit} className='search'>
        <ImageComponent path="/general/search.svg" alt="" />
        <input type="text" placeholder='Search' />
      </form>
      <UserButton />
    </div>
  )
}
