import { useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import {
  createSolidDataset,
  createThing,
  setThing,
  addUrl,
  saveSolidDatasetAt,
  getPodUrlAll,
  getSolidDataset,
  getContainedResourceUrlAll,
} from "@inrupt/solid-client";
import { RDF, ODRL } from "@inrupt/vocab-common-rdf";
import { fetch } from "@inrupt/solid-client-authn-browser";

async function getPolicies(policiesContainer) {
  const myDataset = await getSolidDataset(policiesContainer.href, {
    fetch: fetch,
  });

  const policyList = getContainedResourceUrlAll(myDataset);
  for (var p = 0; p < policyList.length; p++) {
    const policy = await getSolidDataset(policyList[p], {
      fetch: fetch,
    })
    console.log(policy);
  }
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
