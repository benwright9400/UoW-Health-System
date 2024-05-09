import { get, del, post, put } from 'aws-amplify/api'
import AssignStaffAPI from '../../src/logic/AssignStaffAPI'


class AssignStaffValidator {

    static async staffassignmentIsClear(startTime, duration, itemId) {
        //get all items
        const assignstaffs = (await AssignStaffAPI.getStaff()).success.rows;

        console.log("staff assingment");
        console.log(AssignStaffAPI);

        //filter by date
        const filteredAssignStaffs = assignStaffs.filter((a) => {
            const proposedStartDate = new Date(startTime);

            const candidateDate = new Date(a.start_timestamp);

            console.log("candidate");
            console.log(proposedStartDate + " : " + candidateDate)

            return (proposedStartDate.getDate() === candidateDate.getDate())
            && (proposedStartDate.getMonth() === candidateDate.getMonth())
            && (proposedStartDate.getFullYear() === proposedStartDate.getFullYear());
        });

        console.log("staffs assigned on the same day");
        console.log(filteredAssignStaffs);

        //filter by whether enters bounds for proposed staffs

        const AssingmentsOverlapping = filteredAssignStaffs.filter((a) => {
            console.log("ids")
            console.log(assignmentId + " : " + a.assign_staff_id)
            if(assignmentId === parseInt(a.assign_staff_id)) {
                return false;
            }

            const proposedStartTime = new Date(startTime);

            const proposedEndTime = new Date(proposedStartTime.getTime() + (duration * 15 * 60000))

            const candidateStartTime = new Date(a.start_timestamp);
            const candidateEndTime = new Date(candidateStartTime.getTime() + (a.estimated_duration_minutes * 15 * 60000));

            // start is in range
            const startInRange = (candidateStartTime.getTime() <= proposedStartTime.getTime()) && (candidateEndTime.getTime() >= proposedStartTime.getTime())
            
            // end is in range
            const endInRange = (candidateEndTime.getTime() <= proposedEndTime.getTime()) && (candidateEndTime.getTime() >= proposedStartTime.getTime())

            // start is before and end is after range
            const goesThrough = (candidateStartTime.getTime() < proposedStartTime.getTime()) && (candidateEndTime.getTime() > proposedEndTime.getTime()) 


            return startInRange || endInRange || goesThrough;
        });

        console.log(assignmentsOverlapping);

        return assignmentsOverlapping.length === 0;
    }

}

export default AssignStaffValidator;