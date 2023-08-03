# SoDA - a Solid Data Altruism application

This demo showcases an architecture to implement data altruism as a service using the Solid protocol and ODRL policies to grant access to personal data for altruistic purposes in a privacy-friendly manner.
Policies are represented using OAC, the ODRL profile for Access Control, and DGAterms, a vocabulary with terms modelled from the European Union's Data Governance Act (DGA), including data altruism concepts.

In addition, we present a Solid Data Altruism application, SoDA, where (a) a data subject can generate a policy to share their personal data for an altruistic purpose, (b) a data user can request to access a dataset from another user for an altruistic purpose and (c) data altruism organisations can use to maintain metadata regarding available datasets.

## Getting Started

First install, then run the app:

```bash
npm install
npm run dev
```

Open [http://localhost:4007](http://localhost:4007) with your browser to see the result.

To change the port from the default of 3000, use the `-p` option on the `dev` script in your `package.json`, for
example to change our app to use port 4007 instead:
```json
{
  "scripts": {
    "dev": "next dev -p 4007",
    ...
  },
  ...
}
```

## DEMO

For a demo on how to use the app's functionalities see [https://anonymous.4open.science/w/iswc23demo-AE74/](https://anonymous.4open.science/w/iswc23demo-AE74/)