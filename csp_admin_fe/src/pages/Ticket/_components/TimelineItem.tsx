import { TicketIcon } from "lucide-react";

interface TimelineEvent {
  id: number;
  type: "MESSAGE" | "LOG";
  author?: { name: string; role: string }; // only for messages
  body?: string; // for messages
  details?: string; // for logs
  action?:string;
  createdAt: string;
}

const TimelineItem = ({ event }: { event: TimelineEvent }) => {
  console.log(event);
  

  if (event.type === "MESSAGE") {
    const isRequester = event.author?.role === "ADMIN";
    return (
      <div
        className={`flex mt-2 gap-2 w-[70%] ${
          isRequester ? "" : "ml-auto flex-row-reverse"
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-amber-600" />
        <div className="flex max-w-[100%] flex-1 flex-col">
          <div
            className={`flex items-center ${isRequester ? "" : "justify-end"}`}
          >
            <p className="text-xs text-gray-500 font-semibold">
              {event.author?.name}
            </p>
            <p className="text-xs text-gray-300 ml-1">
              · {new Date(event.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <p className="text-gray-400 text-xs ml-auto">{event.body}</p>
        </div>
      </div>
    );
  }

  if (event.type === "LOG") {
    return (
      <div className="flex items-center gap-2 mt-2">
        <div className={`${event.action === "CREATED" && "bg-cyan-700"} ${event.action === "UPDATED_STATUS" && "bg-yellow-700"} ${event.action === "UPDATED_PRIORITY" && "bg-gray-400"} ${event.action === "UPDATED_TYPE" && "bg-green-700"} ${event.action === "ASSIGNED" && "bg-purple-700"} w-6 h-6 flex items-center justify-center  rounded-full`}>
          <TicketIcon className="w-3 h-3 text-white" />
        </div>
        <p className="text-xs text-gray-600">
          {event.details}{" "}
          <span className="text-gray-400">
            · {new Date(event.createdAt).toLocaleTimeString()}
          </span>
        </p>
      </div>
    );
  }

  return null;
};

export default TimelineItem;
