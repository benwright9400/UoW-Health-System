import { get, del, post, put } from 'aws-amplify/api'
import { fetchAuthSession } from 'aws-amplify/auth'
import { getCurrentUser, currentSession } from 'aws-amplify/auth';
// import {Signer} from 'aws-amplify';



class ShiftScheduleAPI {
  static getStaff = async function () {
    try {

      const operation = get({
        apiName: 'ShiftSHandler',
        path: `/v1/resources/shifts`,
        // options: { headers: {Authorization: token}}
      })

      //uses cookies to get specific user Id

      const response = await operation.response
      let body = await response.body.json()

      console.log(body)

      return body
    } catch (error) {
      console.log(error);
      return error
    }
  }

  static upsertShifts = async function (
    actionType,
    wardId,
    staffId,
    startId,
    startTimestamp,
    shiftId,
  
  ) {

    if (wardId != null && actionType == 'INSERT') {
      const operation = post({
        apiName: 'ShiftsHandler',
        path: `/v1/resources/shifts`,
        options: {
          body: {
            ACTION_TYPE: actionType,
            WARD_ID,
            STAFF_ID,
            START_TIMESTAMP: startTimestamp,
            END_TIMESTAMP: startTimestamp
          },
          // headers: {Authorization: `Bearer ${token}`}
        }
      })

      const response = await operation.response

      console.log(response);

      let body = await response.body.json()

      console.log(body)

      return body.success
    }

    const operation = post({
      apiName: 'ShiftsHandler',
      path: `/v1/resources/shifts`,
      options: {
        body: {
          ACTION_TYPE: actionType,
          SHIFT_ID: shiftId,
          WARD_ID: wardId,
          STAFF_ID: staffId,
          START_TIMESTAMP: startTimestamp,
          END_TIMESTAMP: startTimestamp,
          
        },
        // headers: {Authorization: `Bearer ${token}`}
      }
    })

    const response = await operation.response

    console.log(response);

    let body = await response.body.json()

    console.log(body)

    return body.success
  }

  static delete = async function (shiftId) {  
    
    const operation = del({
      apiName: 'ShiftHandler',
      path: `/v1/resources/shifts`,
      options: {
        queryParams: {
          SHIFT_ID: parseInt(shiftId)
        },
        // headers: {Authorization: `Bearer ${token}`}
      }
    })

    const response = await operation.response
    const body = await response.body.json();
    console.log(body);

    return body;
  }
}

export default ShiftsScheduleAPI
