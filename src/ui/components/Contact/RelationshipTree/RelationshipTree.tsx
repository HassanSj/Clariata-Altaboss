import React, { useEffect, useRef, useState } from 'react';
import { useStoreActions, useStoreState } from "~/store/hooks";
import styles from './RelationshipTree.module.scss';
import classnames from 'classnames';
import { FamDiagram } from 'basicprimitivesreact';
import { Colors, Enabled, GroupByType, NavigationMode, PageFitMode } from 'basicprimitives';
import { Card, Icon, IconButton, Tooltip } from "@material-ui/core";
import api from "~/services/api";
import { processServerError } from "~/services/api/errors";
import { getDefaultPhotoSrc } from "~/ui/constants/user";
import { ContactDataType, ContactDataTypes } from "~/ui/constants/contact";
import { OwnerType } from "~/ui/constants/api";
import useNotifications from "~/ui/hooks/useNotifications";
import useEditable from "~/ui/hooks/useEditable";
import EditContactModals from "~/ui/components/Contact/EditContactModals";
import { replaceWhiteSpaceWithEnter } from "~/ui/components/Reports/FamilyTreeReport/FamilyTree";
import StoryOfUsStyles from "~/ui/components/Reports/storyofus";
import { useRouter } from 'next/router';
import paths from '~/ui/constants/paths';
import { Person } from '~/types/api/person';
import { PersonType } from '~/ui/constants/api';

interface IProps {
    excludeMarriage?: boolean
}

