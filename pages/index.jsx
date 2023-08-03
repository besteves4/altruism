import { useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import { Editor } from "../components/Editor";
import { PersonalData } from "../components/PersonalData";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

export default function Home() {
  const { session, sessionRequestInProgress } = useSession();

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (sessionRequestInProgress) {
    return null;
  }

  return (
    <div>
      {!session.info.isLoggedIn && (
        <div className="logged-out">
          <p>
            SoDA is a proof-of-concept Solid Data Altruism app for data subjects and data users to share/access
            personal data according to the concept of "data altruism" envisioned by European Union's Data Governance Act (DGA).
          </p>
          <p>
            It allows people storing personal data in Solid Pods to generate policies to voluntarily share said data 
            for altruistic purposes, such as improving healthcare or combating climate change, based on 
            the purposes specified in the{" "}
            <a href="https://w3id.org/dgaterms">DGAterms vocabulary</a> and on the{" "}
            <a href="https://w3id.org/oac">ODRL profile for Access Control (OAC)</a>.
          </p>
          <p>
            To get started, log in to your Pod and select whether you want to generate policies to make data available
            for altruistic usage ("POLICY EDITOR" tab) or to search for available datasets to use ("DATASETS" tab).
          </p>
          <p>
            Feel free to contact me at <a href="mailto:beatriz.gesteves@upm.es">beatriz.gesteves AT upm.es</a> if you have any 
            questions or feedback about the app and its functionalities.
          </p>
        </div>
      )}
      {session.info.isLoggedIn && (
        <div>
          <div className="row">
            <div className="logged-in">
              SoDA's "POLICY EDITOR" tab allows data subjects to generate policies to share their personal data 
              for an altruistic purpose, such as improving healthcare, based on the
              Data Governance Act (DGA) altruistic purposes specified in the{" "}
              <a href="https://w3id.org/dgaterms">DGAterms vocabulary</a> and on the{" "}
              <a href="https://w3id.org/oac">ODRL profile for Access Control (OAC)</a>.
              In addition, data users can request access to datasets
              for altruistic purposes in the "DATASETS" tab.
            </div>
          </div>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  centered
                >
                  <Tab label="Policy Editor" value="1" />
                  <Tab label="Datasets" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Editor />
              </TabPanel>
              <TabPanel value="2">
                <PersonalData />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      )}
    </div>
  );
}
