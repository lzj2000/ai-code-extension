import { useCallback } from 'react'

interface UseSendMessageParams {
  sessionId: string
  setIsLoading: (loading: boolean) => void
  addUserMessage: (content: string) => void
  addAssistantMessage: () => { id: string }
  updateMessageContent: (id: string, content: string) => void
  finishStreaming: (id: string) => void
  addErrorMessage: () => void
  updateSessionName: (name: string) => void
}

/**
 * 消息发送 Hook
 */
export function useSendMessage({
  sessionId,
  setIsLoading,
  addUserMessage,
  addAssistantMessage,
  updateMessageContent,
  finishStreaming,
  addErrorMessage,
  updateSessionName,
}: UseSendMessageParams) {
  // 模拟流式响应
  const simulateStreamingResponse = async (userMessage: string) => {
    const responses = [
      '这是一个很好的问题。让我来为你详细解答...',
      '根据我的理解，我们可以从以下几个方面来看待这个问题：\n\n1. 首先，需要考虑的是基础架构\n2. 其次，要关注性能优化\n3. 最后，不要忘记用户体验',
      '当然，我很乐意帮助你！基于你的问题，我建议你可以尝试以下几种方法来解决这个问题...',
    ]

    const responseText = responses[Math.floor(Math.random() * responses.length)]

    // 更新会话名称(如果是第一条消息，这里简单模拟一下，实际可能需要判断)
    updateSessionName(userMessage.slice(0, 10))

    const assistantMessage = addAssistantMessage()

    // 模拟逐字输出
    for (let i = 0; i <= responseText.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20))
      updateMessageContent(assistantMessage.id, responseText.slice(i - 1, i))
    }

    finishStreaming(assistantMessage.id)
  }

  const sendMessage = useCallback(async (input: string) => {
    addUserMessage(input)
    setIsLoading(true)

    try {
      // 这里先使用模拟数据，如果后续有真实后端，可以加一个开关切换
      // 真实 API 调用代码保留在注释中供参考
      /*
      const response = await fetch('/api/chat', { ... })
      ...
      */

      await simulateStreamingResponse(input)
    }
    catch (error) {
      console.error('发送消息时出错:', error)
      addErrorMessage()
    }
    finally {
      setIsLoading(false)
    }
  }, [
    sessionId,
    setIsLoading,
    addUserMessage,
    addAssistantMessage,
    updateMessageContent,
    finishStreaming,
    addErrorMessage,
    updateSessionName,
  ])

  return { sendMessage }
}
