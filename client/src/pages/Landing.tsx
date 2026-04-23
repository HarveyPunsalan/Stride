export default function Landing() {
  const handleLogin = () => {
    // redirect to VITE_API_URL/auth/github
    window.location.href = import.meta.env.VITE_API_URL + "/auth/github";
    
  }
  return (
    <div>
      <h1>howcase your real GitHub activity not just your resume</h1>
      <button onClick={handleLogin}>Connect with GitHub</button>
    </div>

  );
}