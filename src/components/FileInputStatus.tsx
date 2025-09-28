import { FC } from "react";
import * as styles from './file-input-status.module.css';

const getCauseProp = (prop: string, error?: Error): string | undefined => {
    if (!error?.cause || typeof error.cause !== 'object' || !(prop in error.cause)) {
        return;
    }
    const cause = error.cause as { [key in string]: unknown };
    if (typeof cause[prop] === 'string') {
        return cause[prop];
    }
}

interface Props {
    error?: Error;
    ok: boolean;
    routeName?: string;
}

export const FileInputStatus: FC<Props> = ({
    error,
    ok,
    routeName,
}) => {
    const stack = getCauseProp('stack', error);
    const cause = getCauseProp('cause', error);

    return (
        <div className={styles["status-container"]}>
            {error ? (
                <div title={stack} className={styles["error"]}>
                    {cause ? <h6>{cause}</h6> : null}
                    <p>{error.message}</p>
                </div>
            ) : ok
                ? <p title={routeName || "Let's go!"} className={styles["success"]}>{routeName || "Let's go!"}</p>
                : <p>No file uploaded yet.</p>}
        </div>
    );
};
