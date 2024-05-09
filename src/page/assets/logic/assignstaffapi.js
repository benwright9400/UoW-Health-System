import { get, del, post, put } from 'aws-amplify/api'

class AssignStaffAPI {
    static getStaffAssignments = async function (patientId) {
        try {
          const operation = get({
            apiName: 'AssignStaffHandler',
            path: `/v1/resources/assignments/staff`,
            options: {
              queryParams: { PATIENT_ID: patientId }
            }
          });
    
          const response = await operation.response;
          let body = await response.body.json();
    
          console.log(body);
    
          return body;
        } catch (error) {
          return error;
        }
      }
    
      static assignStaffToPatient = async function (
        staffId,
        patientId,
        assignmentDetails,
        shiftStarts,
        id,
      ) {
        try {
          const operation = post({
            apiName: 'StaffAssignmentHandler',
            path: `/v1/resources/assignments/staff`,
            options: {
              body: {
                STAFF_ID: staffId,
                PATIENT_ID: patientId,
                DETAILS: assignmentDetails,
                SHIFT_STARTS: shiftStarts,
              }
            }
          });
    
          const response = await operation.response;
          let body = await response.body.json();
    
          console.log(body);
    
          return body.success;
        } catch (error) {
          console.error("Error in assigning staff:", error);
          return null;
        }
      }
    
      static unassignStaff = async function (assignmentId) {
        try {
          const operation = del({
            apiName: 'StaffAssignmentHandler',
            path: `/v1/resources/assignments/staff`,
            options: {
              queryParams: { ASSIGNMENT_ID: assignmentId }
            }
          });
    
          const response = await operation.response;
          return await response.body.json();
        } catch ( error ) {
          console.error("Error in unassigning staff:", error);
          return null;
        }
      }
    }
    
    

export default AssignStaffAPI;