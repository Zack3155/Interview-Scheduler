import { useEffect, useReducer } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

// Custom hook for initializing all necessary states
export default function useApplicationData() {

  // Generate a new or update a exisiting appointment when a interview confirms booking
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`api/appointments/${id}`, { interview })
      .then(() => {
        let days = [...state.days];
        // if current interview is null, update spots 
        if (!state.appointments[id].interview) {
          days = updateSpots(true);
        }
        dispatch({ type: SET_INTERVIEW, appointments: appointments, days: days });
      });
  };

  // Delete a exisiting appointment when a interview confirms canceling
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`api/appointments/${id}`)
      .then(() => {
        let days = updateSpots(false);
        dispatch({ type: SET_INTERVIEW, appointments: appointments, days: days });
      });
  };

  // Update corresponding spots of that day when book or cancel an interview
  function updateSpots(bookOrCancel) {
    const reference = { 'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4 };
    const id = reference[state.day];
    const target = state.days[id];
    const count = Number(target.spots);

    const day = {
      ...target,
      spots: bookOrCancel ? (count - 1) : (count + 1)
    };
    const days = [...state.days];
    days[id] = day;
    return days;
  };

  // Retrive data from SQL database
  function syncData() {
    return Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      });
    });
  };

  //initializing all necessary states using reducer
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday", // show Monday content at begining by default
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:8001');
    // sync data cross windows
    webSocket.onmessage = (event) => {
      const type = JSON.parse(event.data).type;
      if (type === SET_INTERVIEW) {
        return syncData();
      }
    };

    syncData();
    return () => webSocket.close();
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
};