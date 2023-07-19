import { useSession } from "@inrupt/solid-ui-react";
// import ForceLayout from "./ForceLayout";
// import dynamic from "next/dynamic";

/* const ForceLayout = dynamic(() => import("../components/ForceLayout"), {
  ssr: false,
}); */

async function getPolicies(policiesContainer) {
  const myDataset = await getSolidDataset(policiesContainer.href, {
    fetch: fetch,
  });

  const policyList = getContainedResourceUrlAll(myDataset);
  console.log(policyList);
  return policyList;
}

export function PersonalData() {
  const { session, sessionRequestInProgress } = useSession();

  const getDatasets = () => {

    getPodUrlAll(session.info.webId).then((response) => {
      const podRoot = response[0];
      const policiesContainer = "altruism/";
      const podPoliciesContainer = new URL(policiesContainer, podRoot);

      getPolicies(podPoliciesContainer).then((policyList) => {

      })
    })

  };

  if (sessionRequestInProgress) {
    return null;
  }

  return (
    <div className="row">
      <div className="App">
        <div className="bottom-container">
          <Button variant="small" value="permission" onClick={getDatasets}>
            Get Datasets
          </Button>
        </div>
      </div>
    </div>
  );
}
