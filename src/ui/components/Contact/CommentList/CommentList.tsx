import {ApiRequestType, OwnerType} from "~/ui/constants/api";
import useMountEvents from "~/ui/hooks/useMountEvents";
import React from "react";
import {AxiosResponse} from "axios";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";
import useNotifications from "~/ui/hooks/useNotifications";
import {useStoreState} from "~/store/hooks";
import {OwnerParams} from "~/types/relations";
import {hasItems} from "~/ui/constants/utils";
import CommentItem from "~/ui/components/Contact/CommentItem";
import CommentForm from "~/ui/components/Contact/CommentForm";
import usePagination from "~/ui/hooks/usePagination";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import {IDataItemEventConfig} from "~/types/data";

interface IProps {
  parent?: Comment;
  ownerType: OwnerType;
  ownerId: number | undefined;
  commentSetId?: number;
  onChange?: any;
  onCountChange?: any;
}

const CommentList = ({ ownerType, ownerId, onChange, onCountChange }: IProps) => {

  const { user } = useStoreState(state => state.user);
  const { selectedPerson } = useStoreState(state => state.person);
  const { selectedHousehold } = useStoreState((state) => state.household);
  const { selectedActionItem } = useStoreState(state => state.objective);

  const [comments, setComments] = React.useState([]);

  const loadComments = async () => {
    const ownerParams: OwnerParams = {
      requestType: ApiRequestType.LIST,
      modelName: 'comment',
      ownerType,
      personId: (ownerType === OwnerType.PERSON) ? ownerId : selectedPerson?.PersonID,
      householdId: (ownerType === OwnerType.HOUSEHOLD) ? ownerId : selectedHousehold?.HouseholdID,
      userId: (ownerType === OwnerType.USER) ? ownerId : user?.UserID,
      objectiveId: (ownerType === OwnerType.OBJECTIVE) ? ownerId : selectedActionItem?.ObjectiveID,
      actionItemId: (ownerType === OwnerType.ACTION_ITEM) ? ownerId : selectedActionItem?.ActionItemID,
      commentSetId: (0)
    };
    try {
      const res: AxiosResponse = await api.comment.list(ownerParams);
      if (hasItems(res?.data)) {
        setComments(res.data);
      }else{
        setComments([]);
      }
      if (onChange) onChange();
      if (onCountChange) onCountChange(hasItems(res?.data) ? res?.data?.length : 0);
    } catch (err) {
      processServerError(err, 'CommentList.loadComments');
    }
  }

  const handleRemove = async (comment: Comment, index: number) => {
    await loadComments();
  }

  const handleUpdate = async (comment: Comment, index: number) => {
    await loadComments();
  }

  // Pagination
  const paginator = usePagination(comments, 5);
  const handleChange = (e: any, p: number) => {
    paginator.jump(p);
  };

  // Data event config
  const eventConfig: IDataItemEventConfig = {
    onChange: handleChange,
    onRemove: handleRemove,
    onUpdate: handleUpdate
  }

  useMountEvents({
    onMounted: async () => {
      await loadComments();
    },
  });

  return (
    <>
      <DataWrapper paginator={paginator}
                   keyLabel="CommentID"
                   propLabel="comment"
                   component={CommentItem}
                   eventConfig={eventConfig} />
      <br />
      <CommentForm ownerType={ownerType} onUpdate={() => loadComments()}/>
    </>
  )
}

export default CommentList;
