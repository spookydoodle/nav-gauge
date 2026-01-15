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
  const classes: { [key: string]: string };
  export = classes;
}
