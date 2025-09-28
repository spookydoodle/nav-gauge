declare module '*.json' {
    const content: string;
    export default content;
}
declare module "*.svg?react" {
  import { FunctionComponent, SVGAttributes } from "react";
  const content: FunctionComponent<SVGAttributes<SVGElement>>;
  export default content;
}
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.module.css' {
  const content: { [key: string]: string };
  export = content;
}
declare module '*.png' {
    const content: string;
    export default content;
}
declare module '*.jpg' {
    const content: string;
    export default content;
}
declare module '*.jpeg' {
    const content: string;
    export default content;
}