import { useAuth } from "../context/useAuth";

function Settings() {
  const auth = useAuth();

  if (!auth || !auth.user) return <div>Loading...</div>;

  const { user, logout } = auth;

  return (
    <div>
      <h1>Settings</h1>

      {/* Section 1 - Github Actions */}
      <section>
        <h2>Github Connection</h2>
        <img src={user.avatar_url ?? ""} alt={user.username} width={60} />
        <p>{user.display_name}</p>
        <p>@{user.username}</p>
        <span>Connected</span>
        <button onClick={logout}>Disconnect Github</button>
      </section>

      {/* Section 2 - Public Profile */}
      <section>
        <h2>Public Profile</h2>

        <div>
          <label>Public Profile</label>
          <input
            type="checkbox"
            checked={user.is_profile_public}
            onChange={() => {}}
          />
        </div>

        <div>
          <label>Show Repositories</label>
          <input
            type="checkbox"
            checked={user.show_repositories}
            onChange={() => {}}
          />
        </div>
      </section>
    </div>
  );
}

export default Settings;
