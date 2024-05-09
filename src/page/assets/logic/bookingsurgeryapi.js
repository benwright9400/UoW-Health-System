import { get, del, post, put } from 'aws-amplify/api'
import { fetchAuthSession } from 'aws-amplify/auth'
import { getCurrentUser, currentSession } from 'aws-amplify/auth';


class BookingSurgeryAPI {
  static getPatient = async function () {
    try {

      const operation = get({
        apiName: 'BookingSurgeryHandler',
        path: `/v1/resources/booking/surgery`,
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

  static upsertBooking = async function (
    actionType,
    startTimestamp,
    estimatedDuration,
    patientId,
    surgery,
    description,
    bookingType,
  ) {

    if (bookingId != null && actionType == 'INSERT') {
      const operation = post({
        apiName: 'BookingSurgeryHandler',
        path: `/v1/resources/booking/surgery`,
        options: {
          body: {
            ACTION_TYPE: actionType,
            START_TIMESTAMP: startTimestamp,
            ESTIMATED_DURATION_MINUTES: estimatedDuration,
            PATIENT_ID: patientId,
            SURGERY: surgery,
            DESCRIPTION: description,
            Booking_TYPE: bookingType,
        
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
      apiName: 'BookingSurgeryHandler',
      path: `/v1/resources/booking/surgery`,
      options: {
        body: {
          ACTION_TYPE: actionType,
          BOOKING_SURGERY_ID: bookingSurgeryId,
          START_TIMESTAMP: startTimestamp,
          ESTIMATED_DURATION_MINUTES: estimatedDuration,
          PATIENT_ID: patientId,
          SURGERY: surgery,
          DESCRIPTION: description,
          ITEM_TYPE: itemType,
          Booking_Surgery: bookingSurgeryId,
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

  static delete = async function (bookingSurgeryId) {  
    
    const operation = del({
      apiName: 'BookingSurgeryHandler',
      path: `/v1/resources/booking/surgery`,
      options: {
        queryParams: {
          BOOKING_SURGERY_ID: parseInt(bookingSurgeryId)
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

export default BookingSurgeryAPI
