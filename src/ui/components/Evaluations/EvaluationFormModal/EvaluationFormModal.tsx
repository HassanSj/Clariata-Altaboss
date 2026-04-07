import React, {ReactElement, useState} from "react";
import {Button, DialogActions, FormControlLabel, Icon, Radio, RadioGroup} from "@material-ui/core";
import Modal from "~/ui/components/Dialogs/Modal";
import {ClientEvaluation} from "~/types/api/clientEvaluation";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import initialValues from './form/initialValues';
import validate from './form/validate';
import {IFormActionProps} from "~/types/forms";
import api from "~/services/api";
import {extractServerError, processServerError} from "~/services/api/errors";
import {useStoreActions, useStoreState} from "~/store/hooks";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import {ReportType} from "~/ui/constants/reports";
import useReports from "~/ui/hooks/useReports";
import useNotifications from "~/ui/hooks/useNotifications";
import {deleteItem} from "~/ui/components/Evaluations/EvaluationModal/EvaluationModal";
import { ComplexityOfNeed } from "~/types/api/complexityOfNeed";
import useSWR from "swr";
import { fetcher } from "~/types/api/fetcher";
import { getAccessToken } from "~/services/auth";
import { LegacyInterest } from "~/types/api/legacyInterest";
import EvaluationPdfExport from "./EvaluationPdfExport/EvaluationPdfExport";

interface IProps {
    isOpen: boolean;
    onClose: () => unknown;
    evaluation?: ClientEvaluation;
    onSave?: (evaluation: ClientEvaluation) => unknown;
}

const modalHeader = (isEdit: boolean, setOpen:any) => {
    return <>
        {isEdit ?
        <span>Edit Household Evaluation</span> : 
        <span>Create Household Evaluation</span> }
        <Button className="m-l-10" onClick={(e) => {
            e.preventDefault();
            window.open('/static/ClientEvaluationWorksheet.pdf', '_blank');
        }}
                   size="medium">
            <Icon>print</Icon>
            Print Blank Evaluation PDF
        </Button>
        { isEdit ?
            <Button className="m-l-10" onClick={(e) => {
            e.preventDefault();
            setOpen(true);
        }}
                   size="medium">
            <Icon>print</Icon>
            Print Evaluation PDF
        </Button>
        :
        null}
    </>
}

/**
 * Main component
 * @param isOpen
 * @param onClose
 * @param evaluation
 * @param onSave
 * @constructor
 */
