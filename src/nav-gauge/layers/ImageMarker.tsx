import { FC } from "react";
import ReactDOM from 'react-dom';
import * as styles from './route-layer.module.css';

interface Props {
    element: HTMLDivElement;
    id: number;
    data: string;
}

export const ImageMarker: FC<Props> = ({ element, data, id }) => {
    console.log({id, data, element})
    return ReactDOM.createPortal(
        <img src={data} alt={`image ${id}`} width={30} height={30} className={styles['image-marker']} />,
        element
    );
};