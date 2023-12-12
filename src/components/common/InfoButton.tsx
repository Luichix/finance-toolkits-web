import React from "react";
import Popover from "./Popover";
import { MdInfo } from "react-icons/md/index.js";

const InfoButton = ({
  children,
  zIndex = 50,
  absolute,
}: {
  absolute?: boolean;
  children: React.ReactNode;
  zIndex: number;
}) => {
  return (
    <div
      className={`${absolute && "absolute"} top-0 right-0`}
      style={{ zIndex: zIndex }}
    >
      <Popover preferredPosition="bottom-left">
        <Popover.Trigger>
          <button type="button" tabIndex={-1}>
            <MdInfo size={18} color="#9ce" />
          </button>
        </Popover.Trigger>
        <Popover.Content>
          <div className="flex p-2 mr-10 sm:mr-0 border max-w-sm text-text font-semibold gap-2 border-primary rounded-md">
            <p>{children}</p>
          </div>
        </Popover.Content>
      </Popover>
    </div>
  );
};

export default InfoButton;
