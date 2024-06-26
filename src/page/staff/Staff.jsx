import { Typography, Box, Divider, Button, Grow, Alert } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import BreadcrumbGenerator from '../../components/generator/BreadcumbGenerator'
import ConfirmationDialogue from '../../components/ConfirmationDialogue'
import { Searchbox } from '../../components'

import { AuthenticationContext } from '../../App'
import { getStaff, deleteUser } from './logic/Personel'

const Columns = [
  {
    field: 'identifier',
    headerName: 'ID',
    width: 200,
    disableColumnMenu: true,
    sortable: false
  },
  {
    field: 'first_name',
    headerName: 'First Name',
    width: 130
  },
  {
    field: 'last_name',
    headerName: 'Last Name',
    width: 130
  },
  {
    field: 'email_address',
    headerName: 'Email Address',
    width: 250,
    disableColumnMenu: true,
    sortable: false
  },
  {
    field: 'phone_number',
    headerName: 'Phone Number',
    width: 250,
    disableColumnMenu: true,
    sortable: false
  }
]

const Staff = () => {
  const permissions = useContext(AuthenticationContext).permissions
  const [message, setMessage] = useState()

  const [selection, setSelection] = useState()
  const [showDeleteDialog, setDeleteDialog] = useState()
  const [contents, setContents] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    handleSearch()
  }, [])

  useEffect(() => {
    if (message && !message.loading) {
      setTimeout(() => {
        setMessage(undefined)
      }, 7000)
    }
  }, [message])

  async function handleSearch(query) {
    setMessage({ text: 'Loading Records...', severity: 'info', loading: true })

    getStaff(query)
      .then(result => {
        setContents(
          result.map(user => ({
            ...user,
            id: user.staff_id,
            identifier: user.staff_id
          }))
        )
        setMessage(undefined)
      })
      .catch(() => {
        setContents([])
        setMessage({
          text: 'No records found',
          severity: 'error',
          loading: false
        })
      })
  }

  async function handleSelection(index) {
    contents.forEach(user => {
      if (user.identifier === index) {
        setSelection(user)
        return
      }
    })
  }

  async function handleDelete() {
    setMessage({ text: 'Deleting User...', severity: 'info', loading: true })

    deleteUser(selection.identifier)
      .then(() => {
        setMessage({
          text: 'User sucessfully deleted',
          severity: 'success',
          loading: false
        })

        setContents(contents.filter(user => user.identifier !== selection.identifier))
      })
      .catch(() => {
        setMessage({
          text: 'Failed to delete user - Please try again later',
          severity: 'error',
          loading: false
        })
      })

    setSelection(undefined)
  }

  return (
    <Box>
      {showDeleteDialog && (
        <ConfirmationDialogue
          message={`Are you sure you want to delete staff member '${selection.first_name} ${selection.last_name}'?`}
          proceedResponse="Delete" denyResponse="Cancel"
          onClose={() => {
            setDeleteDialog(false)
          }}
          state={{ value: showDeleteDialog, handle: setDeleteDialog }}
          onProceed={handleDelete}
        />
      )}
      <BreadcrumbGenerator />

      <Typography variant="h4">Staff List</Typography>
      <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

      <Box display="flex" justifyContent="space-between" flexWrap={'reverse'}>
        <Searchbox label="Search Staff" onSubmit={handleSearch} />
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button
            variant={
              permissions.includes('staff.create') ? 'contained' : 'disabled'
            }
            onClick={() => navigate('create')}
          >
            Create New User
          </Button>
          <Divider orientation="vertical" />
          <Button
            variant={
              selection !== undefined && permissions.includes('staff.edit')
                ? 'outlined'
                : 'disabled'
            }
            onClick={() => navigate(selection.identifier)}
          >
            View Details
          </Button>
          <Button
            variant={
              selection !== undefined && permissions.includes('staff.delete')
                ? 'outlined'
                : 'disabled'
            }
            onClick={() => setDeleteDialog(true)}
          >
            Delete User
          </Button>
        </Box>
      </Box>

      <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

      {message && (
        <Grow in={true}>
          <Alert severity={message.severity} sx={{ marginBottom: '1rem' }}>
            {message.text}
          </Alert>
        </Grow>
      )}

      <DataGrid
        rows={contents}
        columns={Columns}
        onRowSelectionModelChange={model => handleSelection(model[0])}
        sx={{ height: '40vh' }}
        autoPageSize
      />
    </Box>
  )
}

export default Staff
