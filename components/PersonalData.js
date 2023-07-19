import { useSession } from "@inrupt/solid-ui-react";
// import ForceLayout from "./ForceLayout";
// import dynamic from "next/dynamic";

/* const ForceLayout = dynamic(() => import("../components/ForceLayout"), {
  ssr: false,
}); */

async function getPolicies(policiesContainer) {
  console.log(policiesContainer);
  const myDataset = await getSolidDataset(policiesContainer.href, {
    fetch: fetch,
  });

  const policyList = getContainedResourceUrlAll(myDataset);
  return policyList;
}

export function PersonalData() {
  const { session, sessionRequestInProgress } = useSession();

  if (sessionRequestInProgress) {
    return null;
  }

  return (
    <div className="row">
      <div className="App">
        {/* <ForceLayout /> */}
      </div>
    </div>
  );
}
