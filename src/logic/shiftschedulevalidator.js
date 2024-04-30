
import ShiftsScheduleAPI from "./shiftscheduleapi";
 
class ShiftScheduleValidator {
 
    static async scheduleIsClear(startTime, duration, itemId) {
        //get all items
        const scheduleItems = (await ShiftsScheduleAPI.getPatient()).success.rows;
 
        console.log("raw shifts");
        console.log(scheduleShifts);
 
        //filter by date
        const filteredScheduleShifts = scheduleShifts.filter((a) => {
            const proposedStartDate = new Date(startTime);
 
            const candidateDate = new Date(a.start_timestamp);
 
            console.log("candidate");
            console.log(proposedStartDate + " : " + candidateDate)
 
            return (proposedStartDate.getDate() === candidateDate.getDate())
            && (proposedStartDate.getMonth() === candidateDate.getMonth())
            && (proposedStartDate.getFullYear() === proposedStartDate.getFullYear());
        });
 
        console.log("shifts on the same day");
        console.log(filteredScheduleShifts);
 
        //filter by whether enters bounds for proposed item
 
        const itemsOverlapping = filteredScheduleShifts.filter((a) => {
            console.log("ids")
            console.log(shiftId + " : " + a.schedule_shift_id)
            if(shiftId === parseInt(a.schedule_shift_id)) {
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
 
        console.log(shiftOverlapping);
 
        return shiftsOverlapping.length === 0;
    }
 
}
 
export default ShiftScheduleValidator;