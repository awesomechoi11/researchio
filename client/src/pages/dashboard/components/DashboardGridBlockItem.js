import clsx from "clsx";
import { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import { ReactComponent as OptionsSvg } from "../../../assets/profile/options.svg";
import { ReactComponent as PencilSvg } from "../../../assets/profile/pencil.svg";
import { ReactComponent as CopySvg } from "../../../assets/profile/copy.svg";
import { ReactComponent as ViewSvg } from "../../../assets/profile/view.svg";
import { ReactComponent as TrashSvg } from "../../../assets/profile/trash.svg";

export default function DashboardGridBlockItem({
    children,
    handleOptions,
    className,
    contentProps,
    ...props
}) {
    return (
        <div {...props} className={clsx("item", className)}>
            <div className="content" {...contentProps}>
                {children}
            </div>
            <div className="controls">
                {handleOptions && !!Object.keys(handleOptions).length && (
                    <ItemOptions {...handleOptions} />
                )}
            </div>
        </div>
    );
}

function ItemOptions({ onEdit, onDelete, onDuplicate, onView }) {
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: "bottom-end",
    });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (
                !referenceElement ||
                !popperElement ||
                referenceElement.contains(event.target) ||
                popperElement.contains(event.target)
            ) {
                return;
            }
            setOpen(false);
        };

        // listen for clicks and close dropdown on body
        document.addEventListener("mousedown", handleDocumentClick);
        return () => {
            document.removeEventListener("mousedown", handleDocumentClick);
        };
    }, [referenceElement, popperElement]);

    // console.log(RealmApp);
    return (
        <div className={clsx("item-popup", open && "open")}>
            <button
                type="button"
                ref={setReferenceElement}
                onClick={() => {
                    setOpen(!open);
                }}
            >
                <OptionsSvg />
            </button>
            <div
                ref={setPopperElement}
                style={{
                    ...styles.popper,
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "all" : "none",
                }}
                {...attributes.popper}
                className="popup"
            >
                {onEdit && (
                    <div
                        className="item"
                        onClick={() => {
                            onEdit();
                            setOpen(false);
                        }}
                    >
                        <PencilSvg /> edit
                    </div>
                )}
                {onDuplicate && (
                    <div
                        className="item"
                        onClick={() => {
                            onDuplicate();
                            setOpen(false);
                        }}
                    >
                        <CopySvg /> duplicate
                    </div>
                )}
                {onDelete && (
                    <div
                        className="item"
                        onClick={() => {
                            onDelete();
                            setOpen(false);
                        }}
                    >
                        <TrashSvg /> delete
                    </div>
                )}

                {onView && (
                    <div
                        className="item"
                        onClick={() => {
                            onView();
                            setOpen(false);
                        }}
                    >
                        <ViewSvg /> view
                    </div>
                )}
            </div>
        </div>
    );
}