const EvaluationFormModal = ({isOpen, onClose, evaluation, onSave}: IProps): ReactElement => {
    const notifications = useNotifications()
    const [exportOpen, setExportOpen] = useState<boolean>(false);
    const {onPopulate} = useStoreActions(actions => actions.evaluation);
    //const {complexityOfNeeds, legacyInterest} = useStoreState(state => state.constants)
    const { data: complexityOfNeeds } = useSWR<ComplexityOfNeed[]>([`${process.env.NEXT_PUBLIC_API_URL}/complexityofneeds/list`, getAccessToken()], fetcher);
    const { data: legacyInterest } = useSWR<LegacyInterest[]>([`${process.env.NEXT_PUBLIC_API_URL}/legacyinterest/list`, getAccessToken()], fetcher);

    const [complexityChecked, setComplexityChecked] = React.useState<string>(String(evaluation?.ComplexityOfNeedsID ?? ""));
    const [legacyChecked, setLegacyChecked] = React.useState<string>(String(evaluation?.LegacyInterestID ?? ""));
    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState<boolean>(false);

    const {downloadPdfReport} = useReports();

    /**
     * Create/Update evaluation
     * @param values
     * @param setErrors
     */
    const createOrUpdate = async (values: ClientEvaluation, {setErrors}: IFormActionProps) => {
        notifications.toggleLoading(true)
        try {
            if (complexityChecked !== '') values.ComplexityOfNeedsID = complexityChecked;
            if (legacyChecked !== '') values.LegacyInterestID = legacyChecked;
            // @ts-ignore
            if(values.ClientEvaluationID === ""){
                values.ClientEvaluationID = undefined
            }

            const isNew = !values?.ClientEvaluationID
            console.log(values);
            const res = await (isNew ? api.evaluation.create(values) : api.evaluation.update(values!.ClientEvaluationID!, values) );
            const result = res.data as ClientEvaluation;

            if (result.ClientEvaluationID) {
                onPopulate(null);
                setErrors({successMessage: 'Evaluation successfully created!'});

                if (onSave)
                    onSave(result)
            }
        } catch (err) {
            setErrors({backError: extractServerError(err)});
        }

        notifications.toggleLoading(false)
    }

    /**
     * Download as PDF
     */
    const handleDownload = async () => {
        await downloadPdfReport(ReportType.EVALUATION, evaluation!.ClientEvaluationID);
    }

    const compositeScore = evaluation ? String(Number(evaluation!.ComplexityOfNeedsScore) + Number(evaluation!.LegacyInterestScore)) : undefined

    /**
     * JSX
     */
    return (
        <>
            <Modal title={modalHeader(evaluation ? true: false, setExportOpen)} isOpen={isOpen} handleClose={onClose} width="md" hideFooter={true}>
                <FormWrapper initialValues={evaluation ? evaluation : initialValues}
                             // validationSchema={validate}
                             onSubmit={createOrUpdate}
                             modelName="ClientEvaluation">
                    <div>
                        <InputField type="text"
                                    label="Evaluation Name"
                                    name="Description"
                                    component={Input}/>
                        <InputField type="textarea"
                                    name="GoalsDetail"
                                    component={Input}
                                    placeholder="What are you trying to accomplish at this point in your life?"
                                    label="What are you trying to accomplish at this point in your life?"
                        />
                        <InputField type="textarea"
                                    name="ConcernsDetail"
                                    component={Input}
                                    placeholder="What are your concerns?"
                                    label="What are your concerns?"
                        />
                        <InputField type="textarea"
                                    name="NeedsDetail"
                                    component={Input}
                                    placeholder="How complex are your family’s affairs?"
                                    label="How complex are your family’s affairs?"
                        />
                        <RadioGroup
                            aria-label="gender"
                            defaultValue="female"
                            name="ComplexityOfNeedsID"
                            row
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setComplexityChecked(String(event?.target?.value))}>
                            {complexityOfNeeds?.map((complexity: any) => {
                                return (
                                    <FormControlLabel
                                        value={String(complexity.ComplexityOfNeedsID)}
                                        control={<Radio checked={complexityChecked === String(complexity.ComplexityOfNeedsID)}/>}
                                        label={complexity.ComplexityOfNeedsValue}/>
                                )
                            })}
                        </RadioGroup>
                        <InputField type="textarea"
                                    name="LegacyDetail"
                                    component={Input}
                                    placeholder="What is your interest in perpetuating a family legacy and what do you think you want to pass on to your family?"
                                    label="What is your interest in perpetuating a family legacy and what do you think you want to pass on to your family?"
                        />
                        <RadioGroup
                            aria-label="gender"
                            defaultValue="female"
                            name="LegacyInterestID"
                            row
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLegacyChecked(String(event?.target?.value))}>
                            {legacyInterest?.map((legacy: any) => {
                                return (
                                    <FormControlLabel
                                        value={legacy.LegacyInterestID}
                                        control={<Radio checked={legacyChecked === String(legacy.LegacyInterestID)}/>}
                                        label={legacy?.LegacyInterestValue}/>
                                )
                            })}
                        </RadioGroup>
                        {compositeScore &&
                            <div>
                                <div>
                                    Composite score: <StringValue value={compositeScore} maxLength={2}/>
                                </div>
                                <div>
                                    Respondent is a candidate for the Clariata LifeMapping Program if the score is 7 or higher.<br/>
                                    Traditional financial planning should be considered if the score is less than 7.
                                </div>
                            </div>
                        }
                    </div>
                    <DialogActions>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            color="primary">
                            Save
                        </Button>
                        <Button onClick={onClose} size="large" variant="contained">
                            Cancel
                        </Button>
                        <Button onClick={() => setShowDeleteConfirmation(true)}
                                   size="large"
                                   disabled={!evaluation}
                                   variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </FormWrapper>
            </Modal>
            <ConfirmationModal isOpen={showDeleteConfirmation}
                               onConfirm={async ()=>{
                                   await deleteItem(evaluation!,notifications,onClose,onPopulate)
                               }}
                               onCancel={() => setShowDeleteConfirmation(false)}/>
            <EvaluationPdfExport isOpen={exportOpen} onClose={setExportOpen} evaluation={evaluation}/>
        </>
    )
}

export default EvaluationFormModal