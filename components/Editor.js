import { useState } from "react";
import { useSession } from "@inrupt/solid-ui-react";
import DropdownTreeSelect from "react-dropdown-tree-select";

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

/* import personalData from "../data/personaldata.json";
import purpose from "../data/purposes.json"; */
import getPaths from "../src/utils";

const [personalData, purpose] = getPaths();

async function getPolicyFilenames(policiesContainer) {
  console.log(policiesContainer);
  const myDataset = await getSolidDataset(policiesContainer.href, {
    fetch: fetch,
  });

  const policyList = getContainedResourceUrlAll(myDataset);
  return policyList;
}

const policyTypes = [
  { value: "permission", label: "Permission" },
  { value: "prohibition", label: "Prohibition" },
];

export function Editor() {
  const { session, sessionRequestInProgress } = useSession();

  const [chosenPolicy, setChosenPolicy] = useState(policyTypes[0].value);
  const [policyFilename, setPolicyFilename] = useState("example-policy.ttl");

  // TODO: Move to src/utils.js or something:
  /*   const assignObjectPaths = (obj, stack) => {
    Object.keys(obj).forEach((k) => {
      const node = obj[k];
      if (typeof node === "object") {
        node.path = stack ? `${stack}.${k}` : k;
        assignObjectPaths(node, node.path);
      }
    });
  }; */

  // TODO: Only run this once, these don't need to be part of the render loop and will slow your application:
  /*   assignObjectPaths(personalData);
  assignObjectPaths(purpose); */

  let selectedPD = [];
  const handlePersonalData = (currentNode, selectedNodes) => {
    for (var i = 0; i < selectedNodes.length; i++) {
      //var value = selectedNodes[i].value;
      var label = selectedNodes[i].label;
      if (!selectedPD.includes(label)) {
        selectedPD.push(label);
      }
    }
    console.log(selectedPD);
  };

  let selectedPurpose = [];
  const handlePurpose = (currentNode, selectedNodes) => {
    for (var i = 0; i < selectedNodes.length; i++) {
      //var value = selectedNodes[i].value;
      var label = selectedNodes[i].label;
      if (!selectedPurpose.includes(label)) {
        selectedPurpose.push(label);
      }
    }
    console.log(selectedPurpose);
  };

  // TODO: lift up, see what I did with policyTypes
  const access = [{ label: "Read" }, { label: "Write" }, { label: "Append" }];

  // You may wish to use a useState or useReducer for this:
  // https://dev.to/colocodes/2-use-cases-of-the-usereducer-reactjs-hook-ine
  let selectedAccess = [];
  const handleAccess = (currentNode, selectedNodes) => {
    for (var i = 0; i < selectedNodes.length; i++) {
      //var value = selectedNodes[i].value;
      var label = selectedNodes[i].label;
      if (!selectedAccess.includes(label)) {
        selectedAccess.push(label);
      }
    }
    console.log(selectedAccess);
  };

  const [display, setDisplay] = useState(false);
  const [displayResource, setDisplayResource] = useState("");
  const [displayPolicyType, setDisplayPolicyType] = useState("");
  const [displayAccess, setDisplayAccess] = useState([]);
  const [displayPD, setDisplayPD] = useState([]);
  const [displayPurposeOperator, setDisplayPurposeOperator] = useState();
  const [displayPurpose, setDisplayPurpose] = useState([]);

  const generatePolicy = () => {
    // TODO: chosenPolicy/selectedPD/selectedPurpose have to be gathered only when generatePolicy is activated
    let newPolicy = createSolidDataset();

    const dpv = "http://www.w3.org/ns/dpv#";
    const odrl = "http://www.w3.org/ns/odrl/2/";
    const oac = "https://w3id.org/oac/";

    const oacPurpose = `${oac}Purpose`;
    const odrlPolicyType = `${odrl}${chosenPolicy}`;

    let policy = createThing({ name: "policy1" });
    let policyType = createThing({ name: chosenPolicy + "1" });
    policy = addUrl(policy, RDF.type, ODRL.Policy);
    policy = addUrl(policy, odrlPolicyType, policyType);
    newPolicy = setThing(newPolicy, policy);

    let purposeConstraint = createThing({ name: "purposeConstraint" });

    for (let i = 0; i < selectedPD.length; i++) {
      var pd = selectedPD[i];
      policyType = addUrl(policyType, ODRL.target, `${oac}${pd}`);
    }

    for (let i = 0; i < selectedAccess.length; i++) {
      var acc = selectedAccess[i];
      policyType = addUrl(policyType, ODRL.action, `${oac}${acc}`);
    }

    policyType = addUrl(policyType, ODRL.assigner, session.info.webId);
    policyType = addUrl(policyType, ODRL.constraint, purposeConstraint);
    newPolicy = setThing(newPolicy, policyType);

    purposeConstraint = addUrl(purposeConstraint, ODRL.leftOperand, oacPurpose);

    let purposeOperator = "";
    if (selectedPurpose.length > 1) {
      purposeOperator = ODRL.isAnyOf;
    } else {
      purposeOperator = ODRL.isA;
    }
    purposeConstraint = addUrl(
      purposeConstraint,
      ODRL.operator,
      purposeOperator
    );

    for (var p = 0; p < selectedPurpose.length; p++) {
      var purp = selectedPurpose[p].replaceAll(" ", "");
      purposeConstraint = addUrl(
        purposeConstraint,
        ODRL.rightOperand,
        `${dpv}${purp}`
      );
    }

    newPolicy = setThing(newPolicy, purposeConstraint);

    getPodUrlAll(session.info.webId).then((response) => {
      if (chosenPolicy === "") {
        alert("Choose a type of policy");
      } else if (selectedPD.length < 1) {
        alert("Choose the categories of personal data of the policy");
      } else if (selectedPurpose.length < 1) {
        alert("Choose the purpose of the policy");
      } else if (selectedAccess.length < 1) {
        alert("Choose the access modes applicable to the policy");
      } else {
        const podRoot = response[0];
        const policiesContainer = "private/odrl_policies/";
        const podPoliciesContainer = new URL(policiesContainer, podRoot);
        const filename = policyFilename;

        const filenameContainer = `${policiesContainer}${filename}`;
        const filenameSave = new URL(filenameContainer, podRoot);

        getPolicyFilenames(podPoliciesContainer).then((policyList) => {
          if (policyList.includes(filenameSave)) {
            alert("There is already a policy with that name, choose another");
          } else {
            try {
              saveSolidDatasetAt(filenameSave.href, newPolicy, {
                fetch: fetch,
              });
              setDisplayPolicyType(chosenPolicy);
              setDisplayResource(filenameSave.href);
              setDisplayAccess(selectedAccess.map((a) => `oac:${a}`));
              setDisplayPD(selectedPD.map((pd) => `oac:${pd}`));
              setDisplayPurposeOperator(purposeOperator.split("/").pop());
              setDisplayPurpose(
                selectedPurpose.map((p) => `dpv:${p.replaceAll(" ", "")}`)
              );
              setDisplay(true);
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
    });
  };

  if (sessionRequestInProgress) {
    return null;
  }

  return (
    <div className="row">
      <div className="left-col">
        <div className="container">
          <div className="">
            <p>
              <b>Choose type of policy:</b>
            </p>
            <FormControl fullWidth>
              <InputLabel id="policy-type-label" htmlFor="policy-type-select">
                Policy Type
              </InputLabel>
              <Select
                size="small"
                labelId="policy-type-label"
                id="policy-type-select"
                label="Policy Type"
                onChange={(ev) => setChosenPolicy(ev.target.value)}
                value={chosenPolicy}
              >
                {policyTypes.map((policy) => (
                  <MenuItem key={policy.value} value={policy.value}>
                    {policy.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="container">
          <div className="">
            <p>
              <b>Choose type of personal data:</b>
            </p>
            <DropdownTreeSelect
              data={personalData}
              onChange={handlePersonalData}
              className="tree-select"
            />
          </div>
        </div>
        <div className="container">
          <div className="">
            <p>
              <b>Choose purpose:</b>
            </p>
            <DropdownTreeSelect
              data={purpose}
              onChange={handlePurpose}
              className="tree-select"
            />
          </div>
        </div>
        <div className="container">
          <div className="">
            <p>
              <b>Choose applicable access modes:</b>
            </p>
            <DropdownTreeSelect
              data={access}
              onChange={handleAccess}
              className="tree-select"
            />
          </div>
        </div>
        <div className="container">
          <div className="bottom-input">
            <p>
              <b>Policy name:</b>
            </p>
            <TextField
              size="small"
              onChange={(ev) => setPolicyFilename(ev.target.value)}
              value={policyFilename}
            />
          </div>
          <div className="bottom-container">
            <Button variant="small" value="permission" onClick={generatePolicy}>
              Generate
            </Button>
          </div>
        </div>
      </div>
      <div className="right-col">
        {display && (
          <pre>{`
            PREFIX odrl: <http://www.w3.org/ns/odrl/2/>
            PREFIX oac: <https://w3id.org/oac/>
            PREFIX dpv: <http://www.w3.org/ns/dpv#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

            <${displayResource}>
                rdf:type odrl:Policy ;
                odrl:profile oac: ;
                odrl:${displayPolicyType} [
                    odrl:assigner <${session.info.webId}> ;
                    odrl:action ${displayAccess} ;
                    odrl:target ${displayPD} ;
                    odrl:constraint [
                        odrl:leftOperand oac:Purpose ;
                        odrl:operator odrl:${displayPurposeOperator} ;
                        odrl:rightOperand ${displayPurpose}
                    ]
                ] .
          `}</pre>
        )}
      </div>
    </div>
  );
}
