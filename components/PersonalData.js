import { useSession } from "@inrupt/solid-ui-react";
// import ForceLayout from "./ForceLayout";
import dynamic from "next/dynamic";

const ForceLayout = dynamic(() => import("../components/ForceLayout"), {
  ssr: false,
});

export function PersonalData() {
  const { session, sessionRequestInProgress } = useSession();

  if (sessionRequestInProgress) {
    return null;
  }

  return (
    <div className="row">
      <div className="App">
        <ForceLayout />
      </div>
    </div>
  );
}
