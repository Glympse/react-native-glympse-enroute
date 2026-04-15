package com.glympseenroute

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

import com.glympse.enroute.android.api.EnRouteConstants

class GlympseEnrouteModule(reactContext: ReactApplicationContext) :
  NativeGlympseEnrouteSpec(reactContext) {

  override fun initModule() {
    EnRouteWrapper.init(reactApplicationContext, this)
  }

  override fun start() {
    EnRouteWrapper.manager?.start()
  }

  override fun stop() {
    EnRouteWrapper.manager?.stop()
  }

  override fun isStarted(promise: Promise) {
    promise.resolve(EnRouteWrapper.manager?.isStarted() ?: false)
  }

  override fun setActive(active: Boolean) {
    EnRouteWrapper.manager?.setActive(active)
  }

  override fun isLoginNeeded(promise: Promise) {
    promise.resolve(EnRouteWrapper.manager?.isLoginNeeded() ?: false)
  }

  override fun setAuthenticationMode(mode: Double) {
    EnRouteWrapper.manager?.setAuthenticationMode(mode.toInt()) 
  }

  override fun loginWithCredentials(username: String, password: String, promise: Promise) {
    promise.resolve(EnRouteWrapper.manager?.loginWithCredentials(username, password) ?: false)
  }

  override fun loginWithToken(token: String, expires_in: Double, promise: Promise) {
    promise.resolve(EnRouteWrapper.manager?.loginWithToken(token, expires_in.toLong()) ?: false)
  }

  override fun logout(reason: Double) {
    EnRouteWrapper.manager?.logout(reason.toInt())
  }

  override fun overrideLoggingLevel(level: Double) {
    EnRouteWrapper.manager?.overrideLoggingLevels(level.toInt(), level.toInt())
  }

  override fun refresh() {
    EnRouteWrapper.manager?.refresh()
  }

  override fun registerDeviceToken(token: String) {
    EnRouteWrapper.manager?.registerDeviceToken("google", token)
  }

  override fun handleRemoteNotification(payload: String) {
    EnRouteWrapper.manager?.handleRemoteNotification(payload)
  }

  override fun getOrganization(promise: Promise) {
    val organization = EnRouteWrapper.manager?.getOrganization()
    promise.resolve(ObjectEncoder.encodeOrganization(organization))
  }

  override fun getSelfAgent(promise: Promise) {
    val agent = EnRouteWrapper.manager?.getSelfAgent()
    promise.resolve(ObjectEncoder.encodeAgent(agent))
  }

    override fun getTypedExportedConstants(): Map<String, Any> {
    val constants = mutableMapOf<String, Any>()
    
    // 1. Iterate through Fields
    val fields = EnRouteConstants::class.java.fields
    for (field in fields) {
      try {
        constants[field.name] = field.get(null)
      } catch (e: IllegalAccessException) {
        // Skip inaccessible fields
      }
    }

    // 2. Iterate through Methods that return String
    val methods = EnRouteConstants::class.java.methods
    for (method in methods) {
        val name = method.name
        // Check if the method returns String.class and has no parameters
        if (method.returnType == String::class.java && method.parameterTypes.isEmpty()) {
            try {
                val obj = method.invoke(null)
                constants[name] = obj
            } catch (e: IllegalAccessException) {
                // Ignore access issues
            } catch (e: ReflectiveOperationException) {
                // Catches InvocationTargetException and others related to reflection failure
            } catch (e: Exception) {
                // Catch anything else
            }
        }
    }

    return constants
  }

  companion object {
    const val NAME = NativeGlympseEnrouteSpec.NAME
  }
}
