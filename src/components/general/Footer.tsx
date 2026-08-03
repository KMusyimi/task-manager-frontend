import { memo } from "framer-motion";
import { Link } from "react-router-dom";

function Footer()
{
  return (
    <footer className="footer">
      <div className="attribution el-flx">
        <span >Coded by Kennedy Musyimi</span>
        <Link to='https://www.linkedin.com/in/kennedy-musyimi-9721aa349/' target='_blank'>LinkedIn</Link>
        <div className="separator"></div>
        <Link to="https://github.com/KMusyimi" target='_blank'>Github</Link>
      </div>
    </footer>)
}

export default memo(Footer); 