from fastapi import WebSocket, WebSocketDisconnect
import asyncio

connected_clients = set()

async def send_json_safe(websocket: WebSocket, message: dict):
    """Send a JSON message with error handling."""
    try:
        await websocket.send_json(message)
    except WebSocketDisconnect:
        connected_clients.discard(websocket)

async def broadcast_telemetry(message: dict):
    """Send a message to all connected clients."""
    await asyncio.gather(*(send_json_safe(ws, message) for ws in connected_clients))
