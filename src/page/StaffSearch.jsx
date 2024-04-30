import { Autocomplete, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import PatientAPI from '../../apis/PatientAPI'
import AssignStaffAPI from '../../logic/assignstaffapi'
import { TextField } from '@mui/material'

function StaffSearch(props) {
  const [staffs, setStaffs] = useState([])
  const [selectedStaff, setSelectedStaff] = useState(props.overWriteValue)

  useEffect(() => {
    AssignStaffAPI.getStaff()
      .then(res => {
        console.log(res.success.rows)
        setStaffs(res.success.rows)
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  function setSelectedStaffInForm(StaffId) {
    setSelectedStaff(staffId);
    props.setStaff(staffId);
  }

  const renderStaffName = params => {
    return (
      <TextField
        {...params}
        value={getStaffValue()}
        placeholder="Enter a staff name"
        onChange={(event, newVal) => {
          // console.log(event.target.value)
          console.log(newVal.id)
          if (event.target.value) {
            setSelectedStaffInForm(parseInt(newVal.id))
          }
        }}
        InputProps={{ ...params.InputProps, type: 'search' }}
        // error={errors.ward_id}
      />
    )
  }

  const getStaffValue = () => {
    // console.log(selectedStaff);
    if (props.overWriteValue == 0) {
      // console.log('selected staff is default')
      return null
    }

    let filteredStaffs = staffs.filter(
      staff => {
        // console.log(props.overWriteValue);
        // console.log(staff)
        return parseInt(staff.staff_id) == props.overWriteValue
      }
    )

    // console.log(filteredStaffs);

    if (filteredPatients.length < 1) {
      // console.log('filteredStaffs is empty')
      return null
    }

    // console.log('displaying staff in textfield')

    return {
      label:
        filteredStaffs[0].first_name +
        ' ' +
        filteredStaffs[0].last_name +
        ' : ' +
        filteredStaffs[0].nhs_number,
      id: filteredStaffs[0].staff_id
    }
  }

  return (
    <Autocomplete
      disablePortal
      label="Staff name..."
      renderInput={renderStaffName}
      getOptionLabel={option => option.label}
      onChange={(e, newVal) => {
        console.log(newVal.id)
        setSelectedStaffInForm(parseInt(newVal.id))
      }}
      options={
        patients
          ? staffs.map(staff => {
              // console.log(staff)
              return {
                label:
                  staff.first_name +
                  ' ' +
                  staff.last_name +
                  ' : ' +
                  staff.nhs_number,
                id: staff.staff_id
              }
            })
          : []
      }
      value={getStaffValue()}
    />
  )
}

export default StaffSearch
