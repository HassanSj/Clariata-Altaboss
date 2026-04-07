import React, { useEffect, useState } from 'react';
import api from '~/services/api';
import { processServerError } from '~/services/api/errors';
import { DestinySubcategory } from '~/types/api/destinySubcategory';
import useMountEvents from '~/ui/hooks/useMountEvents';
import DestinySubcategoryForm from './DestinySubcategoryForm';
import DestinySubcategoryList from './DestinySubcategoryList/DestinySubcategoryList';

const DestinyAdmin = () => {
    const [listOpen, setListOpen] = useState<boolean>(true);
    const [addOpen, setAddOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [data, setData] = React.useState<DestinySubcategory[]>([]);
    const [editItem, setEditItem] = React.useState<DestinySubcategory>();

    const loadData = async () => {
        try {
          const res = await api.destinySubcategory.getSubcategories();
          setData(res.data as DestinySubcategory[]);
        } catch (err) {
          processServerError(err, 'GlobalItems.loadHistory');
        }
      };

    const onClose = async () => {
        setAddOpen(false);
        setEditOpen(false);
        setDeleteOpen(false);
        await loadData();
        setListOpen(true);
        
    }

    const openAddForm = () => {
        setAddOpen(true);
        setListOpen(false);
    }

    const openEditForm = (id: number) => {
        setEditOpen(true);
        setListOpen(false);
        let item: DestinySubcategory[] = data.filter(x => x.SubcategoryId == id);
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
          {listOpen?
            <DestinySubcategoryList data={data} showAddForm={openAddForm} showEditForm={openEditForm} showDelete={openDelete} closeAddForm={onClose} closeEditForm={onClose} closeDelete={onClose} />
            : null}
            {addOpen?
              <DestinySubcategoryForm onClose={onClose} reload={loadData} />
              : null
            }
            {editOpen?
              <DestinySubcategoryForm subcategoryItem={editItem} onClose={onClose} reload={loadData} />
              : null
            }
              
        </>
    )
}

export default DestinyAdmin