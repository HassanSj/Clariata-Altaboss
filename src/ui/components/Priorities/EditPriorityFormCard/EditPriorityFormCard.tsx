import React, {ReactElement} from 'react';
import { useStoreState } from '~/store/hooks';
import EditPriorityFormContent from '../EditPriorityFormContent';

interface IProps {
    onClose: () => unknown;
}

const EditPriorityFormCard = ({onClose}: IProps): ReactElement => {

    const {selectedObjective, selectedObjectiveIds} = useStoreState(state => state.objective);

    return (
        <div>

            {selectedObjective && selectedObjectiveIds[selectedObjective?.ObjectiveID] ?
                <div>
                    <EditPriorityFormContent item={selectedObjective} onClose={onClose} key={selectedObjective.ObjectiveID}/>
                </div>
                : null}
        </div>
    );
};

export default EditPriorityFormCard;
