import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Settings() {
  const navigate = useNavigate();

  const userName =
    localStorage.getItem("userName") || "Traveler";

  const userEmail =
    localStorage.getItem("userEmail") || "";

  const [notifications, setNotifications] =
    useState(
      localStorage.getItem(
        `voyagent_notifications_${userEmail}`
      ) !== "false"
    );

  const [autoSave, setAutoSave] =
    useState(
      localStorage.getItem(
        `voyagent_autosave_${userEmail}`
      ) === "true"
    );

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    localStorage.setItem(
      `voyagent_notifications_${userEmail}`,
      String(notifications)
    );

    localStorage.setItem(
      `voyagent_autosave_${userEmail}`,
      String(autoSave)
    );
  }, [notifications, autoSave, userEmail]);

  function handleSaveSettings() {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  function handleResetPreferences() {
    setNotifications(true);
    setAutoSave(false);

    if (userEmail) {
      localStorage.removeItem(
        `voyagent_notifications_${userEmail}`
      );

      localStorage.removeItem(
        `voyagent_autosave_${userEmail}`
      );
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    navigate("/", { replace: true });
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
              Preferences
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Settings
            </h1>

            <p className="mt-2 text-slate-500">
              Customize your Voyagent AI experience.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="
              inline-flex w-fit items-center justify-center
              rounded-xl
              border border-slate-200
              bg-white
              px-5 py-3
              text-sm font-semibold
              text-slate-700
              shadow-sm
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-slate-50
              hover:shadow-md
            "
          >
            ← Dashboard
          </Link>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
              ✓
            </div>

            <div>
              <p className="font-semibold text-emerald-800">
                Settings saved
              </p>

              <p className="text-sm text-emerald-700">
                Your preferences have been updated successfully.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">

          {/* Account */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Account
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Information associated with your Voyagent AI account.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-lg">
                    👤
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Name
                    </p>

                    <p className="mt-1 truncate font-semibold text-slate-800">
                      {userName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                    ✉️
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 truncate font-semibold text-slate-800">
                      {userEmail || "No email available"}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </section>

          {/* Travel Preferences */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Travel Preferences
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                These preferences help shape your Voyagent AI experience.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="text-2xl">🏖️</div>

                <h3 className="mt-3 font-bold text-slate-800">
                  Leisure
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Relaxed holidays and exploration.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="text-2xl">🏔️</div>

                <h3 className="mt-3 font-bold text-slate-800">
                  Adventure
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Outdoor activities and experiences.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="text-2xl">🏛️</div>

                <h3 className="mt-3 font-bold text-slate-800">
                  Culture
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  History, landmarks and local culture.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="text-2xl">🍽️</div>

                <h3 className="mt-3 font-bold text-slate-800">
                  Food
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Local cuisine and food experiences.
                </p>
              </div>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Detailed travel preferences can be selected directly while creating a trip.
            </p>

          </section>

          {/* Application Preferences */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Application Preferences
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Control how Voyagent AI behaves on your account.
              </p>
            </div>

            <div className="space-y-4">

              {/* Notifications */}
              <div className="flex items-center justify-between gap-5 rounded-2xl border border-slate-200 p-5">

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-lg">
                    🔔
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800">
                      Notifications
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Allow travel-related notifications and updates.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNotifications(
                      (previous) => !previous
                    )
                  }
                  aria-label="Toggle notifications"
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    notifications
                      ? "bg-cyan-500"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                      notifications
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>

              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between gap-5 rounded-2xl border border-slate-200 p-5">

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg">
                    💾
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800">
                      Auto Save
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Save generated travel plans automatically.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setAutoSave(
                      (previous) => !previous
                    )
                  }
                  aria-label="Toggle auto save"
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    autoSave
                      ? "bg-cyan-500"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                      autoSave
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>

              </div>

            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={handleSaveSettings}
                className="
                  rounded-xl
                  bg-cyan-500
                  px-6
                  py-3
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-cyan-400
                  hover:shadow-md
                "
              >
                Save Preferences
              </button>

              <button
                type="button"
                onClick={handleResetPreferences}
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-slate-600
                  transition
                  hover:bg-slate-50
                "
              >
                Reset Preferences
              </button>

            </div>

          </section>

          {/* Security */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Security & Session
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your current Voyagent AI session.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-lg">
                  🔐
                </div>

                <div>
                  <h3 className="font-bold text-amber-900">
                    Current Session
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-amber-800">
                    You are currently signed in as{" "}
                    <span className="font-semibold">
                      {userEmail || userName}
                    </span>
                    .
                  </p>
                </div>

              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="
                mt-5
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-6
                py-3
                text-sm
                font-bold
                text-red-600
                transition
                hover:bg-red-100
              "
            >
              🚪 Logout
            </button>

          </section>

        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Voyagent AI Settings
        </p>

      </div>
    </main>
  );
}

export default Settings;