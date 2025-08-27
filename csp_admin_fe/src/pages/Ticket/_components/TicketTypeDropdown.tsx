import useAxiosToken from "@/hooks/useAxiosToken";
import type { TicketType } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

// interface TicketType {
//   id: number;
//   name: string;
//   description?: string;
// }

interface TicketTypeDropdownProps {
  id: number;
  defaultValue?: string; // default type by id
}

const TicketTypeDropdown = ({ id, defaultValue }: TicketTypeDropdownProps) => {
  const axios_instance_token = useAxiosToken();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<TicketType | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch ticket types
  const { data: ticketTypes = [], isLoading } = useQuery<TicketType[]>({
    queryKey: ["tickets", "types"],
    queryFn: async () => {
      const res = await axios_instance_token.get("/tickets/types");
      return res.data;
    },
  });

  // ✅ Mutation: update ticket type
  const updateTicketType = async (ticketTypeId: number) => {
    const response = await axios_instance_token.patch(`/tickets/${id}/type`, {
      typeId: ticketTypeId,
    });
    return response.data;
  };

  const { mutate } = useMutation({
    mutationFn: updateTicketType,
    onSuccess: () => {
      toast.success("Ticket type updated successfully", { id: "edit-type" });
      queryClient.invalidateQueries({ queryKey: ["tickets", id] });
      setIsOpen(false);
    },
    onError: (err: any) => {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message, { id: "edit-type" });
      } else {
        toast.error("Something went wrong", { id: "edit-type" });
      }
    },
  });

  // ✅ Set default value when data is loaded
  useEffect(() => {
    if (ticketTypes.length && defaultValue) {
      const defaultType = ticketTypes.find((t) => t.name === defaultValue);
      if (defaultType) {
        setSelectedType(defaultType);
      }
    }
  }, [ticketTypes, defaultValue]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (type: TicketType) => {
    setSelectedType(type);
    setIsOpen(false);
    toast.loading("Updating ticket type...", { id: "edit-type" });
    mutate(type.id);
  };

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="py-2 ps-1 pe-3 inline-flex items-center gap-x-2 
          text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 
          shadow-sm hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 
          disabled:opacity-50 disabled:pointer-events-none 
          dark:bg-neutral-900 dark:border-neutral-700 dark:text-white 
          dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        disabled={isLoading}
      >
        <span className="truncate max-w-[120px]">
          {selectedType ? selectedType.name : isLoading ? "Loading..." : "Select Ticket Type"}
        </span>

        <svg
          className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Menu */}
      {isOpen && ticketTypes.length > 0 && (
        <div
          className="absolute z-10 mt-2 min-w-48 bg-white 
            shadow-md rounded-lg dark:bg-neutral-800 
            dark:border dark:border-neutral-700"
          role="menu"
        >
          <div className="p-1 space-y-0.5">
            {ticketTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSelect(type)}
                className="flex flex-col items-start gap-x-3.5 py-2 px-3 rounded-lg text-sm 
                  text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100
                  dark:text-neutral-400 dark:hover:bg-neutral-700 
                  dark:hover:text-neutral-300 dark:focus:bg-neutral-700 w-full text-left"
              >
                <span className="font-medium">{type.name}</span>
                {/* {type.description && (
                  <span className="text-xs text-gray-500 dark:text-neutral-500">
                    {type.description}
                  </span>
                )} */}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketTypeDropdown;
