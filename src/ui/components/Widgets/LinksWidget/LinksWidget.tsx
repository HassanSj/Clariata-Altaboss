import Widget from "~/ui/components/Widgets/Widget";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {useRouter} from "next/router";
import paths from "~/ui/constants/paths";

const { PROFILE, DESTINY } = paths;

interface IProps {
  type: 'DISCOVER' | 'DREAM' | 'DIRECTION' | 'DESTINY' | 'OTHER';
}

const LinksWidget = ({ type }: IProps) => {
  const router = useRouter();

  const select = (path: string) => {
    router.push(path);
  }

  const isDiscover = () => {
    return type === 'DISCOVER';
  }

  const isDream = () => {
    return type === 'DISCOVER';
  }

  const isDirection = () => {
    return type === 'DIRECTION';
  }

  const isDestiny = () => {
    return type === 'DESTINY';
  }

  const getTitle = () => {
    if (isDiscover()) {
      return 'Discover Links';
    }

    return 'Links';
  }

  const getIcon = () => {
    if (isDiscover()) {
      return 'link';
    }

    return 'link';
  }

  return (
    <>
      <Widget title={getTitle()}
              icon={getIcon()}>
        <List>
          <ListItem divider>
            <ListItemAvatar>
              <Avatar>
                <Icon>link</Icon>
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              <div>Timeline</div>
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="end"
                          onClick={() => select(PROFILE)}>
                <Icon>arrow_forward</Icon>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <ListItemAvatar>
              <Avatar>
                <Icon>link</Icon>
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              <div>Family Tree</div>
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="end"
                          onClick={() => select(PROFILE)}>
                <Icon>arrow_forward</Icon>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <ListItemAvatar>
              <Avatar>
                <Icon>link</Icon>
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              <div>Client Stories</div>
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="end"
                          onClick={() => select(PROFILE)}>
                <Icon>arrow_forward</Icon>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem divider>
            <ListItemAvatar>
              <Avatar>
                <Icon>link</Icon>
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              <div>Vision Mission Values</div>
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="end"
                          onClick={() => select(PROFILE)}>
                <Icon>arrow_forward</Icon>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Widget>
    </>
  )
}

export default LinksWidget;
