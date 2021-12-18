import { motion } from "framer-motion";
import Dropdown from "./Dropdown";
import useQueryParam from "./useQueryParam";
import * as JSURL from "jsurl";

const FilterTypes = {
    dropdown: Dropdown,
};

export default function OpportunityFilter({ filterData }) {
    let [filter, setFilter] = useQueryParam("opportunitesFilter");
    const onSelect = (selectUpdate) => {
        //
        const selectData = JSURL.parse(selectUpdate.value);
        setFilter({
            ...filter,
            [selectData.filterKey]: selectData,
        });
    };

    return (
        <div className="filters">
            <motion.div className="dropdowns">
                {Object.entries(filterData).map(([filterKey, filterValue]) => {
                    const { value, type, label, field } = filterValue;

                    // must be valid filter type
                    const Comp = FilterTypes[type];
                    if (!Comp) return;

                    if (type === "dropdown") {
                        let dropdownProps = {};

                        if (filter && filter[filterKey]) {
                            const currentVal = filter[filterKey];
                            // console.log(currentVal);
                            dropdownProps.value = {
                                value: JSURL.stringify(currentVal),
                                label: currentVal.itemValue,
                            };
                        }

                        return (
                            <Dropdown
                                key={filterKey}
                                onChange={onSelect}
                                className={filterKey + "-dropdown-toggle"}
                                options={value.map((itemValue) => ({
                                    value: JSURL.stringify({
                                        filterKey,
                                        field,
                                        itemValue,
                                    }),
                                    label: itemValue,
                                }))}
                                placeholder={label}
                                {...dropdownProps}
                            />
                        );
                    }
                })}
            </motion.div>
        </div>
    );
}
