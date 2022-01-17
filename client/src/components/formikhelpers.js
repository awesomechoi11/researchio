import clsx from "clsx";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import DatePicker from "react-date-picker";
import { ReactComponent as CalendarSvg } from "../assets/dashboard/calendar.svg";
import { ReactComponent as Xicon } from "../assets/dashboard/xicon.svg";
import { useCallback, useMemo, useRef, useState } from "react";
import Select, { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import InputNumber from "rc-input-number";

function hasError(formik, elemId) {
    return formik.touched[elemId] && formik.errors[elemId];
}

export function FormikInput({ id, label, formik, className, ...props }) {
    return (
        <div className="input-wrapper" {...props}>
            <input
                id={id}
                name={id}
                type="text"
                {...formik.getFieldProps(id)}
                className={clsx(hasError(formik, id) && "has-error", className)}
                // defaultValue={formik.initialValues[id]}
            />
            <label htmlFor={id}>{label}</label>
            {hasError(formik, id) ? (
                <div className="error">{formik.errors[id]}</div>
            ) : null}
        </div>
    );
}

export function FormikDropdown({
    id,
    label,
    formik,
    className,
    options,
    ...props
}) {
    return (
        <div className="select-wrapper" {...props}>
            <Select
                options={options}
                id={id}
                className={clsx(
                    hasError(formik, id) && "has-error",
                    "react-select-container",
                    className
                )}
                classNamePrefix="react-select"
                placeholder={label}
                onBlur={() => formik.setFieldTouched(id, true)}
                onChange={(opt, e) => {
                    formik.setFieldValue(id, opt);
                }}
                error={formik.errors.state}
                touched={formik.touched.state}
                value={formik.values[id]}
            />
            <label htmlFor={id}>{label}</label>
            {hasError(formik, id) ? (
                <div className="error">{formik.errors[id]}</div>
            ) : null}
        </div>
    );
}

export function FormikTextarea({ id, label, formik, className, ...props }) {
    return (
        <div className="textarea-wrapper" {...props}>
            <textarea
                id={id}
                name={id}
                type="text"
                {...formik.getFieldProps(id)}
                className={clsx(hasError(formik, id) && "has-error", className)}
                // defaultValue={formik.initialValues[id]}
            />
            <label htmlFor={id}>{label}</label>
            {hasError(formik, id) ? (
                <div className="error">{formik.errors[id]}</div>
            ) : null}
        </div>
    );
}

export function FormikDateRangePicker({
    id,
    label,
    formik,
    className,
    ...props
}) {
    const formikVal = formik.values[id];
    const value = useMemo(() => formik.values[id], [formikVal]);
    const onChange = useCallback((date) => {
        formik.setFieldValue(id, date);
    }, []);
    const touched = formik.touched[id];
    const errors = formik.errors[id];
    const errd = useMemo(() => hasError(formik, id), [touched, errors]);

    const calSvg = useRef(<CalendarSvg />);
    const exitSvg = useRef(<Xicon />);
    return (
        <div className="date-picker-wrapper">
            <DateRangePicker
                calendarIcon={calSvg.current}
                clearIcon={exitSvg.current}
                id={id}
                className={clsx(errd && "has-error", className)}
                onChange={onChange}
                value={value}
                // placeholder={label}
                // error={formik.errors.state}
                // touched={formik.touched.state}
                // defaultValue={options.find(
                //     (opt) => opt.value === formik.initialValues[id]
                // )}
            />
            <label htmlFor={id}>{label}</label>
            {hasError(formik, id) ? (
                <div className="error">{formik.errors[id]}</div>
            ) : null}
        </div>
    );
}

export function FormikDatePicker({ id, label, formik, className, ...props }) {
    const formikVal = formik.values[id];
    const value = useMemo(() => formik.values[id], [formikVal]);
    const onChange = useCallback((date) => {
        formik.setFieldValue(id, date);
    }, []);
    const touched = formik.touched[id];
    const errors = formik.errors[id];
    const errd = useMemo(() => hasError(formik, id), [touched, errors]);

    const calSvg = useRef(<CalendarSvg />);
    const exitSvg = useRef(<Xicon />);

    return (
        <div className="date-picker-wrapper">
            <DatePicker
                calendarIcon={calSvg.current}
                clearIcon={exitSvg.current}
                id={id}
                className={clsx(errd && "has-error", className)}
                onChange={onChange}
                value={value}
                // placeholder={label}
                // error={formik.errors.state}
                // touched={formik.touched.state}
                // defaultValue={options.find(
                //     (opt) => opt.value === formik.initialValues[id]
                // )}
            />
            <label htmlFor={id}>{label}</label>
            {hasError(formik, id) ? (
                <div className="error">{formik.errors[id]}</div>
            ) : null}
        </div>
    );
}

export function FormikRadioGroup({
    id,
    label,
    formik,
    className,
    options = [],
    ...props
}) {
    function onValueChange(event) {
        formik.setFieldValue(id, event.target.value);
    }

    return (
        <div className="radio-group-wrapper">
            <div
                className={clsx(
                    "radio-group-inner",
                    hasError(formik, id) && "has-error",
                    className
                )}
            >
                {options.map(({ value, label }, index) => (
                    <div className="radio" key={index}>
                        <label>
                            <input
                                type="radio"
                                value={value}
                                checked={formik.values[id] === value}
                                onChange={onValueChange}
                            />
                            {label}
                        </label>
                    </div>
                ))}
            </div>

            <label htmlFor={id}>{label}</label>
            {hasError(formik, id) ? (
                <div className="error">{formik.errors[id]}</div>
            ) : null}
        </div>
    );
}

export function FormikCreatableDropdown({
    id,
    label,
    formik,
    className,
    options,
    dropdownProps,
    ...props
}) {
    console.log(formik);
    return (
        <div className="select-wrapper" {...props}>
            <CreatableSelect
                options={options}
                id={id}
                className={clsx(
                    hasError(formik, id) && "has-error",
                    "react-select-container",
                    className
                )}
                classNamePrefix="react-select"
                placeholder={label}
                onBlur={() => formik.setFieldTouched(id, true)}
                onChange={(opt, e) => {
                    formik.setFieldValue(id, opt);
                }}
                error={formik.errors.state}
                touched={formik.touched.state}
                defaultValue={options.find(
                    (opt) => opt.value === formik.initialValues[id]
                )}
                value={formik.values[id]}
                {...dropdownProps}
            />
            <label htmlFor={id}>{label}</label>
            {hasError(formik, id) ? (
                <div className="error">{formik.errors[id]}</div>
            ) : null}
        </div>
    );
}

export function FormikInputNumber({ id, label, formik, className, ...props }) {
    const formikVal = formik.values[id];
    const value = useMemo(() => formik.values[id], [formikVal]);
    const onChange = useCallback((date) => {
        formik.setFieldValue(id, date);
    }, []);
    const touched = formik.touched[id];
    const errors = formik.errors[id];
    const errd = useMemo(() => hasError(formik, id), [touched, errors]);

    return (
        <div className="input-number-wrapper" {...props}>
            <InputNumber
                id={id}
                className={clsx(errd && "has-error", className)}
                onChange={onChange}
                onBlur={() => formik.setFieldTouched(id, true)}
                value={value}
                // defaultValue={formik.initialValues[id]}
                //   style={{ width: 100 }}
                //   readOnly={this.state.readOnly}
                //   upHandler={upHandler}
                //   downHandler={downHandler}
            />
            <label htmlFor={id}>{label}</label>
            {hasError(formik, id) ? (
                <div className="error">{formik.errors[id]}</div>
            ) : null}
        </div>
    );
}
