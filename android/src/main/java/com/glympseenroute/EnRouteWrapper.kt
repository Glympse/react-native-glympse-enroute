package com.glympseenroute

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Arguments

import android.util.Log

import com.glympse.enroute.android.api.*
import com.glympse.android.toolbox.listener.GListener
import com.glympse.android.toolbox.listener.GSource

object EnRouteWrapper : GListener {

  var context: ReactApplicationContext? = null
  var manager: GEnRouteManager? = null
  private var eventEmitter: NativeGlympseEnrouteSpec? = null

  public fun init(context: ReactApplicationContext, eventEmitter: NativeGlympseEnrouteSpec) {
    this.context = context
    this.eventEmitter = eventEmitter
    this.manager = EnRouteFactory.createEnRouteManager(context)
    this.manager?.addListener(this)
    this.manager?.getTaskManager()?.addListener(this)
  }

  private fun emitEvent(listener: Int, events: Int, obj1: Any?, obj2: Any?) {
    val map = Arguments.createMap()
    map.putInt("listener", listener)
    map.putInt("events", events)
    if (obj1 != null) {
      map.putMap("obj1", ObjectEncoder.encodeAny(obj1))
    }
    if (obj2 != null) {
      map.putMap("obj2", ObjectEncoder.encodeAny(obj2))
    }
    eventEmitter?.emitOnEnRouteEvent(map)
  }

  override fun eventsOccurred(source: GSource,listener: Int, events: Int, obj1: Any?, obj2: Any?) {
    emitEvent(listener, events, obj1, obj2)
  }

}