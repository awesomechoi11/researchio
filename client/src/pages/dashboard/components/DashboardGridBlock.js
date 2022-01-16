import clsx from "clsx";
import { motion } from "framer-motion";

export default function DashboardGridBlock({
    width = -1,
    height = -1,
    gap = 24,
    padding = 16,
    unitWidth = 180,
    unitHeight = 160,
    className,
    children,
    title,
    ...props
}) {
    const blockWidth =
        width === -1 ? undefined : width * unitWidth + (width - 1) * gap;
    const blockHeight =
        height === -1 ? undefined : height * unitHeight + (height - 1) * gap;

    return (
        <motion.div
            {...props}
            className={clsx("dashboard-grid-block", className)}
            style={{ width: blockWidth, minHeight: blockHeight, padding }}
        >
            <div className="title fs-bigger fw-bold">{title}</div>
            <div className="content-wrapper">{children}</div>
        </motion.div>
    );
}
