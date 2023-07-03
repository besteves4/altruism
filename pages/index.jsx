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
            SOPE is a Solid ODRL access control Policies Editor for users of
            Solid apps.
          </p>
          <p>
            It allows you to define ODRL policies, based on the{" "}
            <a href="https://w3id.org/oac/">OAC specification</a>, to govern the
            access to Pod resources and to store them on your Pod.
          </p>
          <p>
            To get started, log in to your Pod and select the type of policy you
            want to model.
          </p>
          <p>
            Next, you can choose the types of personal data and purposes to
            which the policy applies.
          </p>
          <p>
            Finally, you can generate the ODRL policy&apos;s RDF by clicking the
            &quot;Generate&quot; button and save it in your Pod.
          </p>
          <p>
            <a href="mailto:beatriz.gesteves@upm.es">Contact Me</a>
          </p>
        </div>
      )}
      {session.info.isLoggedIn && (
        <div>
          <div className="row">
            <div className="logged-in">
              SOPE allows you to define ODRL policies, based on the{" "}
              <a href="https://w3id.org/oac/">OAC specification</a>, to govern
              the access to Pod resources and to store them on your Pod. Select
              the type of policy you want to model, choose the types of personal
              data and purposes to which the policy applies, generate the ODRL
              policy&apos;s RDF and save it in your Pod by clicking on the
              &quot;Generate&quot; button.
            </div>
          </div>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Editor" value="1" />
                  <Tab label="Personal Data" value="2" />
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
