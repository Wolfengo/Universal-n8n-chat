import { get, post } from '@n8n/chat/api/generic';
import type {
	ChatOptions,
	LoadPreviousSessionResponse,
	SendMessageResponse,
} from '@n8n/chat/types';

export async function loadPreviousSession(sessionId: string, options: ChatOptions) {
	const actualSessionId = localStorage.getItem('actualSessionId') ?? sessionId;
	if (actualSessionId === null) {
		localStorage.setItem('actualSessionId', sessionId);
	}
	
    var iframe = document.getElementById('myIframe') as HTMLIFrameElement;
	console.log('Вход в передачу actualSessionId');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('hello there', '*');
		console.log('actualSessionId:', actualSessionId);
		console.log('sessionId:', sessionId);
    } else {
        console.log('Элемент iframe не найден или не загружен');
    }

	const method = options.webhookConfig?.method === 'POST' ? post : get;
	return await method<LoadPreviousSessionResponse>(
		`${options.webhookUrl}`,
		{
			action: 'loadPreviousSession',
			[options.chatSessionKey as string]: actualSessionId,
			...(options.metadata ? { metadata: options.metadata } : {}),
		},
		{
			headers: options.webhookConfig?.headers,
		},
	);
}

export async function sendMessage(message: string, sessionId: string, options: ChatOptions) {
	const actualSessionId = localStorage.getItem('actualSessionId') ?? sessionId;

	const method = options.webhookConfig?.method === 'POST' ? post : get;
	return await method<SendMessageResponse>(
		`${options.webhookUrl}`,
		{
			action: 'sendMessage',
			[options.chatSessionKey as string]: actualSessionId,
			[options.chatInputKey as string]: message,
			...(options.metadata ? { metadata: options.metadata } : {}),
		},
		{
			headers: options.webhookConfig?.headers,
		},
	);
}
