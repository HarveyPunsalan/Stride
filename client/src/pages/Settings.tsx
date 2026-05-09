import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { apiFetch } from "../lib/api";

function Settings() {
  const auth = useAuth();
  const [isPublic, setIsPublic] = useState(
    auth?.user?.is_profile_public ?? false,
  );
  const [showRepos, setShowRepos] = useState(
    auth?.user?.show_repositories ?? false,
  );

  if (!auth || !auth.user) return <div>Loading...</div>;

  const { user, logout } = auth;

  async function updateSettings(field: string, value: boolean) {
    await apiFetch("/auth/settings", {
      method: "PATCH",
      body: JSON.stringify({ [field]: value }),
    });
  }

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
            checked={isPublic}
            onChange={async () => {
              const newValue = !isPublic;
              setIsPublic(newValue);
              await updateSettings("is_profile_public", newValue);
            }}
          />
        </div>

        <div>
          <label>Show Repositories</label>
          <input
            type="checkbox"
            checked={showRepos}
            onChange={async () => {
              const newValue = !showRepos;
              setShowRepos(newValue);
              await updateSettings("show_repositories", newValue);
            }}
          />
        </div>
      </section>

      {/* Section 3 - Data & Privacy */}
      <section>
        <h2>Data & Privacy</h2>

        <button onClick={() => apiFetch("/sync", { method: "POST" })}>
          Re-sync now
        </button>

        <button
          onClick={() => {
            if (confirm("Are you sure? This will delete all your data.")) {
              apiFetch("/auth/delete", { method: "DELETE" });
            }
          }}
        >
          Delete all my data
        </button>
      </section>
    </div>
  );
}

export default Settings;
