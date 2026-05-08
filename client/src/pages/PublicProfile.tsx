import { useParams } from "react-router-dom";

function PublicProfile() {
  const { username } = useParams();

  console.log(username);
  
  return <div>PublicProfile</div>;
}

export default PublicProfile;