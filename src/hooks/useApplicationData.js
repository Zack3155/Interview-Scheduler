import { useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {

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

  function updateSpots(bookNew) {
    const reference = { 'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4 };
    const id = reference[state.day];
    const target = state.days[id];
    const count = Number(target.spots);

    const day = {
      ...target,
      spots: bookNew ? (count - 1) : (count + 1)
    };
    const days = [...state.days];
    days[id] = day;
    return days;
  };

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


  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day };
      case SET_APPLICATION_DATA:
        const { days, appointments, interviewers } = action;
        return { ...state, days, appointments, interviewers };
      case SET_INTERVIEW: {
        const { appointments, days } = action;
        return { ...state, appointments, days }
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onmessage = (event) => {
      const type = JSON.parse(event.data).type;
      if (type === SET_INTERVIEW) {
        return syncData();
      }
    };

    syncData();
    return () => webSocket.close();
  }, []);

  //console.log(state.days);
  return { state, setDay, bookInterview, cancelInterview };
};