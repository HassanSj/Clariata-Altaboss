import React, {ReactElement} from "react";
import {
    PersonRelationshipCategoryNames,
    RelationshipCategoryType
} from "~/ui/constants/person";
import Input from "~/ui/components/Forms/Input";

interface IProps{
    selectedCategory: RelationshipCategoryType
    setSelectedCategory: (value:RelationshipCategoryType) => unknown
}

/**
 * Presents radio buttons to select the category of a relationship.
 * Used on the relationship add form
 * @param selectedCategory
 * @param setSelectedCategory
 * @constructor
 */
const RelationshipCategorySelection = ({selectedCategory, setSelectedCategory}:IProps):ReactElement => {
    const items = [
        {
            label: PersonRelationshipCategoryNames[0],
            value: "0"
        },
        {
            label: PersonRelationshipCategoryNames[1],
            value: "1"
        }
    ]

    return (
        <Input
            orientation="horizontal"
            field={{value: String(selectedCategory), name:"Category",onChange:(_e:any,value:RelationshipCategoryType)=>{
                setSelectedCategory(value)
            }}}
            type="radio"
            items={items}
        />
    )
}

export default RelationshipCategorySelection