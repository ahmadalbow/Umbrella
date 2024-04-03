import { Link, useLocation } from "react-router-dom";

interface Props {
  name: string;
  linkTo: string;
}

function NavLink({ name, linkTo }: Props) {
  const location = useLocation();
  const path = location.pathname;
  // Find the index of the first occurrence of "/"
  const firstSlashIndex = path.indexOf("/");
  // Find the index of the second occurrence of "/" by searching for "/" after the first occurrence
  const secondSlashIndex = path.indexOf("/", firstSlashIndex + 1);
  // Extract the string between the first and second occurrence of "/"
  const pageName =
    secondSlashIndex !== -1
      ? path.substring(firstSlashIndex + 1, secondSlashIndex)
      : path.substring(firstSlashIndex + 1);

  if (linkTo == pageName) {
    return (
      <Link className="nav-link active text-center " to={"/" + linkTo}>
        {name}
      </Link>
    );
  } else {
    return (
      <Link className="nav-link text-center " to={"/" + linkTo}>
        {name}
      </Link>
    );
  }
}

export default NavLink;
