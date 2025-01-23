from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import logging
import json
from starlette.websockets import WebSocketState

router = APIRouter()
logger = logging.getLogger(__name__)

# Store active connections
class ConnectionManager:
    def __init__(self):
        # Store connections by organization_id
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, organization_id: str):
        try:
            await websocket.accept()
            if organization_id not in self.active_connections:
                self.active_connections[organization_id] = []
            self.active_connections[organization_id].append(websocket)
            logger.info(f"New connection for organization {organization_id}")
        except Exception as e:
            logger.error(f"Error connecting websocket: {e}")
            raise

    def disconnect(self, websocket: WebSocket, organization_id: str):
        try:
            if organization_id in self.active_connections:
                self.active_connections[organization_id].remove(websocket)
                logger.info(f"Connection removed for organization {organization_id}")
        except Exception as e:
            logger.error(f"Error disconnecting websocket: {e}")

    async def broadcast_to_organization(self, organization_id: str, message: dict):
        if organization_id not in self.active_connections:
            return
        
        disconnected = []
        for connection in self.active_connections[organization_id]:
            try:
                if connection.client_state == WebSocketState.CONNECTED:
                    await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting message: {e}")
                disconnected.append(connection)

        # Clean up disconnected connections
        for connection in disconnected:
            try:
                self.active_connections[organization_id].remove(connection)
            except ValueError:
                pass

manager = ConnectionManager()

@router.websocket("/ws/{organization_id}")
async def websocket_endpoint(websocket: WebSocket, organization_id: str):
    try:
        await manager.connect(websocket, organization_id)
        while True:
            try:
                # Keep connection alive with ping/pong
                data = await websocket.receive_text()
                if data == "ping":
                    await websocket.send_text("pong")
            except WebSocketDisconnect:
                manager.disconnect(websocket, organization_id)
                break
            except Exception as e:
                logger.error(f"WebSocket error: {e}")
                break
    except Exception as e:
        logger.error(f"WebSocket connection error: {e}")
    finally:
        manager.disconnect(websocket, organization_id) 