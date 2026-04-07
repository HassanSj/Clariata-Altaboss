import InvitationList from "./InvitationList/InvitationList";

interface IInivitationProps {
    firmId: number;
}

const Invitations = ({firmId}: IInivitationProps) => {

    return (
        <>
            <InvitationList firmId={firmId} onSelect={undefined} />
        </>
    )
}

export default Invitations;