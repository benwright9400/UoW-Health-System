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
  import BookingSurgeryAPI from '../../../logic/bookingsurgeryapi'
  
  const BookingSurgeryForm = props => {
    const [message, setMessage] = useState({})
    const [errors, setErrors] = useState({})
    const [bookingCategories, setBookingCategories] = useState([])
    const [bookings, setBookings] = useState([])
    const [bookingSelectionError, setBookingSelectionError] = useState(true)
    const [bookingCategorySelectionError, setBookingCategorySelectionError] =
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
          booking_name: location.state.name,
          booking_category_id: location.state.category_id
        })
      }
      handleValidation()
    }, [])
  
    useEffect(() => {
      BookingSurgeryAPI.getBooking({}).then(res =>
        setBookingCategories(res.rows)
      )
  
      BookingSurgeryAPI.getBooking({}).then(res => {
        setBookings(res.rows)
      })
  
      handleValidation()
    }, [form])
  
    async function handleValidation() {
      setMessage(undefined)
      const errors = {}
  
     
      if (!(form.booking_name && form.booking_name.trim())) {
        setMessage({
          severity: 'error',
          text: 'A booking name is required - Please enter a booking name'
        })
        errors.booking_name = true
      }
  
      if (!form.booking_category_id) {
        setMessage({
          severity: 'error',
          text: 'A booking category name is required - Please select a booking category name'
        })
        errors.booking_category = true
      }
  
      if (!form.booking_id) {
        setMessage({
          severity: 'error',
          text: 'A booking is required - Please select a booking'
        })
        errors.booking_id = true
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
        setMessage({ text: 'Updating booking.', severity: 'info' })
  
        DrugsAPI.upsertDrug(
          'UPDATE',
          form.booking_name,
          form.booking_category_id,
          form.booking_id,
          form.id
        ).then(res => {
            setMessage({ text: 'booking sucessfully created', severity: 'success' })
  
            console.log("output")
            console.log(res)
  
            setTimeout(() => setMessage(undefined), 7000)
          })
          .catch(res => {
            setMessage({
              text: 'Failed to create booking - Please try again later',
              severity: 'error'
            })
  
            console.log(res)
  
            setTimeout(() => setMessage(undefined), 7000)
          })
  
        return
      }
  
      setMessage({ text: 'Creating booking.', severity: 'info' })
  
      console.log(form)
  
      DrugsAPI.upsertBooking(
        'INSERT',
        form.booking_name,
        form.booking_category_id,
        form.booking_id,
        null
      )
        .then(res => {
          console.log(res)
  
          setMessage({ text: 'booking sucessfully created', severity: 'success' })
  
          setTimeout(() => setMessage(undefined), 7000)
        })
        .catch(err => {
          setMessage({
            text: 'Failed to create booking - Please try again later',
            severity: 'error'
          })
          console.log(err)
  
          setTimeout(() => setMessage(undefined), 7000)
        })
    }
  
    const renderBookingName = params => {
      return (
        <TextField
          {...params}
          label="Enter a booking name"
          onChange={(event, newVal) => {
            // console.log(event.target.value)
            // console.log(newVal)
            if (event.target.value) {
              setForm({ ...form, booking_id: parseInt(newVal.id) })
            }
          }}
          InputProps={{ ...params.InputProps, type: 'search' }}
          error={errors.booking_id}
        />
      )
    }
  
    const renderBookingCategorySearch = params => {
      return (
        <TextField
          {...params}
          label="Enter a booking category name"
          onChange={(event, newVal) => {
            // console.log(event.target)
            if (newVal) {
              setForm({ ...form, booking_category_id: parseInt(newVal.id) })
            }
          }}
          InputProps={{ ...params.InputProps, type: 'search' }}
          error={errors.booking_category}
        />
      )
    }
  
    const getBookingValue = () => {
      if (!form.ward_id) {
        return null
      }
  
      let filteredDrugs = bookings.filter(booking => booking.booking_id === form.booking_id)
  
      if (filteredBookings.length === 0) {
        return null
      }
  
      return { label: filteredBookings[0].booking_name, id: filteredBookings[0].booking_id }
    }
  
    const getBookingCategoryValue = () => {
      if (!form.booking_category_id) {
        return null
      }
  
      let filteredCategories = bookingCategories.filter(
        bookingCategory =>
          bookingCategory.booking_id === form.booking_category_id
      )
  
      if (filteredCategories.length === 0) {
        return null
      }
  
      return {
        label: filteredCategories[0].category_name,
        id: filteredCategories[0].booking_id
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
            label="Enter a booking Name"
            onChange={event => {
              setForm({ ...form, booking_name: event.target.value })
            }}
            onBlur={event => {
              setForm({ ...form, booking_name: event.target.value })
            }}
            value={form.booking_name}
            error={errors.booking_name}
          />
          <Autocomplete
        
            disablePortal
            disableClearable
            label="Booking name..."
            renderInput={renderBookingName}
            getOptionLabel={option => option.label}
            onChange={(e, newVal) => {
              // console.log(newVal)
              setForm({ ...form, booking_id: newVal.id })
            }}
            options={
              drugs
                ? booking.map(booking => {
                    // console.log(booking)
                    return { label: booking.booking_name, id: booking.booking_id }
                  })
                : []
            }
            value={getBookingValue()}
          />
          <Autocomplete
            disablePortal
            disableClearable
            label="booking category name..."
            renderInput={renderBookingCategorySearch}
            getOptionLabel={option => option.label}
            onChange={(e, newVal) => {
              // console.log(newVal)
              setForm({ ...form, booking_category_id: parseInt(newVal.id) })
            }}
            options={
              bookingCategories
                ? bookingCategories.map((bookingCategory, index) => {
                    return {
                      label: bookingCategory.category_name,
                      id: bookingCategory.treatment_id
                    }
                  })
                : []
            }
            value={getBookingCategoryValue()}
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
  
  export default BookingForm
  