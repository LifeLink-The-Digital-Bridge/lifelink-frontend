# ProGuard rules for React Native / Expo app
# Keep React Native core
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep native modules and JS bridge classes
-keep class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * extends com.facebook.react.bridge.NativeModule { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Remove Android log calls in production
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Reanimated & TurboModule rules
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Expo modules
-keep class expo.modules.** { *; }

# MapLibre (OpenStreetMap) keep rules
-keep class org.maplibre.** { *; }
-dontwarn org.maplibre.**

# Keep location modules and Android location APIs
-keep class expo.modules.location.** { *; }
-dontwarn expo.modules.location.**
-keep class android.location.** { *; }

# Keep React Prop annotations
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# NOTE: Google Maps rules intentionally omitted (REMOVE google maps rules comment was present)
# If you integrate Google Maps SDK, add the necessary keep/don'twarn rules for it here.
