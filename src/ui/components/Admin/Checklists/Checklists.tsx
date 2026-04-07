import React, { useEffect, useState } from 'react';
import api from '~/services/api';
import { processServerError } from '~/services/api/errors';
import { Checklist } from '~/types/api/checklist';
import useMountEvents from '~/ui/hooks/useMountEvents';
import ChecklistPanel from './ChecklistPanel/ChecklistPanel';
import EditChecklistForm from './EditChecklistForm/EditChecklistForm';
import AddChecklistForm from './AddChecklistForm';
import { IDataItemEventConfig } from '~/types/data';

const Checklists = () => {
    const [listOpen, setListOpen] = useState<boolean>(true);
    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [data, setData] = React.useState<any[]>([]);
    const [editItem, setEditItem] = React.useState<Checklist>();

    const loadData = async () => {
        try {
          const res = await api.checklists.getAllChecklists();
          setData(res.data as Checklist[]);
        } catch (err) {
          processServerError(err, 'Checklists.loadHistory');
        }
    };

    const onClose = async () => {
        setAddOpen(false);
        setEditOpen(false);
        setDeleteOpen(false);
        loadData();
        setListOpen(true);
        
    }

    const openAddForm = () => {
        setAddOpen(true);
        setListOpen(false);
    }

    const openEditForm = (id: number) => {
        setEditOpen(true);
        setListOpen(false);
        let item: any[] = data.filter(x => x.ChecklistID == id);
        if(item)
          setEditItem(item[0]);
    }

    const openDelete = () => {
        setDeleteOpen(true);
    }

    useMountEvents({
        onMounted: async () => {
          loadData();
        },
      });
    
      const handleRemove = async () => {
        await loadData();
      }
  
      const handleEdit = async () => {
        await loadData();
      }

      const handleAdd = async () => {
        await loadData();
      }
  
      const eventConfig: IDataItemEventConfig = {
        onRemove: handleRemove,
        onDataChange: handleEdit,
        onChange: handleAdd 
      }

    return (
        <>
            {listOpen ?
            <ChecklistPanel data={data} showAddForm={openAddForm} showEditForm={openEditForm} showDelete={openDelete} closeAddForm={onClose} closeEditForm={onClose} closeDelete={onClose} eventConfig={eventConfig}/>
            : null
            }
            {addOpen ?
              <AddChecklistForm onClose={onClose} reload={loadData} />
              : null
            }
            {editOpen ?
              <EditChecklistForm item={editItem} onClose={onClose} reload={loadData} />
              : null
            }
        </>
    )
}

export default Checklists;