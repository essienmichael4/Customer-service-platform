import useAxiosToken from "@/hooks/useAxiosToken";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export const TicketStatus = {
  NEW: "NEW",
  OPEN: "OPEN",
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
} as const;

export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];

interface TicketStatusDropdownProps {
  id: number;
  defaultStatus?: TicketStatus;
}

const TicketStatusDropdown: React.FC<TicketStatusDropdownProps> = ({
  id,
  defaultStatus = TicketStatus.NEW,
}) => {
  const axios_instance_token = useAxiosToken();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<TicketStatus>(defaultStatus);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statuses = Object.values(TicketStatus).filter(
    (s) => s !== TicketStatus.NEW || status === TicketStatus.NEW
  );

  const editTicketStatus = async (data: string) => {
    const response = await axios_instance_token.patch(`/tickets/${id}/status`, {
      status: data,
    });
    return response.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: editTicketStatus,
    onSuccess: (_, newStatus) => {
      setStatus(newStatus as TicketStatus);
      toast.success("Ticket status updated successfully", { id: "edit-status" });
      queryClient.invalidateQueries({ queryKey: ["tickets", id] });
      setOpen(false);
    },
    onError: (err: any) => {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message, { id: "edit-status" });
      } else {
        toast.error(`Something went wrong`, { id: "edit-status" });
      }
    },
  });

  const handleStatusChange = (newStatus: TicketStatus) => {
    toast.loading("Updating ticket status...", { id: "edit-status" });
    mutate(newStatus);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative inline-flex">
      {/* Main Button */}
      <button
        type="button"
        onClick={() => handleStatusChange(status)}
        disabled={isPending}
        className="relative py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold 
          rounded-s-md border border-gray-200 bg-white text-gray-800 hover:bg-gray-50
          dark:bg-neutral-900 dark:border-neutral-700 dark:text-white disabled:opacity-50"
      >
        {isPending ? (
          <svg
            className="animate-spin h-4 w-4 text-gray-600 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : (
          <>Submit as {status}</>
        )}
      </button>

      {/* Toggle Dropdown */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative -ms-px py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold 
          rounded-e-md border border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200
          dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
      >
        <svg
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-10 dark:bg-neutral-800 dark:border dark:border-neutral-700">
          <div className="p-1 space-y-0.5">
            {statuses.map((s) => (
              <button
                key={s}
                type="button"
                disabled={s === status || isPending}
                onClick={() => handleStatusChange(s)}
                className="w-full text-left flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm 
                  text-gray-800 hover:bg-gray-100
                  disabled:opacity-50 disabled:pointer-events-none
                  dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
              >
                {isPending ? (
                  <svg
                    className="animate-spin h-4 w-4 text-gray-600 dark:text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  <>Submit as {s}</>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketStatusDropdown;
