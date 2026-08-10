// app/login/page.tsx
"use client";

import { Button, Input } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import AnimatedGradient from "@/components/animatedGradient";

/**
 * LoginFormContent contains the actual login form logic.
 *
 * It's extracted into a separate component so that `useSearchParams`
 * can be wrapped in <Suspense>, which is required by Next.js App Router.
 */
function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin/overview";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Bitte Benutzername und Passwort eingeben.");
      return;
    }

    // Store credentials in sessionStorage (same format as the existing login modal)
    const credentials = btoa(`${username}:${password}`);
    sessionStorage.setItem("credentials", credentials);

    // Navigate to the intended destination
    router.push(redirectTo);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Anmelden
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
            Bitte gib deine Zugangsdaten für die Verwaltung ein.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              isRequired
              label="Benutzername"
              placeholder="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              isRequired
              label="Passwort"
              placeholder="Passwort"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div
                className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200"
                role="alert"
              >
                {error}
              </div>
            )}

            <Button
              className="w-full"
              color="primary"
              size="lg"
              type="submit"
            >
              Anmelden
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

/**
 * LoginPage renders the administrative login page.
 *
 * Users are redirected here from admin pages when they are not
 * authenticated. After successful login the credentials are stored
 * in sessionStorage and the user is forwarded to the originally
 * requested page (or /admin/overview by default).
 */
export default function LoginPage() {
  return (
    <div>
      <AnimatedGradient />
      <Suspense>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
