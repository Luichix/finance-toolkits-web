import React, {
  type FC,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface DropdownProps {
  label: string;
  routes: Record<string, string>[];
  children: ReactNode;
}

const Dropdown = ({ label, routes, children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Select plan from dropdown

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <li className="relative" ref={listRef} onClick={toggleDropdown}>
      <div className="flex gap-2 items-center sm:text-base md:text-base">
        {children}
        <span className="cursor-pointer">{label}</span>
      </div>
      <div className={`dropdown ${isOpen ? "visible" : "invisible"}`}>
        <ul className={"menu"}>
          {routes.map((route, index) => (
            <li key={index}>
              {route.type === "link" ? (
                <a
                  href={route.ref}
                  className="flex gap-2 items-center sm:text-base md:text-base"
                >
                  {route.route}
                </a>
              ) : (
                <button id={route.id} type="button">
                  {route.route}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default Dropdown;
