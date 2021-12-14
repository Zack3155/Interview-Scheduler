import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

// Format the props.spots
const formatSpots = (spots) => {
  if (spots === 0) {
    return 'no spots'
  }
  else if (spots === 1) {
    return '1 spot'
  }
  else {
    return `${spots} spots`;
  }
};

export default function DayListItem(props) {
  let dayClass = classNames(
    'day-list__item',
    {
      'day-list__item--selected': props.selected,
      'day-list__item--full': !props.spots
    });

  return (
    <li className={dayClass}
      onClick={() => props.setDay(props.name)}
      data-testid="day">
      <h2 className={dayClass}>{props.name}</h2>
      <h3 className={dayClass}>{formatSpots(props.spots)} remaining</h3>
    </li>
  );
}