package com.glympseenroute

import com.glympse.enroute.android.api.GAgent
import com.glympse.enroute.android.api.GTask
import com.glympse.enroute.android.api.GOperation
import com.glympse.enroute.android.api.GOrganization
import com.glympse.enroute.android.api.GOrgConfig
import com.glympse.android.core.GArray
import com.glympse.android.core.GList
import com.glympse.android.core.GLatLng
import com.glympse.android.core.GLocation
import com.glympse.android.core.GPrimitive
import com.glympse.android.core.CC
import com.glympse.android.core.CoreConstants
import com.glympse.android.api.GPlace
import com.glympse.android.api.GTicket
import com.glympse.android.api.GTrack
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments

object ObjectEncoder {
    fun encodeAny(obj: Any?): WritableMap {
        val map = Arguments.createMap()
        if (obj == null) return map
        if (obj is GTask) {
            return encodeTask(obj, false)
        } else if (obj is GAgent) {
            return encodeAgent(obj)
        } else if (obj is GOrganization) {
            return encodeOrganization(obj)
        } else if (obj is GOperation) {
            return encodeOperation(obj, false)
        } else if (obj is GTicket) {
            return encodeTicket(obj, false)
        } else if (obj is GPlace) {
            return encodePlace(obj)
        } else if (obj is GLatLng) {
            return encodeLatLng(obj)
        } else if (obj is Long) {
            return Arguments.createMap().apply { putDouble("value", obj.toDouble()) }
        } else if (obj is String) {
            return Arguments.createMap().apply { putString("value", obj) }
        } else if (obj is Int) {
            return Arguments.createMap().apply { putDouble("value", obj.toDouble()) }
        }
        return map
    }

    fun encodeTask(task: GTask?, encodeLocationArrays: Boolean): WritableMap {
        val map = Arguments.createMap()
        if (task == null) return map
        map.putInt("state", task.getState())
        map.putDouble("id", task.getId().toDouble())
        map.putString("description", task.getDescription())
        map.putDouble("agentId", task.getAgentId().toDouble())
        map.putDouble("dueTime", task.getDueTime().toDouble())
        map.putDouble("arrivedTime", task.getArrivedTime().toDouble())
        map.putDouble("completedTime", task.getCompletedTime().toDouble())
        map.putString("phase", task.getPhase())
        map.putString("foreignId", task.getForeignId())
        map.putString("chatRoomId", task.getChatRoomId())
        map.putMap("operation", encodeOperation(task.getOperation(), encodeLocationArrays))
        map.putArray("metadata", encodeMetadata(task.getMetadata()))
        return map
    }

    fun encodeOrganization(org: GOrganization?): WritableMap {
        val map = Arguments.createMap()
        if (org == null) return map
        map.putDouble("id", org.getId().toDouble())
        map.putDouble("referrerOrgId", org.getReferrerOrgId().toDouble())
        map.putString("name", org.getName())
        map.putString("adminEmail", org.getAdminEmail())
        map.putMap("config", encodeOrgConfig(org.getConfig()))
        return map
    }

    fun encodeAgent(agent: GAgent?): WritableMap {
        val map = Arguments.createMap()
        if (agent == null) return map
        map.putDouble("id", agent.getId().toDouble())
        map.putArray("roles", encodeStringArray(agent.getRoles()))
        map.putString("name", agent.getName())
        map.putString("displayName", agent.getDisplayName())
        map.putString("email", agent.getEmail())
        map.putString("avatarUrl", agent.getGlympseAvatarUrl())
        return map
    }

    private fun encodeOrgConfig(config: GOrgConfig?): WritableMap {
        val map = Arguments.createMap()
        if (config == null) return map
        map.putString("brandingId", config.getBrandingId())
        map.putArray("completionPhases", encodeStringArray(config.getCompletionPhases()))
        map.putArray("pickerDisabledTaskPhases", encodeStringArray(config.getPickerDisabledTaskPhases()))
        map.putBoolean("isSessionMode", config.isSessionModeEnabled())
        map.putBoolean("isPickupMode", config.isPickupEnabled())
        map.putString("initialPhase", config.getInitialPhase())
        map.putString("arrivalPhase", config.getArrivalPhase())
        map.putString("finalPhase", config.getFinalPhase())
        map.putString("initialTrackingPhase", config.getInitialTrackingPhase())
        map.putBoolean("areShiftsEnabled", config.areShiftsEnabled())
        map.putString("defaultTravelMode", config.getDefaultTravelMode())
        map.putBoolean("isSignatureUploadEnabled", config.isSignatureUploadEnabled())
        map.putBoolean("isPhotoUploadEnabled", config.isPhotoUploadEnabled())
        return map
    }

    private fun encodeOperation(operation: GOperation?, encodeLocationArrays: Boolean): WritableMap {
        val map = Arguments.createMap()
        if (operation == null) return map
        map.putDouble("state", operation.getState().toDouble())
        map.putDouble("id", operation.getId().toDouble())
        map.putDouble("startTime", operation.getStartTime().toDouble())
        map.putString("ticketId", operation.getTicketId())
        map.putMap("ticket", encodeTicket(operation.getTicket(), encodeLocationArrays))
        return map
    }

    fun encodeTicket(ticket: GTicket?, encodeLocationArrays: Boolean): WritableMap {
        val map = Arguments.createMap()
        if (ticket == null) return map
        map.putString("id", ticket.getId())
        map.putString("visibility", ticket.getVisibility()?.getString())
        map.putBoolean("isCompleted", ticket.isCompleted())
        map.putMap("destination", encodePlace(ticket.getDestination()))
        map.putMap("track", encodeTrack(ticket.getTrack(), encodeLocationArrays))
        map.putMap("route", encodeTrack(ticket.getRoute(), encodeLocationArrays))
        map.putDouble("eta", ticket.getEta().toDouble())
        map.putDouble("travelMode", ticket.getTravelMode()?.getMode()?.toDouble() ?: 0.0)
        return map
    }

    private fun encodeTrack(track: GTrack?, encodeLocationArrays: Boolean): WritableMap {
        val map = Arguments.createMap()
        if (track == null) return map
        map.putDouble("length", track.length().toDouble())
        if (encodeLocationArrays) {
            map.putArray("locations", encodeLocationList(track.getLocations()))
        } else {
            val lastLocationArray = Arguments.createArray()
            val locations = track.getLocations()
            if (locations != null && locations.length() > 0) {
                val lastLocation = locations.getLast() as? GLatLng
                if (lastLocation != null) {
                    lastLocationArray.pushMap(encodeLatLng(lastLocation))
                }
            }
            map.putArray("locations", lastLocationArray)
        }
        map.putDouble("distance", track.getDistance().toDouble())
        return map
    }

    private fun encodeLatLng(latLng: GLatLng?): WritableMap {
        val map = Arguments.createMap()
        if (latLng == null) return map
        map.putDouble("latitude", latLng.getLatitude())
        map.putDouble("longitude", latLng.getLongitude())
        return map
    }

    private fun encodePlace(place: GPlace?): WritableMap {
        val map = Arguments.createMap()
        if (place == null) return map
        map.putString("name", place.getName())
        map.putDouble("latitude", place.getLatitude())
        map.putDouble("longitude", place.getLongitude())
        return map
    }

    private fun encodeMetadata(array: GArray<GPrimitive>?): WritableArray {
        val writableArray = Arguments.createArray()
        array?.forEach loop@{ item ->
            val name = item.get("n")
            val value = item.get("v")

            val map = Arguments.createMap()
            map.putString("name", name.getString())
            if ( value.type() == CC.PRIMITIVE_TYPE_DOUBLE ) {
                map.putDouble("value", value.getDouble())
            } else if ( value.type() == CC.PRIMITIVE_TYPE_LONG ) {
                map.putDouble("value", value.getLong().toDouble())
            } else if ( value.type() == CC.PRIMITIVE_TYPE_BOOLEAN ) {
                map.putBoolean("value", value.getBool())
            } else if ( value.type() == CC.PRIMITIVE_TYPE_STRING ) {
                map.putString("value", value.getString())
            } else {
                return@loop // skip unsupported type
            }

            writableArray.pushMap(map)
        }
        return writableArray
    }

    private fun encodeLocationList(array: GList<GLocation>?): WritableArray {
        val writableArray = Arguments.createArray()
        array?.forEach { item ->
            writableArray.pushMap(encodeLatLng(item as GLatLng))
        }
        return writableArray
    }

    private fun encodeStringArray(array: GArray<String>?): WritableArray {
        val writableArray = Arguments.createArray()
        array?.forEach { item ->
            writableArray.pushString(item)
        }
        return writableArray
    }
}
