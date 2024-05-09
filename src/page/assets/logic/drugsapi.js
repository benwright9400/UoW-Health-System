import { get, del, post, put } from 'aws-amplify/api'

class DrugsAPI {
  static getDrug = async function () {
    try {
      const operation = get({
        apiName: 'DrugHandler',
        path: `/v1/resources/drugs`
      })

      const response = await operation.response
      let body = await response.body.json()

      console.log(body)

      return body
    } catch (error) {
      return error
    }
  }

  static upsert = async function (
    actionType,
    dName,
    dType,
    dStrength,
    dDosage,
    dBrand,
    pDate,
    cDuration,
    id
  ) {
    if (id != null && actionType == 'UPDATE') {
      const operation = post({
        apiName: 'DrugHandler',
        path: `/v1/resources/drugs`,
        options: {
          body: {
            DRUG_NAME: dName,
            DRUG_TYPE: dType,
            DRUG_STRENGTH: dStrength,
            DRUG_DOSAGE: dDosage,
            DRUG_BRAND: dBrand,
            PRESCRIPTION_DATE: pDate, 
            COURSE_DURATION: cDuration, 
          }
        }
      })

      const response = await operation.response
      let body = await response.body.json()

      console.log(body)

      return body.success
    }

    const operation = post({
      apiName: 'DrugHandler',
      path: `v1/resources/drugs`,
      options: {
        body: {
            DRUG_NAME: dName,
            DRUG_TYPE: dType,
            DRUG_STRENGTH: dStrength,
            DRUG_DOSAGE: dDosage,
            DRUG_BRAND: dBrand,
            PRESCRIPTION_DATE: pDate, 
            COURSE_DURATION: cDuration, 
             
        }
      }
    })

    const response = await operation.response
    let body = await response.body.json()

    console.log(body)

    return body.success
  }

  static deleteDrug = async function (drugId) {
    const operation = del({
      apiName: 'DrugHandler',
      path: `/v1/resources/drugs`,
      options: {
        queryParams: {
          DRUG_ID: drugId
        }
      }
    })

    const response = await operation.response
    return await response.body.json()
  }
}

export default DrugsAPI
