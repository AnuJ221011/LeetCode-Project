import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{text:'Hi, How are you?'}] },
        { role: 'user', parts: [{text: 'I am Good' }] },
    ]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messageEndRef = useRef(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

   const onSubmit = async (data) => {
    const newUserMessage = { role: 'user', parts: [{ text: data.message }] };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    reset();

    try {
        const response = await axiosClient.post('/ai/chat', { 
            messages: updatedMessages,
            title: problem?.title || "",
            description: problem?.description || "",
            testCases: problem?.visibleTestCases || [],
            startCode: problem?.startCode || "",
        });

        const aiMessage = {
            role: 'model',
            parts: [{ text: response.data.message }]
        };
        setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
        console.error("API Error:", error);
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Error from AI Chatbot' }] }]);
    }
};


    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <h1 className="text-2xl font-bold mb-4">Chat with AI</h1>
                {messages.map((msg, index) => (
                    <div key={index} className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}>
                        <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-accent'}`}>
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
                <div className="flex items-center">
                    <input
                        placeholder="Ask me anything..."
                        className="input input-bordered flex-1"
                        {...register("message", { required: true, minLength: 2 })}
                    />
                    <button type="submit" className="btn btn-ghost ml-2" disabled={errors.message}>
                        <Send  size={20}/>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChatAi