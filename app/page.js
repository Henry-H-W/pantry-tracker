'use client'
import { Box, Stack, Typography, Button, Modal, TextField} from "@mui/material";
import {firestore} from '@/firebase'
import { collection, query, getDocs, getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore'
import { useEffect, useState } from "react";
import * as React from 'react';

export default function Home() {
  const [addOpen, setAddOpen] = React.useState(false);
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState('');
  const [editItem, setEditItemName] = useState('');
  const [editQuantity, setEditQuantity] = useState(-1)
  const [searchQuery, setSearchQueryName] = useState('');

  const updatePantry = async (search='') => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      if(doc.id.startsWith(search))
      pantryList.push({'name': doc.id, ...doc.data()})
    })
    setPantry(pantryList)
  } 

  useEffect(() => {
    updatePantry()
  }, [])
  
  const updateEdit = (item, number) => {
    setEditItemName(item)
    setEditQuantity(number)
    setItemName(item)
  }

  const addItem = async (item) => {
    item = item.toLowerCase()

    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)  

    if(docSnap.exists()) {
      const {count} = docSnap.data()
      await setDoc(docRef, {count: count + 1})
    }
    else{
      await setDoc(docRef, {count: 1})
    }
    updatePantry()
  }

  const removeItem = async (item) => {
    await deleteDoc(doc(collection(firestore, 'pantry'), item))
    updatePantry()
  }

  return (
    <Box className='w-full v-full flex flex-col justify-center items-center gap-4 p-5'>
      <Box className='flex flex-row justify-between w-full'>
        <Box className='flex flex-row'>
          <TextField label='Search' id='outlined-basic' value={searchQuery} variant='outlined' className="w-[600px]" onChange={(e) => {setSearchQueryName(e.target.value)}}></TextField>
          <Button variant='contained' onClick={() => updatePantry(searchQuery)}>Search</Button>
        </Box>
        <Button variant='contained' onClick={handleAddOpen}>Add Item</Button>
      </Box>
      
      {/* Add items modal */}
      <Modal
        open={addOpen}
        onClose={handleAddClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='absolute top-1/2 left-1/2 w-[400px] bg-white p-4 shadow-lg translate -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3'>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add item
          </Typography>
          <Stack className="flex flex-row w-full gap-2">
            <TextField label='Item' id='outlined-basic' value={itemName} variant='outlined' className="w-full" onChange={(e) => {setItemName(e.target.value)}}></TextField>
            <Button variant='outlined' onClick={() => {
              addItem(itemName)
              setItemName('')
              handleAddClose()
            }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Edit items modal */}
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='absolute top-1/2 left-1/2 w-[400px] bg-white p-4 shadow-lg translate -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3'>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit item
          </Typography>
          <Stack className="flex flex-col w-full gap-2">
            <Box className='gap-4 flex flex-col'>
              <TextField label='Item' id='outlined-basic' value={editItem} variant='outlined' className="w-full" onChange={(e) => {setEditItemName(e.target.value)}}></TextField>
              <TextField type='number' label='Quantity' id='outlined-basic' value={editQuantity} variant='outlined' className="w-full" onChange={(e) => {setEditQuantity(e.target.value)}}></TextField>
            </Box>
            <Box className='flex flex-row w-full gap-2 justify-center'>
              <Button colour='error' variant='outlined' className='px-7' onClick={() => {
                setItemName('')
                removeItem(itemName)
                handleEditClose()
              }}>
                Remove
              </Button>
              <Button variant='outlined' className='px-7' onClick={() => {
                removeItem(itemName)
                addItem(editItem, editQuantity)
                setItemName('')
                handleEditClose()
              }}>
                Confirm
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <Box className='border border-gray-800 h-[500px] w-full'>
        <Box className='w-full h-[100px] bg-[#c1b6ff] flex justify-center items-center'>
          <Typography variant={'h2'} color='#333' textAlign='center'>Pantry Items</Typography>
        </Box>
        <Stack className='w-full h-full gap-2 overflow-auto'>
          {pantry.map(({name, count}) => (
            <Stack className="flex flex-row justify-between" key={name}>
              <Box className='w-full min-h-[100px] flex flex-col px-12 bg-[#f0f0f0]'>
                <Typography variant={'h3'} color='#333' textAlign='center'>{name.charAt(0).toUpperCase() +  name.slice(1) + " " + count}</Typography>
              </Box>
              <Button variant='contained' onClick={() => {
                updateEdit(name, count)
                handleEditOpen()
              }}>Edit</Button>
            </Stack>
            ))}
        </Stack>
      </Box>
    </Box>
  );
}
