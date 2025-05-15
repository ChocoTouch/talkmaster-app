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
        title="Formulaires Talk | TalkMaster"
        description="Modifiez ou ajoutez les détails d’un talk : sujet, durée, niveau et planification."
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
