import { useState, useEffect } from "react";
import * as React from 'react';
import { useSession } from "@inrupt/solid-ui-react";

import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/material/CommentIcon';
import ListItemText from '@mui/material/ListItemText';

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

export function PersonalData() {
  const { session, sessionRequestInProgress } = useSession();

  const [display, setDisplay] = useState(false);
  let [thisState, setThisState] = useState([])
  //const [displayCardData, setDisplayCardData] = useState("");
  //const [displayCardPurpose, setDisplayCardPurpose] = useState("");

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
        setThisState([['a', 'b', 'c'],['d', 'e', 'f'],['g', 'h', 'i']])
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
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {[1, 2, 3].map((value) => (
                <ListItem
                  key={value}
                  disableGutters
                  secondaryAction={
                    <IconButton aria-label="comment">
                      <CommentIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={`Line item ${value}`} />
                </ListItem>
              ))}
            </List>
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
