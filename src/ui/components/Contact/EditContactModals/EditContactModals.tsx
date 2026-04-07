import React, {ReactElement} from 'react';
import {OwnerType} from "~/ui/constants/api";
import {ContactDataType} from "~/ui/constants/contact";
import EditContact from "~/ui/components/Contact/EditContact";
import AddressForm from "~/ui/components/Contact/AddressForm";
import EducationForm from "~/ui/components/Contact/EducationForm";
import WorkForm from "~/ui/components/Contact/WorkForm/WorkForm";
import PhoneNumberForm from "~/ui/components/Contact/PhoneNumberForm/PhoneNumberForm";
import RelationshipForm from "~/ui/components/Contact/RelationshipForm";
import PhotoForm from "~/ui/components/Contact/PhotoForm";
import ContactCardModal from "~/ui/components/Contact/ContactCardModal";
import {useStoreActions, useStoreState} from "~/store/hooks";
import RoleForm from "~/ui/components/Contact/RoleForm";
import CompanyForm from "~/ui/components/Contact/CompanyForm";

interface IProps {
    editable: any;
    ownerType: OwnerType;
    onHide?: () => void;
    refresh?: () => void;
    markIsDirty?: any;
    isNewPerson?: boolean;
}

const EditContactModals = ({editable, ownerType, onHide, refresh, isNewPerson, markIsDirty}: IProps): ReactElement => {
    const {onSelect} = useStoreActions(actions => actions.person);

    const setIsDirty = () => {
        markIsDirty();
    }

    return (
        <>
            {/* <ContactCardModal person={editable.getSelected()}
                              ownerType={ownerType}
                              isOpen={editable.isTypeOpen(ContactDataType.VIEW)}
                              onClose={() => editable.hideType(ContactDataType.VIEW)}
                              markIsDirty={() => setIsDirty()}
                              /> */}
            <EditContact person={editable.getSelected()}
                         isOpen={editable.isTypeOpen(ContactDataType.PERSON)}
                         onClose={() => editable.hideType(ContactDataType.PERSON)}
                         selectPerson={async (p) => await onSelect({person: p})}
                         markIsDirty={() => setIsDirty()}
                         />
            <AddressForm item={editable.getSelected()}
                         isOpen={editable.isTypeOpen(ContactDataType.ADDRESS)}
                         onClose={() => {
                             editable.hideType(ContactDataType.ADDRESS);
                             refresh;
                             if (onHide)
                                 onHide()
                         }}
                         ownerType={ownerType}/>
            <EducationForm item={editable.getSelected()}
                           isOpen={editable.isTypeOpen(ContactDataType.EDUCATION)}
                           onClose={() => editable.hideType(ContactDataType.EDUCATION)}
                           ownerType={ownerType}/>
            <WorkForm item={editable.getSelected()}
                      isOpen={editable.isTypeOpen(ContactDataType.WORK)}
                      onClose={() => editable.hideType(ContactDataType.WORK)}
                      ownerType={ownerType}/>
            <RoleForm item={editable.getSelected()}
                      isOpen={editable.isTypeOpen(ContactDataType.ROLE)}
                      onClose={() => {
                          editable.hideType(ContactDataType.ROLE)
                          if (onHide)
                              onHide()
                      }}
                      ownerType={ownerType}/>
            <CompanyForm item={editable.getSelected()}
                      isOpen={editable.isTypeOpen(ContactDataType.COMPANY)}
                      onClose={() => {
                          editable.hideType(ContactDataType.COMPANY)
                          if (onHide)
                              onHide()
                      }}
                      ownerType={ownerType}/>
            <PhoneNumberForm item={editable.getSelected()}
                             isOpen={editable.isTypeOpen(ContactDataType.PHONE_NUMBER)}
                             onClose={async () => {
                                editable.hideType(ContactDataType.PHONE_NUMBER);
                                refresh;
                             }}
                             ownerType={ownerType}
                             isNewPerson={isNewPerson}/>
            <RelationshipForm item={editable.getSelected()}
                              key={editable.getSelected()?.PersonalRelationshipID ?? 0}
                              isOpen={editable.isTypeOpen(ContactDataType.RELATIONSHIP)}
                              onClose={() => {
                                  editable.hideType(ContactDataType.RELATIONSHIP)
                                  if (onHide)
                                      onHide()
                              }}
                              ownerType={ownerType}/>
            <PhotoForm item={editable.getSelected()}
                       isOpen={editable.isTypeOpen(ContactDataType.PHOTO)}
                       onClose={() => editable.hideType(ContactDataType.PHOTO)}
                       ownerType={ownerType}/>
            <PhotoForm item={editable.getSelected()}
                       isOpen={editable.isTypeOpen(ContactDataType.FAMILY_PHOTO)}
                       onClose={() => editable.hideType(ContactDataType.FAMILY_PHOTO)}
                       query="family=true"
                       ownerType={ownerType}/>
            <PhotoForm item={editable.getSelected()}
                       isOpen={editable.isTypeOpen(ContactDataType.COUPLE_PHOTO)}
                       onClose={() => editable.hideType(ContactDataType.COUPLE_PHOTO)}
                       query="couple=true"
                       ownerType={ownerType}/>
            <PhotoForm item={editable.getSelected()}
                       isOpen={editable.isTypeOpen(ContactDataType.LOGO)}
                       onClose={() => editable.hideType(ContactDataType.LOGO)}
                       query="logo=true"
                       ownerType={ownerType}/>
        </>
    );
};

export default EditContactModals;
