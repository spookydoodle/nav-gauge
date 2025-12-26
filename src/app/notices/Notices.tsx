import { CSSProperties, FC, useEffect } from "react";
import { useStateWarden, useSubjectState } from "@apparatus";
import * as styles from './notices.module.css';

export const Notices: FC = () => {
    const { signaliumBureau } = useStateWarden();
    const [notices] = useSubjectState(signaliumBureau.notices$);

    return notices
        .toReversed()
        .map((notice, i) => (
            <dialog open key={notice.id} className={styles['notice']} style={{ '--index': i } as CSSProperties}>
                <p>{notice.id} {notice.text}</p>
                <form method="dialog">
                    <button onClick={() => signaliumBureau.removeNotice(notice.id)}>Close</button>
                </form>
            </dialog>
        ));
};
