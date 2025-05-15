import PageMeta from "../../../src/components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../../src/components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Connexion | TalkMaster"
        description="Page de connexion à la plateforme TalkMaster, dédiée à la gestion et à la planification des talks."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
