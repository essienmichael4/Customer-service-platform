import useAxiosToken from "@/hooks/useAxiosToken";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface PriorityDropdownProps {
    id: number,
    defaultValue?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
}

const PriorityDropdown = ({ id, defaultValue = "NORMAL" }: PriorityDropdownProps) => {
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState(defaultValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const priorities = [
        { label: "LOW", color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
        { label: "NORMAL", color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" },
        { label: "HIGH", color: "text-red-600 bg-red-100 dark:bg-red-900/30" },
        { label: "URGENT", color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
    ];
  
    // ✅ Mutation: update ticket type
    const updateTicketPriority = async (ticketPriority: "LOW" | "NORMAL" | "HIGH" | "URGENT") => {
        const response = await axios_instance_token.patch(`/tickets/${id}/priority`, {
            priority: ticketPriority,
        });
        return response.data;
    };
  
    const { mutate } = useMutation({
        mutationFn: updateTicketPriority,
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (priority: "LOW" | "NORMAL" | "HIGH" | "URGENT") => {
        setSelectedPriority(priority);
        mutate(priority);
    };

    return (
        <div className="relative inline-flex" ref={dropdownRef}>
        {/* Trigger */}
        <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="py-1 ps-1 pe-3 inline-flex items-center gap-x-2 
            text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 
            shadow-sm hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 
            disabled:opacity-50 disabled:pointer-events-none 
            dark:bg-neutral-900 dark:border-neutral-700 dark:text-white 
            dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            aria-haspopup="menu"
            aria-expanded={isOpen}
        >
            <span
            className={`px-2 py-1 rounded-md text-xs font-medium ${
                priorities.find((p) => p.label === selectedPriority)?.color
            }`}
            >
            {selectedPriority}
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
        {isOpen && (
            <div
            className="absolute z-10 mt-2 min-w-40 bg-white 
                shadow-md rounded-lg dark:bg-neutral-800 
                dark:border dark:border-neutral-700"
            role="menu"
            >
            <div className="p-1 space-y-0.5">
                {priorities.map((priority) => (
                <button
                    key={priority.label}
                    onClick={() => handleSelect(priority.label as "LOW" | "NORMAL" | "HIGH" | "URGENT")}
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm 
                    text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100
                    dark:text-neutral-400 dark:hover:bg-neutral-700 
                    dark:hover:text-neutral-300 dark:focus:bg-neutral-700 w-full text-left"
                >
                    <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${priority.color}`}
                    >
                    {priority.label}
                    </span>
                </button>
                ))}
            </div>
            </div>
        )}
        </div>
    );
};

export default PriorityDropdown;
