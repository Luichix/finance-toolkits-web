import type { InputForm } from "@lib/utils/useInputs";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa/index.js";

export const Collapsed = ({
  label,
  children,
  dependency,
}: {
  label: string;
  children: React.ReactNode;
  dependency?: InputForm[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handlerFilterOpening = () => {
    setIsOpen((previus) => !previus);
  };

  const MEASURE_MIN_DEFAULT = 40;
  const MEASURE_MAX_DEFAULT = 40;
  const [height, setHeight] = useState(MEASURE_MIN_DEFAULT);

  const refCollapse = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const measure = refCollapse.current?.getBoundingClientRect().height;
    setHeight(measure ? measure + MEASURE_MAX_DEFAULT : MEASURE_MIN_DEFAULT);
  }, [dependency]);

  return (
    <fieldset
      className="flex flex-col w-full gap-6"
      style={{
        height: !isOpen ? MEASURE_MIN_DEFAULT : height,
        overflow: !isOpen ? "hidden" : "visible",
        transition: "height 0.2s ease-in-out",
      }}
    >
      <legend
        className="py-4 flex flex-row gap-2 items-center cursor-pointer font-bold"
        onClick={handlerFilterOpening}
      >
        {label}
        <button type="button" className="outline-none">
          {!isOpen ? <FaChevronRight /> : <FaChevronDown />}
        </button>
      </legend>
      <div
        className="flex flex-col w-full gap-4 pb-8"
        style={{
          visibility: !isOpen ? "hidden" : "visible",
          transition: "visibility 0.1s ease-in-out 0.1s",
        }}
        ref={refCollapse}
      >
        {children}
      </div>
    </fieldset>
  );
};

export default Collapsed;
