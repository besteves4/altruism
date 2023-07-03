import personalData from "../data/personaldata.json";
import purpose from "../data/purposes.json";

export default function getPaths() {
    const assignObjectPaths = (obj, stack) => {
        Object.keys(obj).forEach((k) => {
          const node = obj[k];
          if (typeof node === "object") {
            node.path = stack ? `${stack}.${k}` : k;
            assignObjectPaths(node, node.path);
          }
        });
    };

    assignObjectPaths(personalData);
    assignObjectPaths(purpose);
    return [personalData, purpose];
}