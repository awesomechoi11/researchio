import { Link, NavLink } from "react-router-dom";

export default function DashboardSidebarButton({
    Iconsvg,
    label,
    to,
    ...props
}) {
    return (
        <NavLink
            to={`/dashboard/${to}`}
            className="sidebar-button fs-big"
            title={label}
            {...props}
        >
            <div className="icon-wrapper">
                <Iconsvg />
            </div>
            {label}
        </NavLink>
    );
}
