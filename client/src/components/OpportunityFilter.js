import { motion } from "framer-motion";
import Dropdown from "./Dropdown";
import useQueryParam from "./useQueryParam";
import * as JSURL from "jsurl";
import { FormikDropdown } from "./formikhelpers";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";

const FilterTypes = {
    dropdown: Dropdown,
};

export default function OpportunityFilter({ filterData }) {
    let [filter, setFilter] = useQueryParam("opportunitesFilter");
    const onSelect = (selectUpdate) => {
        //
        // console.log(selectUpdate);
        // const selectData = JSURL.parse(selectUpdate.value);
        // setFilter({
        //     ...filter,
        //     [selectData.filterKey]: selectData,
        // });
    };

    const onSubmit = async (values) => {
        // console.log(values);
        // setFilter({
        //     ...filter,
        //     [selectData.filterKey]: selectData,
        // });
        // console.log(JSURL);
        // const safeValues = JSURL.stringify(values);
        setFilter(values);
    };

    const validationSchema = useMemo(
        () =>
            Yup.object({
                "opportunities-departments": Yup.object({
                    value: Yup.string().required(),
                    label: Yup.string().required(),
                })
                    .nullable()
                    .required("required"),
                "opportunities-locations": Yup.object({
                    value: Yup.string().required(),
                    label: Yup.string().required(),
                })
                    .nullable()
                    .required("required"),
                "opportunities-majorsConsidered": Yup.object({
                    value: Yup.string().required(),
                    label: Yup.string().required(),
                })
                    .nullable()
                    .required("required"),
                "opportunities-opportunityTypes": Yup.object({
                    value: Yup.string().required(),
                    label: Yup.string().required(),
                })
                    .nullable()
                    .required("required"),
            }),
        []
    );

    const formik = useFormik({
        initialValues: filter || {
            "opportunities-departments": null,
            "opportunities-locations": null,
            "opportunities-majorsConsidered": null,
            "opportunities-opportunityTypes": null,
        },
        validationSchema,
        onSubmit,
    });
    // console.log(filterData);
    return (
        <div className="filters">
            <form onSubmit={formik.handleSubmit}>
                {Object.entries(filterData).map(([filterKey, filterValue]) => {
                    const { value, type, label, field } = filterValue;

                    // must be valid filter type
                    const Comp = FilterTypes[type];
                    if (!Comp) return undefined;

                    if (type === "dropdown") {
                        return (
                            <FormikDropdown
                                key={filterKey}
                                id={`opportunities-${filterKey}`}
                                label={label}
                                options={value.map((itemValue) => {
                                    let returnVal = {};
                                    if (itemValue.value) {
                                        returnVal = itemValue;
                                        // returnVal.value = {
                                        //     field,
                                        //     value: itemValue.value,
                                        // };
                                    } else {
                                        returnVal = {
                                            label: itemValue,
                                            value: itemValue,
                                        };
                                        // returnVal = {
                                        //     value: { field, value: itemValue },
                                        //     label: itemValue,
                                        // };
                                    }
                                    // console.log(returnVal);
                                    return returnVal;
                                })}
                                formik={formik}
                                selectProps={{
                                    onChange: (opt, e) => {
                                        onSelect(opt);
                                        formik.setFieldValue(
                                            `opportunities-${filterKey}`,
                                            opt
                                        );
                                    },
                                }}
                            />
                        );
                    }
                    return undefined;
                })}
                <div className="submit-wrapper">
                    <button type="submit">GO</button>
                </div>{" "}
            </form>
        </div>
    );
}
