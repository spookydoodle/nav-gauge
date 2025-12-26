import { FC } from "react";
import { useSubjectState } from "../machine/hooks";
import { useStateWarden } from "../apparatus";
import * as styles from './layout.module.css';

export const Footer: FC = () => {
    const stateWarden = useStateWarden();
    const [attrributions] = useSubjectState(stateWarden.attributionVault.attributions$);

    return (
        <footer className={styles["footer"]}>
            {[...attrributions.entries()].map(([id, { text, href }]) => (
                <a key={id} target="_blank" rel="noreferrer" href={href}>
                    © {text}
                </a>
            ))}
        </footer>
    );
}
