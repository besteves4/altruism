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
  createSolidDataset,
  getSolidDataset,
  saveSolidDatasetInContainer,
  buildThing,
  createThing,
  getThing,
  getThingAll,
  setThing,
  addStringNoLocale,
  getUrl
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";

import { DCTERMS } from "@inrupt/vocab-common-rdf";

async function getPolicies(catalogURL) {
  const myDataset = await getSolidDataset(catalogURL, {
    fetch: fetch,
  });

  let datasets = [];
  const datasetList = getThingAll(myDataset);
  for(var d = 0; d < datasetList.length; d++){
    if(datasetList[d].url.includes('#')){
      const dataType = getUrl(datasetList[d], "https://w3id.org/dpv#hasPersonalData");
      const purpose = getUrl(datasetList[d], "https://w3id.org/dpv#hasPurpose");
      datasets[d] = [dataType.split("#")[1], purpose.split("#")[1], datasetList[d].url.split("#")[1]];
    }
  }

  return datasets;
}

async function sendRequestToInbox(catalogURL, target) {
  const myDataset = await getSolidDataset(catalogURL, {
    fetch: fetch,
  });
  const dataset = getThing(myDataset, `${catalogURL}#${target}`);
  const publisherWebID = getUrl(dataset, DCTERMS.publisher);

  const publisherWebIDDataset = await getSolidDataset(publisherWebID, {
    fetch: fetch,
  });
  console.log(publisherWebID);
  const publisherDataset = getThing(publisherWebIDDataset, publisherWebID);
  const publisherInbox = getUrl(publisherDataset, "http://www.w3.org/ns/ldp#inbox");

  let inboxMessage = createSolidDataset();
  const inboxThing = buildThing(createThing({ name: target }))
    .addStringNoLocale(DCTERMS.description, "Your dataset is being requested by XX for the purpose of YY")
    .build();
  inboxMessage = setThing(inboxMessage, inboxThing);

  return publisherInbox, inboxMessage;
}

export function PersonalData() {
  const { session, sessionRequestInProgress } = useSession();

  const [display, setDisplay] = useState(false);
  let [thisState, setThisState] = useState([]);

  const getDatasets = () => {

    const catalogURL = "https://solidweb.me/soda/catalogs/catalog1";
    getPolicies(catalogURL).then((datasets) => {
      setThisState(datasets)
      setDisplay(true);      
    })

  };

  const requestAccess = (target) => {
    const catalogURL = "https://solidweb.me/soda/catalogs/catalog1";
    
    sendRequestToInbox(catalogURL, target).then((inbox, message) => {
      console.log(inbox);
      console.log(message);
      try {
        saveSolidDatasetInContainer(inbox, message, { 
          fetch: fetch 
        });
      } catch (error) {
        console.log(error);
      }
    })
  }

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
                        <Button size="small" value={value[2]} onClick={e => requestAccess(e.target.value)}>Request access</Button>
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
