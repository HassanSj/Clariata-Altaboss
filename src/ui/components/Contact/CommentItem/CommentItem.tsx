import React, {ReactElement, useState} from "react";
import {
  Avatar,
  Button, Grid,
  Input,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip
} from "@material-ui/core";
import {Comment} from "~/types/api/comment";
import {useStoreState} from "~/store/hooks";
import {hasItems, isNullOrUndefined, toDateTimeShort, toTimeSince} from "~/ui/constants/utils";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {AxiosResponse} from "axios";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";
import {OwnerParams} from "~/types/relations";
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";
import {User} from "~/types/api/user";
import styles from "./CommentItem.module.scss";
import classnames from "classnames";
import CommentForm from "~/ui/components/Contact/CommentForm";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import Icon from "@material-ui/core/Icon";
import {IDataItemEventConfig} from "~/types/data";
import usePagination from "~/ui/hooks/usePagination";
import DataWrapper from "~/ui/components/Data/DataWrapper";

interface IProps {
  ownerType: OwnerType;
  index: number;
  comment: Comment;
  parent?: Comment;
  eventConfig?: IDataItemEventConfig;
}

const CommentItem = ({ownerType, index, comment, parent, eventConfig}: IProps): ReactElement => {
  const {selectedPerson} = useStoreState(state => state.person);
  const {selectedHousehold} = useStoreState((state) => state.household);
  const {selectedActionItem, selectedObjective} = useStoreState(state => state.objective);

  const [sender, setSender] = useState<any>();
  const {user, users} = useStoreState(state => state.user);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isEditable,setIsEditable] = useState(false);
  const [updatedComment,setUpdatedComment] = useState<string>()
  const [actionMenuEl, setActionMenuEl] = React.useState(null);
  const { contactId } = useStoreState(state => state.selected);

  const params: OwnerParams = {
    ownerType,
    requestType: ApiRequestType.CREATE_UPDATE,
    modelId: comment?.CommentID,
    modelName: OwnerModelType.COMMENT,
    userId: user?.UserID,
    personId: contactId,
    householdId: selectedHousehold?.HouseholdID,
    objectiveId: selectedObjective?.ObjectiveID,
    actionItemId: selectedActionItem?.ActionItemID,
    commentSetId: (isNullOrUndefined(parent) ? 0 : parent?.ChildCommentSetID)
  };

  const loadUser = async () => {
    if (comment?.UserID && users) {
      setSender(users?.find((u: User) => u.UserID === comment?.UserID))
    }
  }

  const updateComment = async (e:any) => {
    try {
      params.requestType = ApiRequestType.UPDATE;
      params.ownerType  = OwnerType.PERSON;
      comment.Comment=updatedComment
      await api.comment.update(params, comment);
      setIsEditable(false);
      if (eventConfig?.onUpdate) {
        eventConfig?.onUpdate();
      }
    } catch (err) {
      processServerError(err, 'CommentForm.updateComment');
    }
  }

  const handleUpdateChange = async (e:any) => {
      setUpdatedComment(e?.target?.value)
  }

  const loadChildComments = async (commentSetId?: number) => {
    const result: Comment[] = [];

    // Load highest level comments
    const ownerParams: OwnerParams = {
      requestType: ApiRequestType.LIST,
      ownerType: ownerType ?? OwnerType.PERSON,
      modelName: OwnerModelType.COMMENT,
      userId: user?.UserID,
      personId: selectedPerson?.PersonID,
      householdId: selectedHousehold?.HouseholdID,
      objectiveId: selectedObjective?.ObjectiveID,
      actionItemId: selectedActionItem?.ActionItemID,
      commentSetId
    };
    try {
      const res: AxiosResponse = await api.comment.list(ownerParams);
      if (hasItems(res?.data)) result.push(...res.data);
    } catch (err) {
      processServerError(err, 'CommentItem.loadChildComments');
    }

    // Populate child comments
    if (result) {
      const promises = [];
      result.forEach((c: Comment) => {
        try {
          promises.push(loadChildComments(c.ChildCommentSetID).then((commentChildren) => {
            c.Children = commentChildren;
          }));
        } catch (err) {
          processServerError(err, 'CommentItem.loadChildComments');
        }
      });
    }

    return result;
  }

  const remove = async () => {
    if (!comment) return;
    try {
      params.requestType = ApiRequestType.REMOVE;
      params.ownerType  = OwnerType.PERSON

      await api.comment.remove(params, comment);
      if (eventConfig?.onRemove) {
        eventConfig?.onRemove(comment, index);
      }

    } catch (err) {
      processServerError(err, 'CommentForm.remove');
    }
  };


  useMountEvents({
    onMounted: async () => {
      await loadUser();
    },
  });

  return (
    <>
      <ListItem className={styles.comment}>
        <ListItemAvatar>
          <Avatar src={sender?.PhotoURL}/>
        </ListItemAvatar>
        <ListItemText>
          <div className={styles.comment_from}>
            {sender?.EmailAddress}
          </div>
          {!isEditable ? <div className={styles.comment_text}>
            {comment?.Comment}
          </div>
          :
          <div>
            <Input
              type="text"
              value={updatedComment}
              onChange={handleUpdateChange}
            />
            <Button
              style={{marginLeft:"10px"}}
              color="primary"
              variant="contained"
              size="small"
              onClick={updateComment}>
                Update
            </Button>
            <Button
              style={{marginLeft:"10px"}}
              color="secondary"
              variant="contained"
              size="small"
              onClick={()=> setIsEditable(false)}>
                Cancel
            </Button>
          </div>}
        </ListItemText>
        <ListItemSecondaryAction>
          <div className={styles.comment_actions}>
            <Tooltip title={toDateTimeShort(comment?.CreationDate)}>
              <span className={classnames(styles.comment_date, styles.comment_action)}>
                {toTimeSince(comment?.CreationDate)}
              </span>
            </Tooltip>
            <Button onClick={(e: any) => setActionMenuEl(e.currentTarget)} size="small">
              <Icon>more_vert</Icon>
            </Button>
            <Menu
              id="actions-menu"
              anchorEl={actionMenuEl}
              open={Boolean(actionMenuEl)}
              onClose={() => setActionMenuEl(null)}>
               <MenuItem key={'edit'} onClick={() =>{setIsEditable(true);setUpdatedComment(comment?.Comment)}}>Edit</MenuItem>
              <MenuItem key={'delete'} onClick={() => setShowDeleteConfirmation(true)}>Delete</MenuItem>
            </Menu>
          </div>
        </ListItemSecondaryAction>
      </ListItem>
      <ConfirmationModal isOpen={showDeleteConfirmation}
                         onConfirm={remove}
                         onCancel={() => setShowDeleteConfirmation(false)}/>
    </>
  )
}

export default CommentItem;
