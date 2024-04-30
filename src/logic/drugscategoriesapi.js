import { get, del, post, put } from 'aws-amplify/api'

class DrugsCategoriesAPI {
  static getDrug = async function (query) {
    const operation = get({
      apiName: 'DrugCategoryHandler',
      path: `/v1/resources/drugs/category`,
      options: {}
    })

    const response = await operation.response
    return (await response.body.json()).success
  }

  static upsertDrug = async function (actionType, name, categoryId) {
    if (categoryId != null && actionType == 'INSERT') {
      const operation = post({
        apiName: 'DrugCategoryHandler',
        path: `/v1/resources/drugs/category`,
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
      apiName: 'DrugCategoryHandler',
      path: `/v1/resources/drugs/category`,
      options: {
        body: {
          ACTION_TYPE: actionType,
          CATEGORY_NAME: name,
          DRUG_CATEGORY_ID: categoryId
        }
      }
    })

    const response = await operation.response
    return (await response.body.json()).success
  }

  static deleteDrug = async function (categoryId) {
    const operation = del({
      apiName: 'DrugCategoryHandler',
      path: `/v1/resources/drugs/category`,
      options: {
        queryParams: {
          DRUGS_CATEGORY_ID: categoryId
        }
      }
    })

    const response = await operation.response
    return await response.body.json()
  }
}

export default DrugsCategoriesAPI
