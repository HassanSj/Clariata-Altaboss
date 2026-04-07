import { IObjectiveCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import React from "react";

const ObjectiveDescriptionTemplate = ({ props }: IObjectiveCellTemplateConfig) => {
    return (
        <>
            <DataTableCell
                inputProps={{
                    type: 'text',
                    label: 'Description',
                    field: {
                        name:'Description',
                        value:props?.item?.Description
                    }
                }}
                editable={false}
                onSave={(e) => props?.onUpdateFields ? props?.onUpdateFields(e) : ""}>
                {props?.item?.Description}
            </DataTableCell>
        </>
    )
}

export default ObjectiveDescriptionTemplate;
