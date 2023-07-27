import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const joinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const [name, roomId] = [formData.get("name"), formData.get("roomId")] as [
      string,
      string
    ];
    if (name && roomId) {
      navigate(`/rooms/${roomId}?name=${name}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="capitalize text-2xl font-bold">Welcome to shadow chat</h2>
      <form className="flex flex-col space-y-2 gap-4" onSubmit={joinRoom}>
        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            name="name"
            type="text"
            id="name"
            className="border border-gray-300 rounded-md p-1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="roomId">Room ID</label>
          <input
            name="roomId"
            type="text"
            id="roomId"
            className="border border-gray-300 rounded-md p-1"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white rounded-md p-1">
          Join
        </button>
      </form>
    </main>
  );
}
