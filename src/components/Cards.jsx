import React from "react";
import MotionCard from "./MotionCard";

const Cards = ({ course, onOpen }) => {
  return <MotionCard course={course} onOpen={onOpen} />;
};

export default Cards;
