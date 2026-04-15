package com.glympseenroute

import com.facebook.react.bridge.ReactApplicationContext

import com.glympse.enroute.android.api.EnRouteEvents

class EnRouteEventsModule(reactContext: ReactApplicationContext) :
  NativeEnRouteEventsSpec(reactContext) {


  override fun getTypedExportedConstants(): Map<String, Any> {
    val constants = mutableMapOf<String, Any>()
    
    val fields = EnRouteEvents::class.java.fields
    for (field in fields) {
      try {
        constants[field.name] = field.get(null)
      } catch (e: IllegalAccessException) {
        // Skip inaccessible fields
      }
    }

    return constants
  }

  companion object {
    const val NAME = NativeEnRouteEventsSpec.NAME
  }
}
