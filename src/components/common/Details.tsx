import React from "react";
import { Disclosure } from "@headlessui/react";
import { MdAdd } from "react-icons/md/index.js";
import { FaMinus } from "react-icons/fa6/index.js";

import { classNames } from "@lib/utils/classNames";

const Details = ({
  detail,
}: {
  detail: { title: string; items: string[] };
}) => {
  return (
    <Disclosure as="div" key={detail.title}>
      {({ open }) => (
        <>
          <h3>
            <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
              <span
                className={classNames(
                  open ? "text-primary" : "text-text",
                  "text-base font-medium",
                )}
              >
                {detail.title}
              </span>
              <span className="ml-6 flex items-center">
                {open ? (
                  <FaMinus
                    className="block h-6 w-6 text-primary group-hover:text-primary"
                    aria-hidden="true"
                  />
                ) : (
                  <MdAdd
                    className="block h-6 w-6 text-gray-400 group-hover:text-text"
                    aria-hidden="true"
                  />
                )}
              </span>
            </Disclosure.Button>
          </h3>
          <Disclosure.Panel
            as="div"
            className="prose prose-sm pb-6 text-text text-base"
          >
            <ul role="list">
              {detail.items.map((item: any) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Details;
