import React from "react";

export default function Header(props) {
  // let interviewerClass = classNames(
  //   'interviewers__item',
  //   {
  //     'interviewers__item--selected': props.selected
  //   });

  return (
    <header className="appointment__time">
      <h4 className="text--semi-bold">{props.time}</h4>
      <hr className="appointment__separator" />
    </header>
  );
}