const RelationshipTree = ({ excludeMarriage = false }: IProps) => {
    const containerRef = useRef<any>();
    const notifications = useNotifications();
    const editable = useEditable(ContactDataTypes);
    const router = useRouter();
    const { selectedHousehold } = useStoreState(state => state.household);
    const { onSelectContact } = useStoreActions(actions => actions.selected)
    const { onSelect } = useStoreActions(actions => actions.person);
    const [head, setHead] = React.useState<Person | undefined>();
    const { persons } = useStoreState(state => state.person);

    const [isLoaded, setIsLoaded] = useState(false);
    const [treeItems, setTreeItems] = useState();

    useEffect(() => {
        // @ts-ignore
        window.buildDiagram = buildDiagram

        return () => {
            // @ts-ignore
            window.buildDiagram = undefined
        }
    }, [])

    const buildDiagram = async () => {
        notifications.toggleLoading(true);
        setIsLoaded(false);
        try {
            const res = await api.familytree.get(selectedHousehold?.HouseholdID, excludeMarriage);
            const treeItems = res?.data;
            for(let i = treeItems?.length; i > 0; i--){
                const person = findPersonById(Number(treeItems[i]?.id));
                if(person){
                    let filteredType:any;
                    Object.entries(PersonType).filter(([key, value]) => {
                        if(value === person?.PersonTypeID){
                            filteredType = value;
                        }
                    })
                    if(filteredType === PersonType.PROFESSIONAL || filteredType === PersonType.OTHER){
                        treeItems?.splice(i, 1);
                    }
                }
            }
            setTreeItems(treeItems);
        } catch (err) {
            processServerError(err, 'RelationshipTree.onMounted');
        }
        setIsLoaded(true);
        notifications.toggleLoading(false);
    }

    const onSelectRelationship = async (event: any, data: any) => {
        event.stopPropagation();
        const person = findPersonById(data?.context?.id);
        if (!person?.PersonID) return;
        await onSelect({ person });
        editable.setSelectedAndShow(ContactDataType.PERSON, person);
    }

    const findPersonById = (id: number) => {
        return persons?.find(p => String(p.PersonID) === String(id));
    }

    const renderDiagram = () => {
        buildDiagram().then();
    }
    const moveToContacts = async (event: any, data: any) => {
        const person = findPersonById(data?.id);
        if (!person?.PersonID) return;
        setHead(person)
        onSelectContact(person?.PersonID)
        await onSelect({ head, person });
        await router.push(paths.CONTACTS);
        // await router.push(`${paths.CONTACTS}?person=${person.PersonID}`)
    }

    const onAddRelationship = async (event: any, data: any) => {
        event.stopPropagation();
        const person = findPersonById(data?.id);
        if (!person?.PersonID) return;
        await onSelect({ person });
        editable.setSelectedAndShow(ContactDataType.RELATIONSHIP, person);
    }

    const config = {
        pageFitMode: PageFitMode.None,
        autoSizeMinimum: { width: 700, height: 1000 },
        cursorItem: 2,
        linesWidth: 2,
        // linesColor: Colors.Silver,
        normalLevelShift: 20,
        dotLevelShift: 20,
        lineLevelShift: 20,
        normalItemsInterval: 10,
        dotItemsInterval: 10,
        lineItemsInterval: 10,
        arrowsDirection: GroupByType.None,
        connectorType: GroupByType.None,
        elbowType: GroupByType.None,
        linesColor: '#183f69',
        showExtraArrows: false,
        hasSelectorCheckbox: Enabled.False,
        hasButtons: Enabled.True,
        buttonsPanelSize: 40,
        navigationMode: NavigationMode.Inactive,
        // @ts-ignore
        onButtonsRender: (({ context: itemConfig }) => {

            if (!itemConfig.isMarriage) {
                return (
                    <div className={styles.buttons}>
                        <Tooltip key="add_relationship" title="Add Relationship">
                            <IconButton size="small"
                                edge="end"
                                onClick={(e) => onAddRelationship(e, itemConfig)}>
                                <Icon>add</Icon>
                            </IconButton>
                        </Tooltip>
                    </div>
                )
            }
        }),
        defaultTemplateName: "contactTemplate",
        templates: [
            {
                name: "marriageTemplate",
                itemSize: { width: 80, height: 0 }, // 60
                // @ts-ignore
                onItemRender: ({ context: itemConfig }) => {
                    const parts = itemConfig.description.split(" ")
                    const date = parts.length > 0 ? parts[0] : ""

                    return (
                        <></>
                        // <Card>
                        //   <h5 className={classnames("text-center",styles.marriedH)}>
                        //     Married
                        //     <p>{date}</p>
                        //   </h5>
                        // </Card>
                    )
                }
            },
            {
                name: "contactTemplate",
                // itemSize: {width: 110, height: 142},
                // minimizedItemSize: {width: 3, height: 3},
                // highlightPadding: {left: 2, top: 2, right: 2, bottom: 2},
                itemSize: { width: 80, height: 176 },
                minimizedItemSize: { width: 3, height: 3 },
                highlightPadding: { left: 2, top: 2, right: 2, bottom: 2 },
                // @ts-ignore
                onItemRender: ({ context: itemConfig }) => {
                    return (
                        // <Card className={styles.card}>
                        //   <div className={styles.card_header}>
                        //     <div className={styles.card_title}>
                        //       <StringValue value={itemConfig.title} maxLength={12}/>
                        //     </div>
                        //     <div className={styles.card_description}>{itemConfig.description}</div>
                        //   </div>
                        //   <div className={styles.media_container}>
                        //     <img className={styles.media}
                        //          src={itemConfig.image ? itemConfig.image : getDefaultPhotoSrc()}
                        //          title={itemConfig.title}/>
                        //   </div>
                        // </Card>
                        <div style={{ cursor: 'pointer' }}>
                            <div className="person_card" onClick={(e) => moveToContacts(e, itemConfig)}>
                                <img src={itemConfig.image ? itemConfig.image : getDefaultPhotoSrc()}
                                    alt="card-image"
                                    title={itemConfig.title} />
                                <p className="person_name">
                                    <strong>{replaceWhiteSpaceWithEnter(itemConfig.title)}</strong>
                                </p>
                                <p className="person_age">
                                    <strong>{itemConfig?.description}
                                    </strong>
                                </p>
                            </div>
                        </div>
                    )
                },
                // @ts-ignore
                onHighlightRender: ({ context: itemConfig }) => {
                    return (
                        <div className="HighlightFrame" style={{ borderColor: Colors.Black }}>
                            <div className="HighlightBadgePlaceholder">
                                <div className="HighlightBadge" style={{ backgroundColor: Colors.Black }}>
                                    {itemConfig.badge}
                                </div>
                            </div>
                        </div>
                    );
                },
                cursorPadding: { left: 3, top: 3, right: 3, bottom: 3 },
                cursorBorderWidth: 2
            }],
        items: treeItems,
        // pageFitMode:PageFitMode.FitToPage
    };


    useEffect(() => {
        renderDiagram();
    }, []);


    return (
        <div className="pdf-page-wrapper">
            <StoryOfUsStyles />
            <div ref={containerRef}>
                {isLoaded ?
                    <div className={classnames("placeholder", styles.placeholder)}>
                        <FamDiagram centerOnCursor={true}
                            onCursorChanged={onSelectRelationship}
                            config={config} />
                    </div>
                    : null}
            </div>
            <EditContactModals editable={editable} ownerType={OwnerType.PERSON} onHide={renderDiagram} />
        </div>
    );
}

export default RelationshipTree;
