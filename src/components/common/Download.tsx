import React from "react";
import { MdOutlineFileDownload } from "react-icons/md/index.js";

const Download = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button className="btn-download" type="button" onClick={onClick}>
      Download Excel
      <span>
        <MdOutlineFileDownload />
      </span>
    </button>
  );
};

export default Download;
