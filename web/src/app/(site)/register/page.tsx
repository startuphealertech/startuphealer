import { pageMetadata } from "@/lib/seo";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = pageMetadata({
  title: "Create an account",
  description: "Create your free StartupHealer account and get expert help for registrations, compliance and funding.",
  path: "/register",
  noindex: true,
});

export default function RegisterPage() {
  return (
    <AuthShell title="StartupHealer Welcomes You!" subtitle="create new account">
      <RegisterForm />
    </AuthShell>
  );
}
