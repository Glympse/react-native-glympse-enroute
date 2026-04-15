package com.glympseenroute

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import java.util.HashMap

class GlympseEnroutePackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == GlympseEnrouteModule.NAME) {
      GlympseEnrouteModule(reactContext)
    } else if (name == TaskManagerModule.NAME) {
      TaskManagerModule(reactContext)
    } else if (name == EnRouteEventsModule.NAME) {
      EnRouteEventsModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      GlympseEnrouteModule.NAME to ReactModuleInfo(
        name = GlympseEnrouteModule.NAME,
        className = GlympseEnrouteModule.NAME,
        canOverrideExistingModule = false,
        needsEagerInit = false,
        isCxxModule = false,
        isTurboModule = true
      ),
      TaskManagerModule.NAME to ReactModuleInfo(
        name = TaskManagerModule.NAME,
        className = TaskManagerModule.NAME,
        canOverrideExistingModule = false,
        needsEagerInit = false,
        isCxxModule = false,
        isTurboModule = true
      ),
      EnRouteEventsModule.NAME to ReactModuleInfo(
        name = EnRouteEventsModule.NAME,
        className = EnRouteEventsModule.NAME,
        canOverrideExistingModule = false,
        needsEagerInit = false,
        isCxxModule = false,
        isTurboModule = true
      )
    )
  }
}
