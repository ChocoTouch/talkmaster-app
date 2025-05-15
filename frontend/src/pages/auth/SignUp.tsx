import PageMeta from "../../../src/components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../../src/components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Inscription | TalkMaster"
        description="Créez votre compte sur TalkMaster pour soumettre, gérer et planifier vos conférences."
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
