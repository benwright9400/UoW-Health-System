import { Box } from '@mui/material'

import { useContext } from 'react'
import { Outlet, Route } from 'react-router-dom'

import IndexGenerator from '../../components/generator/IndexGenerator'
import { AuthenticationContext } from '../../App'

import { Cleaning, Premises, RoomCreationForm, CleaningOrderForm } from '.'
import Wards from './Wards'
import WardCreationForm from './page/WardCreationForm'
import Treatments from './Treatments'
import TreatmentCreationForm from './page/TreatmentCreationForm'
// import HealthcarePlanAPI from '../../logic/healthcareplanapi'
import HealthcarePlanForm from '../page/HealthcarePlanForm'
// import DrugsAPI from '../../logic/drugsapi'
import DrugsForm from './page/DrugsForm'
// import BookingSurgeryAPI from '../../logic/bookingsurgeryapi'
// import BookingForm from './page/BookingSurgeryForm'
// import AssignStaffAPI from '../../logic/assignstaffapi'
import AssignStaffForm from './page/AssignStaffForm'

const Links = () => {
  const permissions = useContext(AuthenticationContext).permissions
  const pages = {}

  if (permissions.includes('premises.view')) {
    pages['Premises Management'] = {
      description: 'Create, view, update and delete physical spaces.',
      site: 'premises'
    }
  }

  if (permissions.includes('cleaning.view')) {
    pages['Cleaning Orders'] = {
      description: 'Issue, view, fulfil and cancel hospital cleaning orders.',
      site: 'cleaning'
    }
  }

  if (permissions.includes('wards.view')) {
    pages['Ward Management'] = {
      description: 'Create, view, update and delete wards.',
      site: 'wards'
    }
  }

  if (permissions.includes('ward.admin')) {
    pages['Ward Admin'] = {
      description: 'Manage ward notes, orders and staff assignment for a shift',
      site: 'ward-admin'
    }
  }

  if (permissions.includes('treatments.view')) {
    pages['Treatments'] = {
      description:
        'Create, view, update and delete treatment services provided by the hopsital.',
      site: 'treatments'
    }
  }

  if (permissions.includes('healthcareplans.view')) {
    pages['Healthcare Plans'] = {
      description: 'Create, view, update and delete healthcare Plan services provided by the hopsital.',
      site: 'healthcare plans'
    }
  }

  if (permissions.includes('drugs.view')) {
    pages['Drugs'] = {
      description: 'Create, view, update and delete drug services provided by the hopsital.',
      site: 'drugs'
    }
  }

  if (permissions.includes('bookings.view')) {
    pages['Bookings'] = {
      description: 'Create, view, update and delete booking services provided by the hopsital.',
      site: 'bookings'
    }
  }

  if (permissions.includes('assignstaff.view')) {
    pages['Assign Staff'] = {
      description: 'Create, view, update and delete staff assignment services provided by the hopsital.',
      site: 'staff assignment'
    }
  }

  return <IndexGenerator title="Asset Management" contents={pages} />
}

const Template = () => {
  return (
    <Box style={{ padding: '1rem' }}>
      <Outlet />
    </Box>
  )
}

const AssetRoutes = permissions => {
  return (
    <Route path="assets" element={<Template />}>
      <Route index path="*" element={<Links />} />

      {permissions.includes('cleaning.view') ? (
        <Route path="cleaning">
          <Route index element={<Cleaning />} />
          <Route path="create" element={<CleaningOrderForm />} />
        </Route>
      ) : null}

      {permissions.includes('premises.view') ? (
        <Route path="premises">
          <Route index element={<Premises />} />
          <Route path="create" element={<RoomCreationForm />} />
        </Route>
      ) : null}

      {permissions.includes('wards.view') ? (
        <Route path="wards">
          <Route index element={<Wards />} />
          <Route path="create" element={<WardCreationForm />} />
        </Route>
      ) : null}

      {permissions.includes('treatments.view') ? (
        <Route path="treatments">
          <Route index element={<Treatments />} />
          <Route path="create" element={<TreatmentCreationForm />} />
        </Route>
      ) : null}
      

      {permissions.includes('healthcareplans.view') ? (
        <Route path="healthcareplans">
          <Route index element={<HealthcarePlans />} />
          <Route path="create" element={<HealthcarePlanForm />} />
        </Route>
      ) : null}


{permissions.includes('drugs.view') ? (
        <Route path="drugs">
          <Route index element={<Drugs />} />
          <Route path="create" element={<DrugsForm />} />
        </Route>
      ) : null}


{permissions.includes('bookingsurgeries.view') ? (
        <Route path="bookingsurgeries">
          <Route index element={<BookingSurgeries />} />
          <Route path="create" element={<BookingSurgeriesForm />} />
        </Route>
      ) : null}

{permissions.includes('assignstaffs.view') ? (
        <Route path="assignstaffs">
          <Route index element={<AssignStaff />} />
          <Route path="create" element={<AssignStaffForm />} />
        </Route>
      ) : null}

      {permissions.includes('treatment.categories.view') ? (
        <Route path="treatment-categories">
          <Route index element={<TreatmentCategories />} />
          <Route path="create" element={<TreatmentCategoriesCreationForm />} />
        </Route>
      ) : null}

      {permissions.includes('ward.admin') ? (
        <Route path="ward-admin">
          <Route index element={<WardAdmin />} />
        </Route>
      ) : null}
    </Route>
  )
}

export { AssetRoutes }
