import { pageMetadata } from "@/lib/seo";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = pageMetadata({
  title: "Log in",
  description: "Log in to your StartupHealer account to manage your startup profile and services.",
  path: "/login",
  noindex: true,
});

export default function LoginPage() {
  return (
    <AuthShell title="Hi, Welcome Back!" subtitle="Sign in to StartupHealer">
      <LoginForm />
    </AuthShell>
  );
}
