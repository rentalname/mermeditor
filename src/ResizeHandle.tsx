import { PanelResizeHandle } from "react-resizable-panels";
import DragHandleIcon from '@mui/icons-material/DragHandle';
import styles from "./ResizeHandle.module.css";

export default function ResizeHandle({
  className = "",
  id
}: {
  className?: string;
  id?: string;
}) {
  return (
    <PanelResizeHandle
      className={[styles.resizeHandleOuter, className].join(" ")}
      id={id}
    >
      <div className={styles.resizeHandleInner}>
        <DragHandleIcon />
      </div>
    </PanelResizeHandle>
  );
}
