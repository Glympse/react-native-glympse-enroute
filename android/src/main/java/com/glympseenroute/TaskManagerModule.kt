package com.glympseenroute

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray

import com.glympse.android.core.GArray
import com.glympse.android.core.CoreFactory
import com.glympse.enroute.android.api.GTask

class TaskManagerModule(reactContext: ReactApplicationContext) :
  NativeTaskManagerSpec(reactContext) {


  override fun refresh() {
    EnRouteWrapper.manager?.getTaskManager()?.refresh()
  }

  override fun getTasks(promise: Promise) {
    val array = Arguments.createArray()
    val tasks = EnRouteWrapper.manager?.getTaskManager()?.getTasks()

    tasks?.forEach { task ->
      array.pushMap(ObjectEncoder.encodeTask(task as GTask, false))
    }

    promise.resolve(array)
  }

  override fun findTaskById(taskId: Double, promise: Promise) {
    val task = EnRouteWrapper.manager?.getTaskManager()?.findTaskById(taskId.toLong())
    promise.resolve(ObjectEncoder.encodeTask(task, false))
  }

  override fun startTask(taskId: Double, promise: Promise) {
    val task = EnRouteWrapper.manager?.getTaskManager()?.findTaskById(taskId.toLong())
    val success = EnRouteWrapper.manager?.getTaskManager()?.startTask(task) ?: false
    promise.resolve(success)
  }

  override fun setTaskPhase(taskId: Double, phase: String, promise: Promise) {
    val task = EnRouteWrapper.manager?.getTaskManager()?.findTaskById(taskId.toLong())
    val success = EnRouteWrapper.manager?.getTaskManager()?.setTaskPhase(task, phase) ?: false
    promise.resolve(success)
  }

  override fun completeTask(taskId: Double, promise: Promise) {
    val task = EnRouteWrapper.manager?.getTaskManager()?.findTaskById(taskId.toLong())
    val operation = task?.getOperation()
    val success = EnRouteWrapper.manager?.getTaskManager()?.completeOperation(operation) ?: false
    promise.resolve(success)
  }

  override fun setTravelMode(taskId: Double, mode: String) {
    val task = EnRouteWrapper.manager?.getTaskManager()?.findTaskById(taskId.toLong())
    EnRouteWrapper.manager?.getTaskManager()?.setTravelModeForTask(task, mode)
  }

  override fun getTravelMode(taskId: Double, promise: Promise) {
    val task = EnRouteWrapper.manager?.getTaskManager()?.findTaskById(taskId.toLong())
    val mode = EnRouteWrapper.manager?.getTaskManager()?.getTravelModeForTask(task)
    promise.resolve(mode)
  }

  override fun addOrUpdateMetadata(taskId: Double, key: String, value: String) {
    val task = EnRouteWrapper.manager?.getTaskManager()?.findTaskById(taskId.toLong())
    val primitiveWrapper = CoreFactory.createPrimitive(value)
    EnRouteWrapper.manager?.getTaskManager()?.addOrUpdateMetadataItem(task, key, primitiveWrapper)
  }

  override fun getTicketWithFullLocationArray(taskId: Double, promise: Promise) {
    val task = EnRouteWrapper.manager?.getTaskManager()?.findTaskById(taskId.toLong())
    val operation = task?.getOperation()
    val ticket = operation?.getTicket()
    promise.resolve(ObjectEncoder.encodeTicket(ticket, true))
  }

  companion object {
    const val NAME = NativeTaskManagerSpec.NAME
  }
}
