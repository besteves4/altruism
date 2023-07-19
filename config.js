/* eslint import/extensions: 0 */
import packageJson from "./package.json";

export default function getConfig() {
  return {
    defaultIdP: "https://solidweb.me/",
    libraryRepoUrl: packageJson.repository.url,
    demoRepoUrl: packageJson.repository.url,
    copyright: "Copyright 2021 Inrupt, Inc.",
    demoTitle: "SOPE",
    demoDescription: "A Solid ODRL access control Policies Editor",
  };
}
