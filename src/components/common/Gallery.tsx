import React from "react";
import { Tab } from "@headlessui/react";

import { classNames } from "@lib/utils/classNames";

const Gallery = ({
  images,
  name,
  alt,
  description,
}: {
  images: string[];
  name: string;
  alt: string;
  description: string;
}) => {
  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      {/* Image selector */}
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {images.map((image: string, index) => (
            <Tab
              key={index}
              className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
            >
              {({ selected }) => (
                <>
                  <span className="sr-only">{name}</span>
                  <span className="absolute inset-0 overflow-hidden rounded-md">
                    <img
                      src={image}
                      alt={alt}
                      width={96}
                      height={130}
                      className="h-full w-full object-cover object-center"
                    />
                  </span>
                  <span
                    className={classNames(
                      selected ? "ring-primary" : "ring-transparent",
                      "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2",
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
      </div>

      <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
        {images.map((image: string, index) => (
          <Tab.Panel key={index}>
            <img
              src={image}
              alt={description}
              width={672}
              height={672}
              className="h-full w-full object-cover object-center sm:rounded-lg"
            />
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Gallery;
