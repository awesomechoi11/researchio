import { motion } from "framer-motion";
import * as JSURL from "jsurl";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo } from "react";
import { FormikInput } from "../../../components/formikhelpers";
import useQueryParam from "../../../components/useQueryParam";

export default function SearchBar() {
    let [filter, setFilter] = useQueryParam("discoverysearch");

    const onSubmit = setFilter;

    const validationSchema = useMemo(
        () =>
            Yup.object({
                "discovery-text": Yup.string().required("required"),
            }),
        []
    );
    const formik = useFormik({
        initialValues: filter || {
            "discovery-text": "",
        },
        validationSchema,
        onSubmit,
    });
    // console.log(filterData);
    return (
        <div className="filters">
            <form onSubmit={formik.handleSubmit}>
                <FormikInput
                    id={`discovery-text`}
                    label={"Search for Names, Departments, and more"}
                    formik={formik}
                />
                <div className="submit-wrapper">
                    <button type="submit">GO</button>
                </div>{" "}
            </form>
        </div>
    );
}
