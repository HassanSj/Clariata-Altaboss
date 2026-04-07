import React, { useEffect, useState } from 'react';
import api from '~/services/api';
import { processServerError } from '~/services/api/errors';
import { DestinyGlobalItem } from '~/types/api/destinyGlobalItem';
import useMountEvents from '~/ui/hooks/useMountEvents';
import DestinyForm from './DestinyForm';
import DestinyList from './DestinyList/DestinyList';

const DestinyAdmin = () => {
    const [listOpen, setListOpen] = useState<boolean>(true);
    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [data, setData] = React.useState<DestinyGlobalItem[]>([]);
    const [editItem, setEditItem] = React.useState<DestinyGlobalItem>();

    const loadData = async () => {
        try {
          const res = await api.destiny.getGlobalItems();
          setData(res.data as DestinyGlobalItem[]);
        } catch (err) {
          processServerError(err, 'GlobalItems.loadHistory');
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
        let item: DestinyGlobalItem[] = data.filter(x => x.ItemId == id);
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

    return (
        <>
          {listOpen ?
            <DestinyList data={data} showAddForm={openAddForm} showEditForm={openEditForm} showDelete={openDelete} closeAddForm={onClose} closeEditForm={onClose} closeDelete={onClose} />
            : null}
            {addOpen ?
              <DestinyForm onClose={onClose} reload={loadData} />
              : null
            }
            {editOpen ?
              <DestinyForm item={editItem} onClose={onClose} reload={loadData} />
              : null
            }
              
        </>
    )
}

export default DestinyAdmin