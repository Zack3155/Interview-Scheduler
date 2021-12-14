import React from "react";

export default function Empty(props) {
  // let interviewerClass = classNames(
  //   'interviewers__item',
  //   {
  //     'interviewers__item--selected': props.selected
  //   });

  return (
    <main className="appointment__add">
      <img
        className="appointment__add-button"
        src="images/add.png"
        alt="Add"
        onClick={props.onAdd}
      />
    </main>
  );
}