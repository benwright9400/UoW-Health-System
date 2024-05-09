import { get, del, post, put } from 'aws-amplify/api'

class DrugsCategoriesAPI {
  static drugBrands = ["Brand A", "Brand B", "Brand C"];
  static drugTypes = ["Analgesic", "Antibiotic", "Antihistamine"];
  static isForAdult = true;
  static isForChild = false;

  static getDrug = async function (query) {
    const operation = get({
      apiName: 'DrugCategoryHandler',
      path: `/v1/resources/drugs/category`,
      options: {}
    })

    const response = await operation.response
    return (await response.body.json()).success
  }

  static upsertDrug = async function (actionType, name, categoryId, drugname, strength, dosage, amountdaily, id) {
    if (categoryId != null && actionType == 'UPDATE') {
      const operation = post({
        apiName: 'DrugCategoryHandler',
        path: `/v1/resources/drugs/category`,
        options: {
          body: {
            ACTION_TYPE: actionType,
            CATEGORY_NAME: name,
            ID: id,
            DRUGNAME: drugname,
            STRENTGH: strength,
            DOSAGE: dosage,
            AMOUNTDAILY: amountdaily,
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
          DRUGNAME: drugname,
          STRENTGH: strength,
          DOSAGE: dosage,
          AMOUNTDAILY: amountdaily,
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
