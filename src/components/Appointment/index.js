import "./styles.scss";

import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import Confirm from "./Confirm";
import Status from "./Status";
import Error from "./Error";
import Form from "./Form";

import React, { useEffect } from "react";
import useVisualMode from "hooks/useVisualMode";


export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const EDIT = "EDIT";
  const CONFIRM = "CONFIRM";
  const STATUS_DELETE = "STATUS_DELETE";
  const STATUS_SAVE = "STATUS_SAVE";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    transition(STATUS_SAVE, true);
    props.bookInterview(props.id,
      {
        student: name,
        interviewer
      })
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true));
  };
  const onDelete = () => {
    transition(STATUS_DELETE, true)
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  };

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (!props.interview && mode === SHOW) {
      transition(EMPTY);
    }
  }, [transition, props.interview, mode]);


  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview &&
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      }
      {mode === CONFIRM &&
        <Confirm
          message='Delete the appointment?'
          onCancel={back}
          onConfirm={onDelete}
        />
      }
      {mode === STATUS_DELETE &&
        <Status message='Deleting' />
      }
      {mode === ERROR_DELETE &&
        <Error
          message='Something went wrong. Could not delete the appointment. Please try agian.'
          onClose={back}
        />
      }
      {mode === CREATE &&
        <Form interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      }
      {mode === EDIT &&
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      }
      {mode === STATUS_SAVE &&
        <Status message='Saving' />
      }
      {mode === ERROR_SAVE &&
        <Error
          message='Something went wrong. Could not save the appointment. Please try agian.'
          onClose={back}
        />
      }
    </article>
  );
}