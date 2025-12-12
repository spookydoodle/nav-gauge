import { createRoot } from 'react-dom/client';
import { Hub } from "./Hub";
import "./index.css";

const container = document.getElementById('hub');
const root = createRoot(container!);

root.render(<Hub />);
