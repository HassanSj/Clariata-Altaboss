import {IActionItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import {toMonth, toYear} from "~/ui/constants/utils";
import React from "react";
import SelectDate from "~/ui/components/Forms/SelectDate";

const SchedulingTemplate = ({props}: IActionItemCellTemplateConfig) => {
    return (
        <>
            <DataTableCell inputProps={{
                type: props.type ?? 'month',
                component: SelectDate,
                field: {
                    name: 'StartDate',
                    value: props?.item?.StartDate
                }
            }} onSave={(e) => props?.onUpdateFields(e)}>
                {
                    props?.item?.StartDate ?
                        (props.type ?? "month") === "month"
                            ? toMonth(props?.item?.StartDate?.toString())
                            : toYear(props?.item?.StartDate?.toString(), "yyyy")
                        : ""
                }
            </DataTableCell>
        </>
    )
}

export default SchedulingTemplate;
