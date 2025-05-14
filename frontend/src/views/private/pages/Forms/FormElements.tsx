import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import AddTalk from "../../../../components/form/form-elements/AddTalk";
import PageMeta from "../../../../components/common/PageMeta";
import EditTalk from "../../../../components/form/form-elements/EditTalk";

export default function FormElements() {
  const talkId = "123";
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Form Elements" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <AddTalk />
          <EditTalk talkId={talkId} />
        </div>
      </div>
    </div>
  );
}
