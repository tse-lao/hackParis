"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";
import { useState } from "react";

function Chat({
  client,
  messageHistory,
  conversation,
  filterWord,
}: {
  client: any;
  messageHistory: any;
  conversation: any;
  filterWord?:string;
}) {
  const [inputValue, setInputValue] = useState("");

  // Function to handle sending a message
  const handleSend = async () => {
    if (inputValue) {
      await onSendMessage(inputValue);
      setInputValue("");
    }
  };

  // Function to handle sending a text message
  const onSendMessage = async (value: any) => {
    return conversation.send(value);
  };

  // MessageList component to render the list of messages
  const MessageList = ({ messages }: { messages: any }) => {
    // Filter messages by unique id
    messages = messages.filter(
      (v:any, i:any, a:any) => a.findIndex((t:any) => t.id === v.id) === i
    );

    return (
      <ul className="flex flex-col gap-2">
        {messages.map((message: any) => (
          <li
            key={message.id}
            title="Click to log this message to the console"
            className={`flex flex-col ${
              message.senderAddress === client.address
                ? "items-end"
                : "items-start"
            }`}
          >
            <strong className="mb-1">
              {message.senderAddress === client.address ? "You" : "Bot"}
            </strong>
            <span className="rounded-md bg-indigo-100 px-2 py-1">
              {message.content}
            </span>
            <div>
              <span className="date text-gray-300 text-sm italic">
                {" "}
                {message.sent.toLocaleTimeString()}
              </span>
              <span
                className="ml-4 cursor-pointer"
                onClick={() => console.log(message)}
              >
                👀
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  // Function to handle input change (keypress or change event)
  const handleInputChange = (event: any) => {
    if (event.key === "Enter") {
      handleSend();
    } else {
      setInputValue(event.target.value);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <MessageList messages={messageHistory} />
      </CardContent>
      <CardFooter className="flex gap-8">
        <Input
          type="text"
          onKeyPress={handleInputChange}
          onChange={handleInputChange}
          value={inputValue}
          placeholder="Type your text here "
        />
        <Button onClick={handleSend}>
            <SendIcon />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Chat;
