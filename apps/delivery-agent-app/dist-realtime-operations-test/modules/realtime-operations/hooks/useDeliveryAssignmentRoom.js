"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeliveryAssignmentRoom = void 0;
const react_1 = require("react");
const delivery_realtime_socket_service_1 = require("../services/delivery-realtime-socket.service");
const delivery_realtime_store_1 = require("../store/delivery-realtime.store");
const useDeliveryAssignmentRoom = (assignmentId) => {
    const socketConnected = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.socketConnected);
    const addAssignmentRoom = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.addAssignmentRoom);
    const removeAssignmentRoom = (0, delivery_realtime_store_1.useDeliveryRealtimeStore)((state) => state.removeAssignmentRoom);
    const normalizedAssignmentId = assignmentId?.trim() ?? '';
    (0, react_1.useEffect)(() => {
        if (!normalizedAssignmentId) {
            return undefined;
        }
        addAssignmentRoom(normalizedAssignmentId);
        return () => {
            removeAssignmentRoom(normalizedAssignmentId);
            (0, delivery_realtime_socket_service_1.leaveAssignmentRoom)(normalizedAssignmentId);
        };
    }, [addAssignmentRoom, normalizedAssignmentId, removeAssignmentRoom]);
    (0, react_1.useEffect)(() => {
        if (!socketConnected || !normalizedAssignmentId) {
            return;
        }
        const activeAssignmentRooms = delivery_realtime_store_1.useDeliveryRealtimeStore.getState().activeAssignmentRooms;
        if (activeAssignmentRooms.includes(normalizedAssignmentId)) {
            (0, delivery_realtime_socket_service_1.joinAssignmentRoom)(normalizedAssignmentId);
        }
    }, [normalizedAssignmentId, socketConnected]);
};
exports.useDeliveryAssignmentRoom = useDeliveryAssignmentRoom;
