import { CSSProperties, FC } from "react";
import classNames from 'classnames';
import { useStateWarden, useSubjectState } from "@apparatus";
import * as styles from './notices.module.css';

export const Notices: FC = () => {
    const { signaliumBureau } = useStateWarden();
    const [notices] = useSubjectState(signaliumBureau.notices$);

    return notices
        .toReversed()
        .map((notice, i) => (
            <dialog
                open
                key={notice.id}
                className={classNames(styles['notice'], styles[notice.type])}
                style={{ '--index': i } as CSSProperties}
            >
                <p>{notice.text} {notice.type === 'error' ? notice.error.message || '' : ''}</p>
                <form method="dialog" className={styles['footer']}>
                    <button onClick={() => signaliumBureau.removeNotice(notice.id)}>Close</button>
                </form>
            </dialog>
        ));
};
