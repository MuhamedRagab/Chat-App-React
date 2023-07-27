import { useParams, useSearchParams } from "react-router-dom";
import { useState, useRef, useCallback, useEffect } from "react";
import { Socket, connect } from "socket.io-client";

const socket: Socket = connect("http://localhost:3000");

type message = {
  id: string;
  name: string;
  from: string;
  to: string;
  content: string;
};

export default function Room() {
  const { id: roomId } = useParams() as { id: string };
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") as string;
  const [messages, setMessages] = useState<message[]>([]);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = useCallback(() => {
    const messageContent = messageInputRef.current?.value;
    if (messageContent) {
      const message = {
        id: new Date().toISOString(),
        name,
        content: messageContent,
        sentAt: new Date().toISOString(),
        from: socket.id,
        to: roomId,
      };

      setMessages([...messages, message]);
      messageInputRef.current.value = "";

      socket.emit("message", message);
    }

    messageInputRef.current?.focus();
  }, [messages, name, roomId]);

  useEffect(() => {
    socket.emit("joinRoom", { name, roomId, from: socket.id });
  }, [name, roomId]);

  useEffect(() => {
    socket.on("userJoined", (message: message) => {
      console.log("joinRoom", message);

      setMessages([...messages, message]);
    });

    socket.on("messages", (message: message) => {
      setMessages([...messages, message]);
    });

    socket.on("userLeft", (message: message) => {
      console.log("userLeft", message);

      setMessages([...messages, message]);
    });

    window.addEventListener("close", () => {
      socket.emit("leaveRoom", { name, roomId, from: socket.id });
    }
    );

    return () => {
      window.removeEventListener("close", () => {
        socket.emit("leaveRoom", { name, roomId, from: socket.id });
      });
    }

  }, [messages, name, roomId]);

  return (
    <main className="container mx-auto max-w-md p-4 h-screen">
      <h1 className="text-xl font-bold mb-4">Live Chat</h1>

      <div className="border border-gray-300 p-4 mb-4 h-3/4 overflow-auto">
        <ul className="space-y-2">
          {messages.map(({ id, content, from, name }) => (
            <li
              key={id}
              className={`p-2 rounded text-white
                w-2/3
              ${from === socket.id ? "bg-green-600" : "bg-blue-500 ml-auto"}`}
            >
              <p className="text-sm">{content}</p>
              <h2
                className="font-bold text-xs text-right
              "
              >
                sent by: {name}
              </h2>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex space-x-2">
        <input
          ref={messageInputRef}
          autoFocus
          type="text"
          placeholder="Type a message..."
          className="flex-grow border border-gray-300 p-2 rounded"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </main>
  );
}
