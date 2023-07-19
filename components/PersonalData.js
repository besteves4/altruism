import { useState } from "react";
import * as React from 'react';
import { useSession } from "@inrupt/solid-ui-react";

import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import {
  getPodUrlAll,
  getSolidDataset,
  getContainedResourceUrlAll,
  getThing,
  getUrl
} from "@inrupt/solid-client";
import { ODRL } from "@inrupt/vocab-common-rdf";
import { fetch } from "@inrupt/solid-client-authn-browser";

async function getPolicies(policiesContainer) {
  const myDataset = await getSolidDataset(policiesContainer.href, {
    fetch: fetch,
  });

  let datasets = [];
  const policyList = getContainedResourceUrlAll(myDataset);
  for (var p = 0; p < policyList.length; p++) {
    const policy = await getSolidDataset(policyList[p], {
      fetch: fetch,
    });

    const permission = getThing(policy, `${policyList[p]}#permission1`);
    const dataType = getUrl(permission, "https://w3id.org/dpv#hasPersonalData");

    const purposeConstraint = getThing(policy, `${policyList[p]}#purposeConstraint`);
    const purpose = getUrl(purposeConstraint, ODRL.rightOperand);

    datasets[p] = [dataType.split("#")[1], purpose.split("#")[1]];
    //console.log(dict);
  }
  return datasets;
}

const datasetCard = ({data, purpose}) => {
  return (
    <Card sx={{ maxWidth: 400 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Purpose for access: {data}
                  </Typography>
                  <Typography variant="h5" component="div">
                    Type of data: {purpose}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Ask access to the dataset</Button>
                </CardActions>
              </Card>
  )
}

const CardList = ({cards}) => {
  const cardsArray = cards.map(resourceCard => (
    <div style={{minWidth:"200px"}}>
    <datasetCard
      data={resourceCard[0]}
      purpose={resourceCard[1]}
    />
    </div>
  ));

  return (
    <div style={{display:'flex',flexGrow:'1',flexShrink:"1",flexBasis:"100%" ,justifyContent:"space-around", flexWrap:"wrap", flexDirection:"row", flexGrow: "1", alignContent:"stretch"}}>
      {cardsArray}
    </div>
  );
}

export function PersonalData() {
  const { session, sessionRequestInProgress } = useSession();

  const [display, setDisplay] = useState(false);
  const [displayDataset, setDisplayDataset] = useState();
  const [displayCardData, setDisplayCardData] = useState("");
  const [displayCardPurpose, setDisplayCardPurpose] = useState("");

  //let displayDataset = []
  const getDatasets = () => {

    getPodUrlAll(session.info.webId).then((response) => {

      const podRoot = response[0];
      const policiesContainer = "altruism/";
      const podPoliciesContainer = new URL(policiesContainer, podRoot);

      getPolicies(podPoliciesContainer).then((datasets) => {

        /*         for (var i = 0; i < datasets.length; i++) {
          console.log(datasets[i]);
          setDisplayCardData(datasets[i][0]);
          setDisplayCardPurpose(datasets[i][1]);
          setDisplay(true);
        } */
        setDisplay(true);
        //displayDataset = datasets
        setDisplayDataset(datasets);
        console.log(displayDataset)
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
            <CardList cards={displayDataset}></CardList>
/*             <Card sx={{ maxWidth: 400 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Purpose for access: {displayCardPurpose}
                </Typography>
                <Typography variant="h5" component="div">
                  Type of data: {displayCardData}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Ask access to the dataset</Button>
              </CardActions>
            </Card> */
          )}
        </div>
      </div>
    </div>
  );
}
