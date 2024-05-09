import { get, del, post, put } from 'aws-amplify/api'

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
    bookingId,
  ) {

    if (bookingId != null && actionType == 'UPDATE') {
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
            BOOKING_TYPE: bookingType,
            BOOKING_SURGERY_ID: bookingId,
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
          START_TIMESTAMP: startTimestamp,
          ESTIMATED_DURATION_MINUTES: estimatedDuration,
          PATIENT_ID: patientId,
          SURGERY: surgery,
          DESCRIPTION: description,
          ITEM_TYPE: bookingType,
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
