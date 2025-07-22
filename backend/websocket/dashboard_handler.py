from fastapi import WebSocket, WebSocketDisconnect

connected_dashboards = set()

async def handle_dashboard_websocket(websocket: WebSocket):
    await websocket.accept()
    connected_dashboards.add(websocket)
    try:
        while True:
            await websocket.receive_text()  # Or ping/pong for keepalive
    except WebSocketDisconnect:
        connected_dashboards.remove(websocket)

# Optional broadcast helper
async def broadcast_to_dashboards(message: dict):
    disconnected = set()
    for ws in connected_dashboards:
        try:
            await ws.send_json(message)
        except WebSocketDisconnect:
            disconnected.add(ws)
    connected_dashboards.difference_update(disconnected)
