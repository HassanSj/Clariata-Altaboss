import React, {ReactElement, useState} from 'react';


import Modal from "~/ui/components/Dialogs/Modal";
import api from "~/services/api";
import {
    List,
    ListItem, ListItemText, ListItemSecondaryAction, Button, ButtonGroup, Grid
} from "@material-ui/core";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {ClientEvaluation} from '~/types/api/clientEvaluation';
import {processServerError} from 'services/api/errors';
import EvaluationFormModal from "~/ui/components/Evaluations/EvaluationFormModal";
import useNotifications from "~/ui/hooks/useNotifications";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";

interface IProps {
    isOpen: boolean;
    onClose: () => unknown;
}

/**
 * Delete selected evaluation item
 */
export const deleteItem = async (evaluation: ClientEvaluation, notifications: any, onClose: any | null, onPopulate: any) => {
    notifications.toggleLoading(true)
    try {
        await api.evaluation.remove(evaluation!.ClientEvaluationID!, evaluation!);
        onPopulate(null);
        if (onClose)
            onClose()
    } catch (err) {
        processServerError(err, 'evaluation.delete');
    }
    notifications.toggleLoading(false)
}

const EvaluationModal = ({isOpen, onClose}: IProps): ReactElement => {
    const notifications = useNotifications()
    const {evaluations} = useStoreState((state) => state.evaluation);
    const {onPopulate} = useStoreActions(actions => actions.evaluation);

    const [evaluationToEdit, setEvaluationToEdit] = useState<ClientEvaluation | undefined>()
    const [createEvaluation, setCreateEvaluation] = useState<boolean>(false)
    const [evaluationToDelete, setEvaluationToDelete] = useState<ClientEvaluation | undefined>()

    return (
        <>
            <Modal title="Client Evaluation List" headerActions={
                <Button className="m-l-20" color="primary" variant="contained" onClick={() => setCreateEvaluation(true)}>
                    Add
                </Button>
            } isOpen={isOpen} handleClose={onClose} width="md" hideFooter={true}>
                <List>
                    {evaluations.map(evaluationItem => (
                        <ListItem button onClick={() => setEvaluationToEdit(evaluationItem)}>
                            <ListItemText>
                                {evaluationItem.Description}
                            </ListItemText>
                            <ListItemSecondaryAction>
                                <ButtonGroup>
                                    <Button variant="contained" onClick={ () => {
                                        setEvaluationToDelete(evaluationItem)
                                    }}>Delete</Button>
                                </ButtonGroup>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Modal>
            <EvaluationFormModal
                key={evaluationToEdit ? evaluationToEdit!.ClientEvaluationID : "new-ev"}
                isOpen={createEvaluation || !!evaluationToEdit}
                evaluation={evaluationToEdit}
                onClose={() => {
                    setEvaluationToEdit(undefined)
                    setCreateEvaluation(false)
                }}
                onSave={(ev) => {
                    setCreateEvaluation(false)
                    setEvaluationToEdit(ev)
                }}
            />
            <ConfirmationModal isOpen={!!evaluationToDelete}
                               onConfirm={async () => {
                                   await deleteItem(evaluationToDelete!, notifications, null, onPopulate)
                               }}
                               onCancel={() => setEvaluationToDelete(undefined)}/>
        </>
    );
};

export default EvaluationModal;
