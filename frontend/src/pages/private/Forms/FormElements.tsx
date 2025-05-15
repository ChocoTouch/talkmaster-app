import PageBreadcrumb from "../../../../src/components/common/PageBreadCrumb";
import AddTalk from "../../../../src/components/form/form-elements/AddTalk";
import AddRoom from "../../../../src/components/form/form-elements/AddRoom";
import AddRole from "../../../../src/components/form/form-elements/AddRole";
import PageMeta from "../../../../src/components/common/PageMeta";

export default function FormElements() {
  const talkId = "123";
  return (
    <div>
      <PageMeta
        title="TalkMaster Formulaires Talk | Tableau de bord"
        description="Ceci est la page des formulaires des talks"
      />
      <PageBreadcrumb pageTitle="Formulaires Talk" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <AddTalk />
          <AddRoom />
          <AddRole />
        </div>
      </div>
    </div>
  );
}
