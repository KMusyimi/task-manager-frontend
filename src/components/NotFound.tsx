import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className='not-found-container'><section className='sect-width not-found'>
      <h1 className='fw-700'>Sorry, the page you were looking for was not found.</h1>
      <Link className='fw-700' to={'/'}>Return to home</Link>
    </section></div>
  );
}