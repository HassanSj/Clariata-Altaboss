import {IPriorityItemCellTemplateConfig} from "~/types/objective/objectives";
import DataTableCell from "~/ui/components/Data/DataTableCell";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import React from "react";

const RankTemplate = ({props}:IPriorityItemCellTemplateConfig) => {
    return (
        <>
            <DataTableCell inputProps={{
                type: 'text',
                label: 'Rank',
                field: {
                    name: 'Rank',
                    value: props?.objective?.Rank
                }                
            }} editable={false}
                           onSave={(e) => props?.onUpdateFields(e)}>
                <StringValue value={`${(props?.objective?.Rank ?? 0)}`} maxLength={50}/>
            </DataTableCell>
        </>
    )
}

export default RankTemplate;