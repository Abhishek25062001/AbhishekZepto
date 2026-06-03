if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/Users/shivamchowdhry/.gradle/caches/9.3.1/transforms/75910eb86c8eeae5e7b00c14eed04e84/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/shivamchowdhry/.gradle/caches/9.3.1/transforms/75910eb86c8eeae5e7b00c14eed04e84/transformed/fbjni-0.7.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

