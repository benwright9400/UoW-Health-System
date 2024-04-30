import { get, del, post, put } from 'aws-amplify/api'

class HealthcarePlanStagesAPI {
  static getHealthcarePlanStages = async function (query) {
    const operation = get({
      apiName: 'HealthcarePlanStagesHandler',
      path: `/v1/resources/healthcareplan/stages`,
      options: {}
    })

    const response = await operation.response
    return (await response.body.json()).success
  }

  static upsertHealthcarePlan = async function (actionType, name, categoryId) {
    if (categoryId != null && actionType == 'INSERT') {
      const operation = post({
        apiName: 'HealthcarePlanStagesHandler',
        path: `/v1/resources/healthcareplan/stages`,
        options: {
          body: {
            ACTION_TYPE: actionType,
            CATEGORY_NAME: name
          }
        }
      })

      const response = await operation.response
      return (await response.body.json()).success
    }

    const operation = post({
      apiName: 'HealthcarePlanStagesHandler',
      path: `/v1/resources/healthcareplan/stages`,
      options: {
        body: {
          ACTION_TYPE: actionType,
          CATEGORY_NAME: name,
          HEALTHCAREPLAN_CATEGORY_ID: categoryId
        }
      }
    })

    const response = await operation.response
    return (await response.body.json()).success
  }

  static deleteHealthcarePlan = async function (categoryId) {
    const operation = del({
      apiName: 'HealthcarePlanStagesHandler',
      path: `/v1/resources/healthcareplan/stages`,
      options: {
        queryParams: {
          HEALTHCAREPLAN_STAGES_ID: categoryId
        }
      }
    })

    const response = await operation.response
    return await response.body.json()
  }
}

export default HealthcarePlanStagesAPI
