import { useEffect, useState } from "react";
import { useMutation, useQuery, Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { Auth } from "./components/Auth";

export default function App() {
  return (
    <>
      <AuthLoading>
        <div>Loading...</div>
      </AuthLoading>
      <Unauthenticated>
        <Auth />
      </Unauthenticated>
      <Authenticated>
        <Chat />
      </Authenticated>
    </>
  );
}

function Chat() {
  const messages = useQuery(api.chat.getMessages);
  const currentUser = useQuery(api.chat.getCurrentUser);
  const sendMessage = useMutation(api.chat.sendMessage);
  const { signOut } = useAuthActions();

  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    // Make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [messages]);

  const currentUserEmail = currentUser?.email || "";

  return (
    <main className="chat">
      <header>
        <h1>Convex Chat</h1>
        <p>
          Connected as <strong>{currentUserEmail}</strong>
        </p>
        <button onClick={() => void signOut()}>Sign Out</button>
      </header>
      {messages?.map((message) => (
        <article
          key={message._id}
          className={message.user === currentUserEmail ? "message-mine" : ""}
        >
          <div>{message.user}</div>
          <p>{message.body}</p>
        </article>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage({ body: newMessageText });
          setNewMessageText("");
        }}
      >
        <input
          value={newMessageText}
          onChange={async (e) => {
            const text = e.target.value;
            setNewMessageText(text);
          }}
          placeholder="Write a message…"
          autoFocus
        />
        <button type="submit" disabled={!newMessageText}>
          Send
        </button>
      </form>
    </main>
  );
}
