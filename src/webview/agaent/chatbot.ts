import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
  MemorySaver,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const devCheckpointer = new MemorySaver();

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL_NAME,
  temperature: 0.7,
  streaming: true, // 启用流式响应
});

async function chatbotNode(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("chatbot", chatbotNode)
  .addEdge(START, "chatbot")
  .addEdge("chatbot", END);

// 异步初始化检查点保存器和应用
let app: ReturnType<typeof workflow.compile>;

async function initializeApp() {
  if (!app) {
    app = workflow.compile({ checkpointer: devCheckpointer });
  }

  return app;
}

const getApp = async () => {
  return await initializeApp();
};

async function* streamWorkflowResponse(input: string) {
  const graph = await getApp();
  const messages = [new HumanMessage(input)];
  // 使用可流式的接口
  // 优先尝试对可运行图进行流式迭代
  const iterable = (graph as any).stream
    ? await (graph as any).stream({ messages })
    : await model.stream(messages);

  for await (const chunk of iterable as any) {
    // chunk 可能是 AIMessageChunk 或包含 messages 的对象
    let text = "";
    if (chunk && chunk.messages) {
      const msg = Array.isArray(chunk.messages)
        ? chunk.messages[0]
        : chunk.messages;
      if (msg && Array.isArray(msg.content)) {
        text = msg.content
          .map((c: any) => (typeof c === "string" ? c : c?.text || ""))
          .join("");
      } else {
        text = msg?.content || "";
      }
    } else if (chunk && Array.isArray(chunk.content)) {
      text = chunk.content
        .map((c: any) => (typeof c === "string" ? c : c?.text || ""))
        .join("");
    } else if (chunk && typeof chunk.content === "string") {
      text = chunk.content;
    }

    if (text) {
      yield text;
    }
  }
}

export { getApp, streamWorkflowResponse };
