
import {
    Typography,
    Box,
    Divider,
    TextField,
    Button,
    Stack,
    Autocomplete,
    Fab,
    Grow,
    Alert,
    Icon
  } from '@mui/material'
   
  import SaveIcon from '@mui/icons-material/Save'
   
  import { useState, useEffect } from 'react'
  import { useLocation, useNavigate } from 'react-router-dom'
   
  import { BreadcrumbGenerator, Spinbox } from '../../../components'
  import { getBuildings, createPremises } from '../logic/Premises'
  import { MaterialIconPicker } from 'react-material-icon-picker'
  import Accordion from '@mui/material/Accordion'
  import AccordionDetails from '@mui/material/AccordionDetails'
  import AccordionSummary from '@mui/material/AccordionSummary'
  import { ArrowDropDown } from '@mui/icons-material'
  import AssignStaffAPI from '../../logic/assignstaffapi'
  
   
  //TODO1: switch all references to old model to your current model
  const AssignStaffForm = props => {
    const [message, setMessage] = useState({})
    const [errors, setErrors] = useState({})
   
    const [form, setForm] = useState({
      floor: 0
    })
   
    const navigate = useNavigate()
    const location = useLocation()
   
    console.log('props')
    console.log(location.state)
   
    let action = 'CREATE'
    if (
      location.state &&
      location.state.action &&
      location.state.action === 'UPDATE'
    ) {
      action = 'UPDATE'
    }
   
    useEffect(() => {
      let props = location.state;
      if (props && props.action && props.action === 'UPDATE') {
        //update here
        setForm({
          staff: location.state.staff_name,
          specialisation: location.state.specialisation,
          description: location.state.description,
          icon: location.state.icon_data,
          id: location.state.staff_id
        })
      }
      handleValidation()
    }, [])
   
    useEffect(() => {
      handleValidation()
    }, [form])
   
    async function handleValidation() {
      setMessage(undefined)
      const errors = {}
   
      //ensure validation matches model
      if (!(form.id && form.id.trim())) {
        setMessage({
          severity: 'error',
          text: 'A staff ID is required, please enter a staff ID'
        })
        errors.building = true
      }
   
      if (!(form.staff && form.staff.trim())) {
        setMessage({
          severity: 'error',
          text: 'A staff name is required - Please enter a staff name'
        })
        errors.staff = true
      }
   
      setErrors(errors)
   
      // False indicates that the form was not validated
      return !Boolean(errors)
    }
   
    async function handleSubmit() {
      if (!handleValidation) {
        return
      }
   
      if(action === 'UPDATE') {
   
        setMessage({ text: 'Updating staff...', severity: 'info' })
   
        //ensure correct API is used
        AssignStaffAPI.upsertstaff(
          'UPDATE',
          form.staff,
          form.specialisation,
          form.description,
          form.icon,
          form.id
        )
          .then((res) => {
            setMessage({ text: 'staff sucessfully created', severity: 'success' })
   
            console.log(res);
   
            setTimeout(() => setMessage(undefined), 7000)
          })
          .catch((res) => {
            setMessage({
              text: 'Failed to create staff - Please try again later',
              severity: 'error'
            })
   
            console.log(res);
   
            setTimeout(() => setMessage(undefined), 7000)
          })
   
      }
   
      setMessage({ text: 'Creating staff...', severity: 'info' })
   
      AssignStaffAPI.upsertstaff(
        'INSERT',
        form.staff,
        form.specialisation,
        form.description,
        form.icon,
        form.id
      )
        .then(() => {
          setMessage({ text: 'staff sucessfully created', severity: 'success' })
   
          setTimeout(() => setMessage(undefined), 7000)
        })
        .catch(() => {
          setMessage({
            text: 'Failed to create staff - Please try again later',
            severity: 'error'
          })
   
          setTimeout(() => setMessage(undefined), 7000)
        })
    }
   
    console.log(form)
   
    return (
      <Box>
        <BreadcrumbGenerator />
   
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4">
            {action === 'UPDATE' ? 'Update' : 'Create'} a staff
          </Typography>
          <Button onClick={() => navigate(-1)}>Return</Button>
        </Box>
        <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />
   
        {message && (
          <Grow in={true}>
            <Alert severity={message.severity} sx={{ marginBottom: '1.5rem' }}>
              {message.text}
            </Alert>
          </Grow>
        )}
   
        <Stack spacing={2}>
          <TextField
            label="Enter a unique 4 digit staff ID (e.g. ORTH)"
            onChange={event => {
              setForm({ ...form, id: event.target.value })
            }}
            onBlur={event => {
              setForm({ ...form, id: event.target.value })
            }}
            value={form.id}
            defaultValue={form.id}
            error={errors.ward}
          />
          <TextField
            label="Enter a staff Name"
            onChange={event => {
              setForm({ ...form, staff: event.target.value })
            }}
            onBlur={event => {
              setForm({ ...form, staff: event.target.value })
            }}
            value={form.staff}
            defaultValue={form.staff}
            error={errors.staff}
          />
          <TextField
            label="Enter a staff Specialisation"
            onChange={event => {
              setForm({ ...form, specialisation: event.target.value })
            }}
            onBlur={event => {
              setForm({ ...form, specialisation: event.target.value })
            }}
            value={form.specialisation}
            defaultValue={form.specialisation}
            error={errors.staff}
          />
          <TextField
            multiline
            rows={4}
            label="Description"
            onChange={event =>
              setForm({ ...form, description: event.target.value.trim() })
            }
            defaultValue={form.description}
          />
          <div>
            <Typography>Selected Icon: </Typography>
            <div
              style={{ padding: '1rem', translateY: '1rem', display: 'inline' }}
            >
              <Icon>{form.icon}</Icon>
            </div>
          </div>
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDropDown />}>
              <Typography>Select an Icon (optional)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MaterialIconPicker
                onIconClick={event => {
                  setForm({ ...form, icon: event })
                }}
              />
            </AccordionDetails>
          </Accordion>
        </Stack>
   
        <Box sx={{ position: 'fixed', bottom: '4.5rem', right: '4.5rem' }}>
          <Fab
            color="primary"
            sx={{ position: 'absolute' }}
            disabled={Boolean(message)}
            onClick={() => handleSubmit()}
          >
            <SaveIcon />
          </Fab>
        </Box>
      </Box>
    )
  }
   
  export default AssignStaffForm
   