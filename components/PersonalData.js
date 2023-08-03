import { useState } from "react";
import * as React from 'react';
import { useSession } from "@inrupt/solid-ui-react";

import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import {
  getPodUrlAll,
  getSolidDataset,
  getContainedResourceUrlAll,
  getThing,
  getThingAll,
  getUrl
} from "@inrupt/solid-client";
import { ODRL } from "@inrupt/vocab-common-rdf";
import { fetch } from "@inrupt/solid-client-authn-browser";

async function getPolicies(catalogURL) {
  const myDataset = await getSolidDataset(catalogURL, {
    fetch: fetch,
  });

  let datasets = [];
  const datasetList = getThingAll(myDataset);
  for(var d = 0; d < datasetList.length; d++){
    console.log(datasetList[d])
    const dataType = getUrl(datasetList[d], "https://w3id.org/dpv#hasPersonalData");
    const purpose = getUrl(datasetList[d], "https://w3id.org/dpv#hasPurpose");
    datasets[d] = [dataType.split("#")[1], purpose.split("#")[1]];
  }

  /* const policyList = getContainedResourceUrlAll(myDataset); 
  for (var p = 0; p < policyList.length; p++) {
    const policy = await getSolidDataset(policyList[p], {
      fetch: fetch,
    });

    const permission = getThing(policy, `${policyList[p]}#permission1`);
    const dataType = getUrl(permission, "https://w3id.org/dpv#hasPersonalData");

    const purposeConstraint = getThing(policy, `${policyList[p]}#purposeConstraint`);
    const purpose = getUrl(purposeConstraint, ODRL.rightOperand);

    datasets[p] = [dataType.split("#")[1], purpose.split("#")[1]];
  } */
  console.log(datasets)
  return datasets;
}

export function PersonalData() {
  const { session, sessionRequestInProgress } = useSession();

  const [display, setDisplay] = useState(false);
  let [thisState, setThisState] = useState([]);

  const getDatasets = () => {

    getPodUrlAll(session.info.webId).then((response) => {

      const podRoot = response[0];
      const policiesContainer = "altruism/";
      const podPoliciesContainer = new URL(policiesContainer, podRoot);
      const catalogURL = "https://solidweb.me/soda/catalogs/catalog1";

      getPolicies(catalogURL).then((datasets) => {

        setThisState(datasets)
        setDisplay(true);
        
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
            Search Available Datasets
          </Button>
          {display && (
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {thisState.map((value) => (
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                          Purpose for access: {value[1]}
                        </Typography>
                        <Typography variant="h5" component="div">
                          Type of data: {value[0]}
                        </Typography> 
                      </CardContent>
                      <CardActions>
                        <Button size="small">Ask access to the dataset</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}
