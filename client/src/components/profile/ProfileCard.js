export default function ProfileCard({ title, children, ...props }) {
    return (
        <div className="card" {...props}>
            <div className="header fs-bigger fw-bold">{title}</div>
            <div className="content">{children}</div>
        </div>
    );
}
