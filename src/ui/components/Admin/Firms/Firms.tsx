import { useState } from "react";
import Button from '~/ui/components/Button';
import UsersList from "../AdminUsers/UsersList";
import Invitations from "../Invitations/Invitations";
import FirmList from "./FirmList";

interface IFormProps {
    onSelect: any;
}

const Firms = ({ onSelect }: IFormProps ) => {
    const [showFirmList, setShowFirmList] = useState<boolean>(true);
    const [showUsers, setShowUsers] = useState<boolean>(false);
    const [firmId, setFirmId] = useState<number>(0);

    const select = (id: number) => {
        setShowFirmList(false);
        setShowUsers(true);
        setFirmId(id);
    }

    const handleReturn = () => {
        setShowFirmList(true);
        setShowUsers(false);
    }

    return (
        <>
            {showFirmList ?
                <FirmList onSelect={select}/> : null }
            {showUsers ? 
            <>
                <UsersList firmId={firmId} onReturn={handleReturn} />
                <Invitations firmId={firmId} />
            </>: null}
        </>
    )
}

export default Firms;