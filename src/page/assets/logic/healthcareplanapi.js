import { get, del, post, put } from 'aws-amplify/api'


class HealthcarePlanAPI {
  static getPatient = async function () {
    try {

      const operation = get({
        apiName: 'HealthcarePlanHandler',
        path: `/v1/resources/healthcareplan`,
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

  static upsertHealthcarePlan = async function (
    actionType,
    title,
    name,
    birthDate,
    patientDiagnosis,
    startTimestamp,
    startDate,
    patientId,
    healthcarePlan,
    id
  ) {

    if (id != null && actionType == 'UPDATE') {
      const operation = post({
        apiName: 'HealthcarePlanHandler',
        path: `/v1/resources/healthcareplan`,
        options: {
          body: {
            ACTION_TYPE: actionType,
            ID: id,
            TITLE: title,
            NAME: name,
            BIRTH_DATE: birthDate,
            PATIENT_DIAGNOSIS: patientDiagnosis,
            START_TIMESTAMP: startTimestamp,
            START_DATE: startDate,
            PATIENT_ID: patientId,
            HEALTHCARE_PLAN: healthcarePlan
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
      apiName: 'HealthcarePlanHandler',
      path: `/v1/resources/healthcareplan`,
      options: {
        body: {
            ACTION_TYPE: actionType,
            TITLE: title,
            NAME: name,
            BIRTH_DATE: birthDate,
            PATIENT_DIAGNOSIS: patientDiagnosis,
            START_TIMESTAMP: startTimestamp,
            START_DATE: startDate,
            PATIENT_ID: patientId,
            HEALTHCARE_PLAN: healthcarePlan
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

  static delete = async function (healthcarePlanId) {  
    
    const operation = del({
      apiName: 'HealthcarePlanHandler',
      path: `/v1/resources/healthcareplan`,
      options: {
        queryParams: {
          HEALTHCARE_PLAN_ID: parseInt(healthcarePlanId)
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

export default HealthcarePlanAPI
