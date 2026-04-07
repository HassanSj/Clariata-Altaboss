import styles from "./../Widgets.module.scss";
import classnames from 'classnames';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {Icon, Button, CardActions, Grid, CardMedia} from "@material-ui/core";
import React, {useEffect} from "react";
import {isNullOrUndefined, toPercentage} from "~/ui/constants/utils";
import {useRouter} from "next/router";
import { getPhotoSrc, getPhotoSrcFamily } from "~/ui/constants/user";
import { ContactDataType, ContactDataTypes } from "~/ui/constants/contact";
import { useStoreState } from "~/store/hooks";
import useEditable from "~/ui/hooks/useEditable";
import EditContactModals from "../../Contact/EditContactModals";
import { OwnerType } from "~/ui/constants/api";
import ModuleBadge from "../../ModuleBadge";
import { isUndefined } from "util";
import styled from "@material-ui/styles/styled";

interface IProps {
  hide?: boolean;
  title?: string;
  content?: string;
  icon?: string;
  link?: string;
  image?: string;
  children?: any;
  childrenPlacement?: 'bottom' | 'top';
  updateImage?: (imgURL: string) => unknown;
  interviewTemplateID?: number;
  computedProgress?: number;
  big?: boolean;
  noContent?: boolean;
  last?: boolean;
  tabs?: boolean;
}

const CardContentNoPadding = styled(CardContent)({
  padding: '0px !important',
  display: 'flex',
  alignItems: 'stretch',
  height: '100%'
});

const Widget = ({ hide,
                  title,
                  content,
                  icon,
                  link,
                  image,
                  children,
                  childrenPlacement = 'bottom',
                  updateImage,
                  interviewTemplateID,
                  computedProgress,
                  big,
                  noContent,
                  last,
                  tabs,
}: IProps) => {
  const router = useRouter();

  const goToLink = () => {
    if (link) {
      router.push(link);
    }
  }

  const {selectedHousehold} = useStoreState(state => state.household);

  const editable = useEditable(ContactDataTypes);
  const toggleEditModal = (type: ContactDataType, item: any | undefined) => {
      editable.setSelectedAndShow(type, item);
  }


  useEffect(() => {
    updateImage ? updateImage(getPhotoSrcFamily(selectedHousehold?.Photo)) : null;
  }, [selectedHousehold?.Photo]);

  return (
    <>
      { !hide ?
      <div className={styles.maxHeight}>
        <Card elevation={0} className={classnames(styles.widget,
          { [styles.widget_with_image]: !isNullOrUndefined(image) },
          { [styles.cl_last]: last ? last : false },
          { [styles.clickable]: !isNullOrUndefined(link) },
          { [styles.cl_big_banner]: big ? big : false },
          { [styles.cl_no_tools]: noContent ? noContent : false },
          { [styles.cl_tabs_section]: tabs ? tabs : false },
          { [styles.cl_box_content]: isNullOrUndefined(image) },
          { [styles.cl_image_no_image]: title =="Top Priority" && isNullOrUndefined(image)},
          { [styles.cl_full_width]: title=="LifeGraph"})}
              onClick={goToLink}>
          { !isNullOrUndefined(image) || title == "Top Priority" ? 
          // <div className={styles.cl_image}>
          //   <CardMedia
          //     className={classnames(styles.cardmedia)}
          //     image={image}
          //     component="span"
          //   />
          // </div>
          <button className={styles.cl_image_button}>
            { !isNullOrUndefined(image) ? <img src={image} className={styles.cl_image_act}/> : null }
            { !isNullOrUndefined(children) ? children : null }
          </button>
          : <CardContentNoPadding>
              <div className={styles.widget_content_container}>
                {/* { !isNullOrUndefined(children) && childrenPlacement==='top' ? children : null }
                {!(computedProgress === undefined) ? 
                  <div className={classnames(styles.widget_badge)}>
                    <ModuleBadge
                      moduleName={Number(interviewTemplateID)}
                      percentage={0}
                      selected={false}
                      title={false} />
                  </div>
                : !isNullOrUndefined(icon) ?
                  <div className={styles.widget_icon_container}>
                    <Icon className={styles.widget_icon}>{icon}</Icon>
                  </div>
                  : null }
                
                { !isNullOrUndefined(title) ? <div className={styles.widget_title}>{title}</div> : null }
                { !isNullOrUndefined(content) ? <div className={styles.widget_content}>{content}</div> : null }
                { !isNullOrUndefined(children) && childrenPlacement==='bottom' ? children : null } */}
                { !isNullOrUndefined(children) ? children : null }
              </div>
          </CardContentNoPadding>}
          
            {/* { !isNullOrUndefined(image) ?
            <CardActions className={styles.edit_button}>
                <Button color="default" onClick={(event) => {
                  event.stopPropagation();
                  toggleEditModal(ContactDataType.PHOTO, selectedHousehold?.Photo)
                }}>
                  Edit Photo
                </Button>
            </CardActions>
          : null } */}
        </Card>
        <EditContactModals editable={editable} ownerType={OwnerType.HOUSEHOLD}/>
      </div>
      : null }
    </>
  )
}

export default Widget;
