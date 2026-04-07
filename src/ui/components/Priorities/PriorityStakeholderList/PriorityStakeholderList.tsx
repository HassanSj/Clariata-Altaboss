import {Objective} from "~/types/api/objective";
import {hasItems} from "~/ui/constants/utils";
import {List} from "@material-ui/core";
import React, {useState} from "react";
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";
import styles from "./PriorityStakeholderList.module.scss";
import PriorityStakeholderItem from "~/ui/components/Priorities/PriorityStakeholderItem";
import {PersonType} from "~/ui/constants/api";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {ObjectiveStakeholder} from "~/types/api/objectiveStakeholder";

interface IProps {
  objective?: Objective;
  personTypeFilters?: PersonType[];
  personNotTypeFilters?: PersonType[];
}

const PriorityStakeholderList = ({ objective, personTypeFilters, personNotTypeFilters }: IProps) => {
  const [stakeholders, setStakeholders] = useState<ObjectiveStakeholder[] | undefined>([]);

  const filterStakeholders = () => {
    if (!personTypeFilters && !personNotTypeFilters) {
      setStakeholders(objective?.Stakeholders);
    } else if (personTypeFilters) {
      setStakeholders(objective?.Stakeholders?.filter(s => {
        return s?.Person?.PersonTypeID ? (personTypeFilters?.indexOf(s?.Person?.PersonTypeID) > -1) : false;
      }));
    } else if (personNotTypeFilters) {
      setStakeholders(objective?.Stakeholders?.filter(s => {
        return s?.Person?.PersonTypeID ? (personNotTypeFilters?.indexOf(s?.Person?.PersonTypeID) < 0) : false;
      }));
    }
  }

  useMountEvents({
    onMounted: async () => {
      filterStakeholders();
    },
    onChange: async () => {
      filterStakeholders();
    },
    watchItems: [objective, objective?.Stakeholders]
  });

  return (
    <>
      <List className={styles.list}>
        {hasItems(stakeholders) ? stakeholders?.map((stakeholder: any, sindex: number) => {
          return (
            <PriorityStakeholderItem objective={objective}
                                     stakeholder={stakeholder} />
          )
        }) : <EmptyContainer text="No stakeholders found."/>}
      </List>
    </>
  )
}

export default PriorityStakeholderList;
