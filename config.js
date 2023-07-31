/* eslint import/extensions: 0 */
import packageJson from "./package.json";

export default function getConfig() {
  return {
    defaultIdP: "https://solidweb.me/",
    libraryRepoUrl: packageJson.repository.url,
    demoRepoUrl: packageJson.repository.url,
    copyright: "Copyright 2021 Inrupt, Inc.",
    demoTitle: "SoDA",
    demoDescription: "A Solid Data Atruism app",
  };
}
