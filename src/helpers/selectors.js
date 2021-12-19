export function getAppointmentsForDay(state, day) {
  const daySelected = state.days.find(itm => itm.name === day);
  const appointments = daySelected ? daySelected.appointments : [];
  return appointments ? appointments.map(itm => state.appointments[itm]) : [];
};

export function getInterview(state, interview) {
  if (state.interviewers && interview) {
    const result = {
      "student": interview.student,
      "interviewer": state.interviewers[interview.interviewer]
    };
    return result;
  }
  return null;
};

export function getInterviewersForDay(state, day) {
  const daySelected = state.days.find(itm => itm.name === day);
  const interviewers = daySelected ? daySelected.interviewers : [];
  return interviewers ? interviewers.map(itm => state.interviewers[itm]) : [];
};