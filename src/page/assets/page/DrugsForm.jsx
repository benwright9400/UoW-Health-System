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
  
  import { useState, useEffect, cloneElement } from 'react'
  import { useLocation, useNavigate } from 'react-router-dom'
  
  import { BreadcrumbGenerator, Spinbox } from '../../../components'
  import { getBuildings, createPremises } from '../logic/Premises'
  import { MaterialIconPicker } from 'react-material-icon-picker'
  import Accordion from '@mui/material/Accordion'
  import AccordionDetails from '@mui/material/AccordionDetails'
  import AccordionSummary from '@mui/material/AccordionSummary'
  import { ArrowDropDown } from '@mui/icons-material'
  import DrugsAPI from '../logic/drugsapi'
  import DrugsCategoriesAPI from '../logic/drugscategoriesapi'

  
  const DrugsForm = props => {
    const [message, setMessage] = useState({})
    const [errors, setErrors] = useState({})
    const [drugCategories, setDrugCategories] = useState([])
    const [drugs, setDrugs] = useState([])
    const [drugSelectionError, setDrugSelectionError] = useState(true)
    const [drugCategorySelectionError, setDrugCategorySelectionError] =
      useState(true)
  
    const [form, setForm] = useState({})
  
    const navigate = useNavigate()
    const location = useLocation()
  
    let action = 'CREATE'
    if (
      location.state &&
      location.state.action &&
      location.state.action === 'UPDATE'
    ) {
      action = 'UPDATE'
    }
  
    console.log(location.state)
  
    useEffect(() => {
      let props = location.state
      if (props && props.action && props.action === 'UPDATE') {
        setForm({
          ...location.state,
          drug_name: location.state.name,
          drug_category_id: location.state.category_id
        })
      }
      handleValidation()
    }, [])
  
    useEffect(() => {
      DrugsCategoriesAPI.getDrug({}).then(res =>
        setDrugCategories(res.rows)
      )
  
      DrugsAPI.getDrug({}).then(res => {
        setDrugs(res.rows)
      })
  
      handleValidation()
    }, [form])
  
    async function handleValidation() {
      setMessage(undefined)
      const errors = {}
  
     
      if (!(form.drug_name && form.drug_name.trim())) {
        setMessage({
          severity: 'error',
          text: 'A drug name is required - Please enter a drug name'
        })
        errors.drug_name = true
      }
  
      if (!form.drug_category_id) {
        setMessage({
          severity: 'error',
          text: 'A drug category name is required - Please select a drug category name'
        })
        errors.drug_category = true
      }
  
      if (!form.drug_id) {
        setMessage({
          severity: 'error',
          text: 'A drug is required - Please select a drug'
        })
        errors.drug_id = true
      }
  
      setErrors(errors)
  
      // False indicates that the form was not validated
      return !Boolean(errors)
    }
  
    async function handleSubmit() {
      console.log('form')
      console.log(form)
  
      if (!handleValidation) {
        return
      }
  
      if (action === 'UPDATE') {
        setMessage({ text: 'Updating drug...', severity: 'info' })
  
        DrugsAPI.upsertDrug(
          'UPDATE',
          form.drug_name,
          form.drug_category_id,
          form.drug_id,
          form.id
        ).then(res => {
            setMessage({ text: 'drug sucessfully created', severity: 'success' })
  
            console.log("output")
            console.log(res)
  
            setTimeout(() => setMessage(undefined), 7000)
          })
          .catch(res => {
            setMessage({
              text: 'Failed to create drug - Please try again later',
              severity: 'error'
            })
  
            console.log(res)
  
            setTimeout(() => setMessage(undefined), 7000)
          })
  
        return
      }
  
      setMessage({ text: 'Creating drug...', severity: 'info' })
  
      console.log(form)
  
      DrugsAPI.upsertDrug(
        'INSERT',
        form.drug_name,
        form.drug_category_id,
        form.drug_id,
        null
      )
        .then(res => {
          console.log(res)
  
          setMessage({ text: 'drug  sucessfully created', severity: 'success' })
  
          setTimeout(() => setMessage(undefined), 7000)
        })
        .catch(err => {
          setMessage({
            text: 'Failed to create drug - Please try again later',
            severity: 'error'
          })
          console.log(err)
  
          setTimeout(() => setMessage(undefined), 7000)
        })
    }
  
    const renderDrugName = params => {
      return (
        <TextField
          {...params}
          label="Enter a drug name"
          onChange={(event, newVal) => {
            // console.log(event.target.value)
            // console.log(newVal)
            if (event.target.value) {
              setForm({ ...form, drug_id: parseInt(newVal.id) })
            }
          }}
          InputProps={{ ...params.InputProps, type: 'search' }}
          error={errors.ward_id}
        />
      )
    }
  
    const renderDrugCategorySearch = params => {
      return (
        <TextField
          {...params}
          label="Enter a drug category name"
          onChange={(event, newVal) => {
            // console.log(event.target)
            if (newVal) {
              setForm({ ...form, drug_category_id: parseInt(newVal.id) })
            }
          }}
          InputProps={{ ...params.InputProps, type: 'search' }}
          error={errors.drug_category}
        />
      )
    }
  
    const getDrugValue = () => {
      //TODO: Convert code to match drug data structure
      if (!form.ward_id) {
        return null
      }
  
      let filteredDrugs = drugs.filter(drug => drug.drug_id === form.drug_id)
  
      if (filteredDrugs.length === 0) {
        return null
      }
  
      return { label: filteredDrugs[0].drug_name, id: filteredDrugs[0].drug_id }
    }
  
    const getDrugCategoryValue = () => {
      if (!form.drug_category_id) {
        return null
      }
  
      let filteredCategories = drugCategories.filter(
        drugCategory =>
          drugCategory.drug_id === form.drug_category_id
      )
  
      if (filteredCategories.length === 0) {
        return null
      }
  
      return {
        label: filteredCategories[0].category_name,
        id: filteredCategories[0].drug_id
      }
    }
  
    return (
      <Box>
        <BreadcrumbGenerator />
  
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4">
            {action === 'UPDATE' ? 'Update' : 'Create'} a ward
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
            label="Enter a drug Name"
            onChange={event => {
              setForm({ ...form, drug_name: event.target.value })
            }}
            onBlur={event => {
              setForm({ ...form, drug_name: event.target.value })
            }}
            value={form.drug_name}
            error={errors.drug_name}
          />
          <Autocomplete
        
            disablePortal
            disableClearable
            label="Drug name..."
            renderInput={renderDrugName}
            getOptionLabel={option => option.label}
            onChange={(e, newVal) => {
              // console.log(newVal)
              setForm({ ...form, drug_id: newVal.id })
            }}
            options={
              drugs
                ? drugs.map(drug => {
                    // console.log(drug)
                    return { label: drug.drug_name, id: drug.drug_id }
                  })
                : []
            }
            value={getDrugValue()}
          />
          <Autocomplete
            disablePortal
            disableClearable
            label="drug category name..."
            renderInput={renderDrugCategorySearch}
            getOptionLabel={option => option.label}
            onChange={(e, newVal) => {
              // console.log(newVal)
              setForm({ ...form, drug_category_id: parseInt(newVal.id) })
            }}
            options={
              drugCategories
                ? drugCategories.map((drugCategory, index) => {
                    return {
                      label: drugCategory.category_name,
                      id: drugCategory.treatment_id
                    }
                  })
                : []
            }
            value={getDrugCategoryValue()}
          />
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
  
  export default DrugsForm
  